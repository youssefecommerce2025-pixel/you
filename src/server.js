import express from "express";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import db from "./db.js";
import {
  CONSENT_VERSION,
  CONSENT_TELEPHONE,
  mentionInformation,
  buildConsentSnapshot,
  ORG,
} from "./consent.js";

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

/** Validation minimale des champs du lead. */
function validateLead(body) {
  const errors = [];
  const email = String(body.email || "").trim();
  const telephone = String(body.telephone || "").trim();
  if (!String(body.prenom || "").trim()) errors.push("prenom requis");
  if (!String(body.nom || "").trim()) errors.push("nom requis");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push("email invalide");
  // Numero FR : accepte formats 0X..., +33..., espaces/points
  const telDigits = telephone.replace(/[\s.\-()]/g, "");
  if (!/^(?:\+33|0033|0)[1-9]\d{8}$/.test(telDigits)) errors.push("telephone invalide");
  // Refus de tout champ suspect qui contiendrait des donnees de sante libres
  return { errors, email, telephone };
}

/** Score de qualification simple (0-100) base sur des criteres NON sensibles. */
function computeScore(l) {
  let s = 0;
  if (l.telephone) s += 20;
  if (l.email) s += 10;
  if (l.code_postal) s += 10;
  if (l.tranche_age) s += 15;
  if (l.situation) s += 10;
  if (l.mutuelle_actuelle) s += 15;
  if (["30-60", "60-100", "100+"].includes(l.budget_mensuel)) s += 20;
  return Math.min(100, s);
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
  });
});

/* --------------------------------------------------------------------------
 * POINT 1 - Reception d'un lead + capture de la PREUVE de consentement
 * ------------------------------------------------------------------------ */
app.post("/api/leads", (req, res) => {
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

  const ts = nowIso();
  const useDoubleOptin = process.env.DOUBLE_OPTIN === "1" || b.double_optin === true;
  const snapshot = buildConsentSnapshot();

  const insertLead = db.prepare(`
    INSERT INTO leads (
      created_at, updated_at, civilite, prenom, nom, email, telephone, code_postal,
      tranche_age, situation, mutuelle_actuelle, budget_mensuel,
      statut, score, double_optin_confirme
    ) VALUES (
      @created_at, @updated_at, @civilite, @prenom, @nom, @email, @telephone, @code_postal,
      @tranche_age, @situation, @mutuelle_actuelle, @budget_mensuel,
      @statut, @score, 0
    )
  `);

  const leadData = {
    created_at: ts,
    updated_at: ts,
    civilite: b.civilite || null,
    prenom: String(b.prenom).trim(),
    nom: String(b.nom).trim(),
    email,
    telephone,
    code_postal: b.code_postal ? String(b.code_postal).trim() : null,
    tranche_age: b.tranche_age || null,
    situation: b.situation || null,
    mutuelle_actuelle: b.mutuelle_actuelle || null,
    budget_mensuel: b.budget_mensuel || null,
    statut: "nouveau",
    score: 0,
  };
  leadData.score = computeScore(leadData);

  const confirmToken = useDoubleOptin ? crypto.randomBytes(24).toString("hex") : null;

  const insertConsent = db.prepare(`
    INSERT INTO consent_proofs (
      lead_id, collected_at, ip_address, user_agent, source_url, referer,
      consent_version, consent_text, consent_checkbox, method, confirm_token
    ) VALUES (
      @lead_id, @collected_at, @ip_address, @user_agent, @source_url, @referer,
      @consent_version, @consent_text, 1, @method, @confirm_token
    )
  `);

  const tx = db.transaction(() => {
    const info = insertLead.run(leadData);
    const leadId = info.lastInsertRowid;
    insertConsent.run({
      lead_id: leadId,
      collected_at: ts,
      ip_address: clientIp(req),
      user_agent: req.headers["user-agent"] || null,
      source_url: b.source_url || req.headers.referer || "",
      referer: req.headers.referer || null,
      consent_version: snapshot.version,
      consent_text: JSON.stringify(snapshot),
      method: useDoubleOptin ? "double_optin" : "single_optin",
      confirm_token: confirmToken,
    });
    return leadId;
  });

  let leadId;
  try {
    leadId = tx();
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

  // En double opt-in : ici tu enverrais un email/SMS avec le lien de confirmation.
  if (useDoubleOptin) {
    response.confirmUrl = `/api/leads/confirm?token=${confirmToken}`;
    response.message =
      "Un lien de confirmation doit etre envoye au prospect (double opt-in).";
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

const STATUTS = [
  "nouveau",
  "a_rappeler",
  "qualifie",
  "non_joignable",
  "non_interesse",
  "transmis",
  "rejete",
];

app.patch("/api/admin/leads/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
  if (!lead) return res.status(404).json({ error: "Lead introuvable" });

  const b = req.body || {};
  if (b.statut && !STATUTS.includes(b.statut)) {
    return res.status(400).json({ error: "statut invalide" });
  }

  const fields = {
    statut: b.statut ?? lead.statut,
    notes: b.notes ?? lead.notes,
    assigne_a: b.assigne_a ?? lead.assigne_a,
    courtier_orias: b.courtier_orias ?? lead.courtier_orias,
    tranche_age: b.tranche_age ?? lead.tranche_age,
    situation: b.situation ?? lead.situation,
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
      courtier_orias=@courtier_orias, tranche_age=@tranche_age, situation=@situation,
      mutuelle_actuelle=@mutuelle_actuelle, budget_mensuel=@budget_mensuel,
      score=@score, transmis_at=@transmis_at, updated_at=@updated_at WHERE id=@id`
  ).run({ ...fields, score, transmis_at, updated_at: nowIso(), id });

  res.json({ ok: true, lead: db.prepare("SELECT * FROM leads WHERE id = ?").get(id) });
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

app.get("/health", (req, res) => res.json({ ok: true, ts: nowIso() }));

app.listen(PORT, () => {
  console.log(`\n  Plateforme leads mutuelle sante`);
  console.log(`  ------------------------------------`);
  console.log(`  Landing page : http://localhost:${PORT}/`);
  console.log(`  CRM (admin)  : http://localhost:${PORT}/admin.html`);
  console.log(`  Token admin  : ${ADMIN_TOKEN}`);
  console.log(`  Version consentement : ${CONSENT_VERSION}\n`);
});
