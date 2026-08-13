import express from "express";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import db, { engineName } from "./db.js";
import {
  CONSENT_VERSION,
  CONSENT_TELEPHONE,
  mentionInformation,
  ORG,
} from "./consent.js";
import { sendDoubleOptinConfirmation, mailerMode } from "./notifier.js";
import { dispatchLead, deliveriesForLead, webhookConfigured } from "./webhook.js";
import { createLeadWithConsent, validateLead, computeScore, trancheFromDOB } from "./leads.js";
import { getVariant, listVariants, WHATSAPP_NUMBER } from "./variants.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Mot de passe admin du CRM (a definir en variable d'env en production).
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-demo-token";

app.set("trust proxy", true); // pour recuperer la vraie IP derriere un reverse proxy
app.use(express.json({ limit: "100kb" }));
app.use(express.static(join(__dirname, "..", "public")));

const nowIso = () => new Date().toISOString();

/** Recupere l'IP reelle du client (respecte trust proxy). */
function clientIp(req) {
  return (
    req.headers["cf-connecting-ip"] ||
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    ""
  );
}

/** Middleware d'authentification simple pour les routes admin/CRM. */
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.query.token;
  if (token && token === ADMIN_TOKEN) return next();
  res.status(401).json({ error: "Non autorise" });
}

/* --------------------------------------------------------------------------
 * Config publique (le front recupere le texte de consentement officiel)
 * ------------------------------------------------------------------------ */
app.get("/api/config", (req, res) => {
  res.json({
    org: ORG,
    consentVersion: CONSENT_VERSION,
    consentCheckboxLabel: CONSENT_TELEPHONE,
    informationNotice: mentionInformation(),
    whatsapp: WHATSAPP_NUMBER,
    // Prefill social (optionnel) — cles publiques uniquement.
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    facebookAppId: process.env.FACEBOOK_APP_ID || "",
    appleClientId: process.env.APPLE_CLIENT_ID || "",
    publicBaseUrl: (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, ""),
  });
});

/* --------------------------------------------------------------------------
 * Variantes de landing par ile / persona (DOM-TOM)
 * ------------------------------------------------------------------------ */
app.get("/api/variants", (req, res) => res.json({ variants: listVariants() }));

app.get("/api/variant/:slug", (req, res) => {
  const v = getVariant(req.params.slug);
  if (!v) return res.status(404).json({ error: "Variante inconnue" });
  res.json(v);
});

// URLs "propres" : /lp/martinique-senior -> sert la landing (personnalisation cote client).
app.get("/lp/:slug", (req, res) => {
  res.sendFile(join(__dirname, "..", "public", "index.html"));
});

/* --------------------------------------------------------------------------
 * Tracking des clics WhatsApp (attribution du funnel WhatsApp)
 * ------------------------------------------------------------------------ */
app.post("/api/track/whatsapp", (req, res) => {
  const b = req.body || {};
  db.prepare(
    `INSERT INTO wa_clicks (ile, persona, source, utm_source, utm_campaign, variant, ip, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    b.ile || null,
    b.persona || null,
    b.source || "whatsapp",
    b.utm_source || null,
    b.utm_campaign || null,
    b.variant || null,
    clientIp(req),
    req.headers["user-agent"] || null,
    nowIso()
  );
  res.json({ ok: true });
});

/* --------------------------------------------------------------------------
 * POINT 1 - Reception d'un lead + capture de la PREUVE de consentement
 * ------------------------------------------------------------------------ */
app.post("/api/leads", async (req, res) => {
  const b = req.body || {};

  // 1) Le consentement telephonique (opt-in) est OBLIGATOIRE et doit etre un acte positif.
  if (b.consent_telephone !== true) {
    return res.status(400).json({
      error:
        "Consentement telephonique requis. La case doit etre cochee volontairement (opt-in).",
    });
  }

  // 2) Validation des donnees.
  const { errors, email, telephone } = validateLead(b);
  if (errors.length) return res.status(400).json({ error: errors.join(", ") });

  const useDoubleOptin = process.env.DOUBLE_OPTIN === "1" || b.double_optin === true;

  let leadId, confirmToken, snapshot;
  try {
    ({ leadId, confirmToken, snapshot } = createLeadWithConsent({
      body: b,
      email,
      telephone,
      source: b.source || "formulaire",
      consent: {
        ip: clientIp(req),
        userAgent: req.headers["user-agent"] || null,
        sourceUrl: b.source_url || req.headers.referer || "",
        referer: req.headers.referer || null,
        method: useDoubleOptin ? "double_optin" : "single_optin",
      },
    }));
  } catch (e) {
    console.error("Erreur insertion lead:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }

  const response = {
    ok: true,
    leadId,
    consentVersion: snapshot.version,
    method: useDoubleOptin ? "double_optin" : "single_optin",
  };

  // En double opt-in : envoi reel du lien de confirmation par email et/ou SMS.
  if (useDoubleOptin) {
    const baseUrl = (
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`
    ).replace(/\/$/, "");
    const confirmUrl = `${baseUrl}/api/leads/confirm?token=${confirmToken}`;
    response.method = "double_optin";
    response.message =
      "Un lien de confirmation a ete envoye au prospect (double opt-in).";
    try {
      const sendResult = await sendDoubleOptinConfirmation({
        lead: { id: leadId, prenom: b.prenom, email, telephone },
        confirmUrl,
      });
      response.notification = {
        email: sendResult.email?.mode || sendResult.email?.ok,
        sms: sendResult.sms?.mode || sendResult.sms?.ok,
      };
    } catch (e) {
      console.error("Erreur envoi confirmation:", e);
    }
  }

  res.status(201).json(response);
});

/* --------------------------------------------------------------------------
 * Double opt-in : confirmation par le prospect (clic sur lien email/SMS)
 * ------------------------------------------------------------------------ */
app.get("/api/leads/confirm", (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Token manquant.");

  const proof = db
    .prepare("SELECT * FROM consent_proofs WHERE confirm_token = ?")
    .get(token);
  if (!proof) return res.status(404).send("Lien invalide ou expire.");

  const ts = nowIso();
  const tx = db.transaction(() => {
    db.prepare(
      "UPDATE consent_proofs SET confirmed_at = ?, confirm_ip = ? WHERE id = ?"
    ).run(ts, clientIp(req), proof.id);
    db.prepare(
      "UPDATE leads SET double_optin_confirme = 1, updated_at = ? WHERE id = ?"
    ).run(ts, proof.lead_id);
  });
  tx();

  res
    .status(200)
    .send(
      "<h1>Consentement confirme</h1><p>Merci, votre demande de devis mutuelle sante est bien enregistree. Un conseiller pourra vous rappeler.</p>"
    );
});

/* --------------------------------------------------------------------------
 * Droit d'opposition / desinscription (public, via lead id + email)
 * ------------------------------------------------------------------------ */
app.post("/api/leads/desinscription", (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "email requis" });
  const ts = nowIso();
  const info = db
    .prepare(
      "UPDATE leads SET desinscrit_at = ?, statut = 'non_interesse', updated_at = ? WHERE email = ? AND desinscrit_at IS NULL"
    )
    .run(ts, ts, String(email).trim());
  res.json({ ok: true, desinscrits: info.changes });
});

/* --------------------------------------------------------------------------
 * Intake de leads d'affilies externes (API key partenaire)
 * ------------------------------------------------------------------------
 * Cle API via PARTNER_API_KEYS = "cle1:NomAffilie1,cle2:NomAffilie2".
 * Le partenaire DOIT transmettre la preuve de consentement recueillie de son cote
 * (horodatage, IP, URL de capture), sinon le lead est refuse.
 */
function parsePartnerKeys() {
  const raw = process.env.PARTNER_API_KEYS || "";
  const map = new Map();
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const idx = pair.indexOf(":");
      if (idx > 0) map.set(pair.slice(0, idx), pair.slice(idx + 1));
    });
  return map;
}

function requirePartner(req, res, next) {
  const key = req.headers["x-api-key"];
  const keys = parsePartnerKeys();
  if (key && keys.has(key)) {
    req.partnerName = keys.get(key);
    return next();
  }
  res.status(401).json({ error: "Cle API partenaire invalide" });
}

app.post("/api/partner/leads", requirePartner, (req, res) => {
  const b = req.body || {};

  // Consentement obligatoire + preuve fournie par l'affilie.
  if (b.consent_telephone !== true) {
    return res.status(400).json({ error: "consent_telephone requis (opt-in)" });
  }
  const c = b.consent || {};
  if (!c.ip || !c.collected_at || !c.source_url) {
    return res.status(400).json({
      error:
        "Preuve de consentement incomplete : consent.ip, consent.collected_at et consent.source_url sont requis.",
    });
  }

  const { errors, email, telephone } = validateLead(b);
  if (errors.length) return res.status(400).json({ error: errors.join(", ") });

  let leadId;
  try {
    ({ leadId } = createLeadWithConsent({
      body: b,
      email,
      telephone,
      source: `affilie:${req.partnerName}`,
      consent: {
        ip: c.ip,
        userAgent: c.user_agent || null,
        sourceUrl: c.source_url,
        referer: c.referer || null,
        method: c.double_optin ? "double_optin" : "single_optin",
        collectedAt: c.collected_at,
        confirmedAt: c.confirmed_at || null,
        confirmIp: c.confirm_ip || null,
      },
    }));
  } catch (e) {
    console.error("Erreur intake affilie:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }

  res.status(201).json({ ok: true, leadId, source: `affilie:${req.partnerName}` });
});

/* --------------------------------------------------------------------------
 * POINT 2 - CRM : consultation et qualification des leads (protege)
 * ------------------------------------------------------------------------ */
app.get("/api/admin/leads", requireAdmin, (req, res) => {
  const { statut, q } = req.query;
  let sql = "SELECT * FROM leads WHERE 1=1";
  const params = [];
  if (statut) {
    sql += " AND statut = ?";
    params.push(statut);
  }
  if (q) {
    sql += " AND (prenom LIKE ? OR nom LIKE ? OR email LIKE ? OR telephone LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  sql += " ORDER BY created_at DESC LIMIT 500";
  const leads = db.prepare(sql).all(...params);
  res.json({ leads });
});

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const rows = db
    .prepare("SELECT statut, COUNT(*) as n FROM leads GROUP BY statut")
    .all();
  const total = db.prepare("SELECT COUNT(*) as n FROM leads").get().n;
  res.json({ total, parStatut: rows });
});

/* --------------------------------------------------------------------------
 * Tableau de bord analytics : conversion par source / UTM + entonnoir
 * ------------------------------------------------------------------------ */
app.get("/api/admin/analytics", requireAdmin, (req, res) => {
  const days = Math.min(365, Math.max(1, Number(req.query.days || 90)));
  const since = new Date(Date.now() - days * 864e5).toISOString();

  // "converti" = lead qualifie OU transmis (interet commercial concret).
  const CONV = "statut IN ('qualifie','transmis')";
  const TRANS = "statut = 'transmis'";

  const agg = (dim) =>
    db
      .prepare(
        `SELECT COALESCE(NULLIF(${dim}, ''), '(non renseigne)') AS cle,
                COUNT(*) AS leads,
                SUM(CASE WHEN ${CONV} THEN 1 ELSE 0 END) AS convertis,
                SUM(CASE WHEN ${TRANS} THEN 1 ELSE 0 END) AS transmis
         FROM leads WHERE created_at >= ?
         GROUP BY cle ORDER BY leads DESC`
      )
      .all(since)
      .map((r) => ({
        ...r,
        taux_conversion: r.leads ? Math.round((r.convertis / r.leads) * 1000) / 10 : 0,
        taux_transmission: r.leads ? Math.round((r.transmis / r.leads) * 1000) / 10 : 0,
      }));

  const total = db
    .prepare("SELECT COUNT(*) AS n FROM leads WHERE created_at >= ?")
    .get(since).n;

  // Entonnoir global
  const count = (cond) =>
    db.prepare(`SELECT COUNT(*) AS n FROM leads WHERE created_at >= ? AND ${cond}`).get(since).n;
  const funnel = {
    total,
    contactes: count("statut != 'nouveau'"),
    qualifies: count("statut = 'qualifie'"),
    transmis: count("statut = 'transmis'"),
    perdus: count("statut IN ('non_joignable','non_interesse','rejete')"),
    double_optin_confirme: count("double_optin_confirme = 1"),
    desinscrits: count("desinscrit_at IS NOT NULL"),
  };

  // Volume par jour (30 derniers jours du range)
  const parJour = db
    .prepare(
      `SELECT substr(created_at,1,10) AS jour, COUNT(*) AS leads
       FROM leads WHERE created_at >= ? GROUP BY jour ORDER BY jour DESC LIMIT 30`
    )
    .all(since);

  // CPL par ile : croise le nombre de leads avec le budget pub saisi (ad_spend).
  const leadsParIle = agg("ile");
  const spendRows = db
    .prepare(
      `SELECT COALESCE(NULLIF(ile,''),'(non renseigne)') AS cle, SUM(montant_eur) AS depense
       FROM ad_spend WHERE jour >= ? GROUP BY cle`
    )
    .all(since.slice(0, 10));
  const spendMap = Object.fromEntries(spendRows.map((r) => [r.cle, r.depense]));
  const waRows = db
    .prepare(
      `SELECT COALESCE(NULLIF(ile,''),'(non renseigne)') AS cle, COUNT(*) AS clics
       FROM wa_clicks WHERE created_at >= ? GROUP BY cle`
    )
    .all(since);
  const waMap = Object.fromEntries(waRows.map((r) => [r.cle, r.clics]));

  const parIle = leadsParIle.map((r) => {
    const depense = spendMap[r.cle] || 0;
    return {
      ...r,
      clics_whatsapp: waMap[r.cle] || 0,
      depense_eur: Math.round(depense * 100) / 100,
      cpl_eur: r.leads ? Math.round((depense / r.leads) * 100) / 100 : 0,
      cpl_qualifie_eur: r.convertis
        ? Math.round((depense / r.convertis) * 100) / 100
        : 0,
    };
  });

  const totalSpend = spendRows.reduce((s, r) => s + (r.depense || 0), 0);
  const totalWa = waRows.reduce((s, r) => s + r.clics, 0);

  res.json({
    periode_jours: days,
    funnel,
    global: {
      depense_eur: Math.round(totalSpend * 100) / 100,
      clics_whatsapp: totalWa,
      cpl_eur: total ? Math.round((totalSpend / total) * 100) / 100 : 0,
    },
    parIle,
    parSource: agg("source"),
    parPersona: agg("persona"),
    parUtmSource: agg("utm_source"),
    parUtmCampaign: agg("utm_campaign"),
    parJour,
  });
});

/* --------------------------------------------------------------------------
 * Budget publicitaire (pour le calcul du CPL) - CRUD simple
 * ------------------------------------------------------------------------ */
app.get("/api/admin/spend", requireAdmin, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM ad_spend ORDER BY jour DESC, id DESC LIMIT 500")
    .all();
  res.json({ spend: rows });
});

app.post("/api/admin/spend", requireAdmin, (req, res) => {
  const b = req.body || {};
  const jour = String(b.jour || "").slice(0, 10);
  const montant = Number(b.montant_eur);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(jour)) {
    return res.status(400).json({ error: "jour requis (format YYYY-MM-DD)" });
  }
  if (!Number.isFinite(montant) || montant < 0) {
    return res.status(400).json({ error: "montant_eur invalide" });
  }
  const info = db
    .prepare(
      `INSERT INTO ad_spend (jour, ile, source, montant_eur, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(jour, b.ile || null, b.source || null, montant, b.note || null, nowIso());
  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

app.delete("/api/admin/spend/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM ad_spend WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

const STATUTS = [
  "nouveau",
  "a_rappeler",
  "qualifie",
  "non_joignable",
  "non_interesse",
  "transmis",
  "rejete",
];

app.patch("/api/admin/leads/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
  if (!lead) return res.status(404).json({ error: "Lead introuvable" });

  const b = req.body || {};
  if (b.statut && !STATUTS.includes(b.statut)) {
    return res.status(400).json({ error: "statut invalide" });
  }

  const date_naissance = b.date_naissance ?? lead.date_naissance;
  const fields = {
    statut: b.statut ?? lead.statut,
    notes: b.notes ?? lead.notes,
    assigne_a: b.assigne_a ?? lead.assigne_a,
    courtier_orias: b.courtier_orias ?? lead.courtier_orias,
    date_naissance,
    // La tranche d'age est recalculee a partir de la date de naissance si fournie.
    tranche_age: b.date_naissance
      ? trancheFromDOB(b.date_naissance) || lead.tranche_age
      : b.tranche_age ?? lead.tranche_age,
    situation: b.situation ?? lead.situation,
    persona: b.persona ?? lead.persona,
    mutuelle_actuelle: b.mutuelle_actuelle ?? lead.mutuelle_actuelle,
    budget_mensuel: b.budget_mensuel ?? lead.budget_mensuel,
  };

  // Transmission a un courtier ORIAS : on horodate.
  let transmis_at = lead.transmis_at;
  if (b.statut === "transmis" && lead.statut !== "transmis") {
    transmis_at = nowIso();
  }

  const score = computeScore({ ...lead, ...fields });

  db.prepare(
    `UPDATE leads SET statut=@statut, notes=@notes, assigne_a=@assigne_a,
      courtier_orias=@courtier_orias, date_naissance=@date_naissance, tranche_age=@tranche_age,
      situation=@situation, persona=@persona, mutuelle_actuelle=@mutuelle_actuelle, budget_mensuel=@budget_mensuel,
      score=@score, transmis_at=@transmis_at, updated_at=@updated_at WHERE id=@id`
  ).run({ ...fields, score, transmis_at, updated_at: nowIso(), id });

  const updated = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);

  // Transmission automatique vers le CRM du courtier partenaire lorsque le lead
  // vient de passer au statut "transmis".
  let webhook = null;
  const justTransmis = b.statut === "transmis" && lead.statut !== "transmis";
  if (justTransmis && webhookConfigured()) {
    webhook = await dispatchLead(updated);
  }

  res.json({ ok: true, lead: updated, webhook });
});

/* --------------------------------------------------------------------------
 * Transmission manuelle (re-envoi) d'un lead vers le CRM courtier
 * ------------------------------------------------------------------------ */
app.post("/api/admin/leads/:id/transmettre", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
  if (!lead) return res.status(404).json({ error: "Lead introuvable" });

  const result = await dispatchLead(lead);
  if (result.ok && lead.statut !== "transmis") {
    db.prepare(
      "UPDATE leads SET statut = 'transmis', transmis_at = ?, updated_at = ? WHERE id = ?"
    ).run(nowIso(), nowIso(), id);
  }
  res.json({ ok: result.ok, webhook: result });
});

/* --------------------------------------------------------------------------
 * Historique des livraisons webhook d'un lead
 * ------------------------------------------------------------------------ */
app.get("/api/admin/leads/:id/deliveries", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  res.json({ deliveries: deliveriesForLead(id) });
});

/* --------------------------------------------------------------------------
 * Export CSV des leads (respecte les memes filtres que la liste)
 * ------------------------------------------------------------------------ */
function csvCell(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

app.get("/api/admin/leads/export.csv", requireAdmin, (req, res) => {
  const { statut, q } = req.query;
  let sql = "SELECT * FROM leads WHERE 1=1";
  const params = [];
  if (statut) {
    sql += " AND statut = ?";
    params.push(statut);
  }
  if (q) {
    sql += " AND (prenom LIKE ? OR nom LIKE ? OR email LIKE ? OR telephone LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  sql += " ORDER BY created_at DESC";
  const leads = db.prepare(sql).all(...params);

  const cols = [
    "id",
    "created_at",
    "civilite",
    "prenom",
    "nom",
    "email",
    "telephone",
    "code_postal",
    "date_naissance",
    "tranche_age",
    "situation",
    "mutuelle_actuelle",
    "budget_mensuel",
    "source",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "statut",
    "score",
    "assigne_a",
    "courtier_orias",
    "transmis_at",
    "double_optin_confirme",
    "desinscrit_at",
  ];
  const sep = ";"; // separateur FR (compatible Excel)
  const header = cols.join(sep);
  const rows = leads.map((l) => cols.map((c) => csvCell(l[c])).join(sep));
  const csv = "\uFEFF" + [header, ...rows].join("\r\n"); // BOM pour Excel/accents

  const date = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="leads-mutuelle-${date}.csv"`
  );
  res.send(csv);
});

/* --------------------------------------------------------------------------
 * Export de la PREUVE de consentement d'un lead (pour un controle CNIL/ACPR)
 * ------------------------------------------------------------------------ */
app.get("/api/admin/leads/:id/consent", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
  if (!lead) return res.status(404).json({ error: "Lead introuvable" });
  const proof = db
    .prepare("SELECT * FROM consent_proofs WHERE lead_id = ? ORDER BY id DESC LIMIT 1")
    .get(id);
  if (!proof) return res.status(404).json({ error: "Aucune preuve de consentement" });

  const snapshot = JSON.parse(proof.consent_text);
  res.json({
    lead: {
      id: lead.id,
      prenom: lead.prenom,
      nom: lead.nom,
      email: lead.email,
      telephone: lead.telephone,
    },
    preuve_consentement: {
      horodatage: proof.collected_at,
      adresse_ip: proof.ip_address,
      user_agent: proof.user_agent,
      url_de_capture: proof.source_url,
      referer: proof.referer,
      version_consentement: proof.consent_version,
      case_cochee: !!proof.consent_checkbox,
      methode: proof.method,
      texte_presente: snapshot,
      double_optin: {
        requis: proof.method === "double_optin",
        confirme_le: proof.confirmed_at,
        ip_confirmation: proof.confirm_ip,
      },
    },
  });
});

/* --------------------------------------------------------------------------
 * Certificat de consentement (document HTML imprimable / enregistrable en PDF)
 * ------------------------------------------------------------------------ */
app.get("/api/admin/leads/:id/consent/certificate", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
  if (!lead) return res.status(404).send("Lead introuvable");
  const proof = db
    .prepare("SELECT * FROM consent_proofs WHERE lead_id = ? ORDER BY id DESC LIMIT 1")
    .get(id);
  if (!proof) return res.status(404).send("Aucune preuve de consentement");

  const snap = JSON.parse(proof.consent_text);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("fr-FR", { timeZone: "UTC" }) + " (UTC)";
    } catch {
      return esc(iso);
    }
  };
  const oui = (v) => (v ? "Oui" : "Non");

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8" />
<title>Certificat de consentement - ${esc(lead.prenom)} ${esc(lead.nom)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #12333d; margin: 0; background: #f4f9fa; }
  .sheet { max-width: 800px; margin: 24px auto; background: #fff; border: 1px solid #e3edef; border-radius: 14px; padding: 40px; }
  .head { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid #0e9e92; padding-bottom: 18px; margin-bottom: 22px; }
  .head img { width: 54px; height: 54px; border-radius: 12px; }
  .head h1 { margin: 0; font-size: 1.4rem; color: #0c3a48; }
  .head span { color: #5b7683; font-size: 0.9rem; }
  h2 { font-size: 1rem; color: #0b7d74; margin: 26px 0 8px; text-transform: uppercase; letter-spacing: 0.03em; }
  table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
  td { padding: 8px 6px; border-bottom: 1px solid #eef4f5; vertical-align: top; }
  td.k { color: #5b7683; width: 230px; }
  .quote { background: #f2f8f9; border: 1px solid #e3edef; border-radius: 10px; padding: 14px; font-size: 0.9rem; white-space: pre-wrap; }
  .foot { margin-top: 26px; font-size: 0.78rem; color: #5b7683; border-top: 1px solid #eef4f5; padding-top: 14px; }
  .actions { max-width: 800px; margin: 0 auto 12px; text-align: right; }
  .btn { background: #0e9e92; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 0.95rem; }
  @media print { .actions { display: none; } body { background: #fff; } .sheet { border: none; margin: 0; max-width: none; } }
</style></head>
<body>
  <div class="actions"><button class="btn" onclick="window.print()">Imprimer / Enregistrer en PDF</button></div>
  <div class="sheet">
    <div class="head">
      <img src="/logo.png" alt="AssurDom" />
      <div>
        <h1>Certificat de consentement</h1>
        <span>Preuve de consentement au démarchage téléphonique &middot; ${esc(ORG.siteComparateur)}</span>
      </div>
    </div>

    <h2>Personne concernée</h2>
    <table>
      <tr><td class="k">Nom et prénom</td><td>${esc(lead.civilite || "")} ${esc(lead.prenom)} ${esc(lead.nom)}</td></tr>
      <tr><td class="k">Email</td><td>${esc(lead.email)}</td></tr>
      <tr><td class="k">Téléphone</td><td>${esc(lead.telephone)}</td></tr>
      <tr><td class="k">Référence du lead</td><td>#${lead.id}</td></tr>
    </table>

    <h2>Preuve de consentement</h2>
    <table>
      <tr><td class="k">Date et heure du consentement</td><td>${fmtDate(proof.collected_at)}</td></tr>
      <tr><td class="k">Adresse IP</td><td>${esc(proof.ip_address)}</td></tr>
      <tr><td class="k">Page de recueil (URL)</td><td>${esc(proof.source_url)}</td></tr>
      <tr><td class="k">Navigateur / appareil</td><td>${esc(proof.user_agent || "-")}</td></tr>
      <tr><td class="k">Version du consentement</td><td>${esc(proof.consent_version)}</td></tr>
      <tr><td class="k">Case cochée volontairement</td><td>${oui(proof.consent_checkbox)}</td></tr>
      <tr><td class="k">Méthode</td><td>${proof.method === "double_optin" ? "Double opt-in" : "Opt-in"}</td></tr>
      ${
        proof.method === "double_optin"
          ? `<tr><td class="k">Confirmation double opt-in</td><td>${
              proof.confirmed_at ? fmtDate(proof.confirmed_at) + " (IP " + esc(proof.confirm_ip || "-") + ")" : "En attente"
            }</td></tr>`
          : ""
      }
    </table>

    <h2>Texte exact présenté à la personne</h2>
    <div class="quote">${esc(snap.checkbox_label || "")}</div>

    <h2>Mention d'information affichée</h2>
    <div class="quote">${esc(snap.information_notice || "")}</div>

    <div class="foot">
      Ce certificat atteste du recueil du consentement conformément au RGPD et à la loi n° 2025-594
      du 30 juin 2025. Document généré le ${fmtDate(nowIso())} par ${esc(ORG.siteComparateur)}.
      À conserver à titre de preuve (durée recommandée : 5 ans).
    </div>
  </div>
</body></html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.get("/health", (req, res) => res.json({ ok: true, ts: nowIso() }));

// Demarre le serveur si :
//  - execute directement (node src/server.js), ou
//  - charge via le loader Hostinger (server.cjs pose START_SERVER=1).
// Ne demarre PAS pendant les tests (NODE_ENV=test).
const isMain =
  process.env.START_SERVER === "1" ||
  (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]);

if (isMain && process.env.NODE_ENV !== "test") {
  // 0.0.0.0 : obligatoire chez certains hebergeurs (Hostinger) pour que le proxy voie l'app.
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n  Plateforme leads mutuelle sante`);
    console.log(`  ------------------------------------`);
    console.log(`  Landing page : http://localhost:${PORT}/`);
    console.log(`  CRM (admin)  : http://localhost:${PORT}/admin.html`);
    console.log(`  Token admin  : ${ADMIN_TOKEN}`);
    console.log(`  Version consentement : ${CONSENT_VERSION}`);
    console.log(`  Base de donnees : ${engineName}`);
    const mode = mailerMode();
    console.log(`  Notifications : email=${mode.email}, sms=${mode.sms}`);
    console.log(
      `  Webhook courtier : ${webhookConfigured() ? "configure" : "non configure"}\n`
    );
  });
}

export default app;
