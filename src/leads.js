// Logique partagee de creation d'un lead + preuve de consentement.
// Utilisee par le formulaire public (/api/leads) et l'intake affilie (/api/partner/leads).

import crypto from "node:crypto";
import db from "./db.js";
import { buildConsentSnapshot } from "./consent.js";

const nowIso = () => new Date().toISOString();

// Derive une tranche d'age a partir d'une date de naissance (YYYY-MM-DD).
export function trancheFromDOB(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
  if (age < 0 || age > 120) return null;
  if (age < 35) return "18-34";
  if (age < 55) return "35-54";
  if (age < 65) return "55-64";
  if (age < 75) return "65-74";
  return "75+";
}

export function computeScore(l) {
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

export function validateLead(body) {
  const errors = [];
  const email = String(body.email || "").trim();
  const telephone = String(body.telephone || "").trim();
  if (!String(body.prenom || "").trim()) errors.push("prenom requis");
  if (!String(body.nom || "").trim()) errors.push("nom requis");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push("email invalide");
  const telDigits = telephone.replace(/[\s.\-()]/g, "");
  if (!/^(?:\+33|0033|0)[1-9]\d{8}$/.test(telDigits)) errors.push("telephone invalide");
  return { errors, email, telephone };
}

const insertLead = db.prepare(`
  INSERT INTO leads (
    created_at, updated_at, civilite, prenom, nom, email, telephone, code_postal,
    date_naissance, tranche_age, situation, mutuelle_actuelle, budget_mensuel,
    source, ile, persona, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    statut, score, double_optin_confirme
  ) VALUES (
    @created_at, @updated_at, @civilite, @prenom, @nom, @email, @telephone, @code_postal,
    @date_naissance, @tranche_age, @situation, @mutuelle_actuelle, @budget_mensuel,
    @source, @ile, @persona, @utm_source, @utm_medium, @utm_campaign, @utm_term, @utm_content,
    @statut, @score, @double_optin_confirme
  )
`);

const insertConsent = db.prepare(`
  INSERT INTO consent_proofs (
    lead_id, collected_at, ip_address, user_agent, source_url, referer,
    consent_version, consent_text, consent_checkbox, method, confirm_token, confirmed_at, confirm_ip
  ) VALUES (
    @lead_id, @collected_at, @ip_address, @user_agent, @source_url, @referer,
    @consent_version, @consent_text, 1, @method, @confirm_token, @confirmed_at, @confirm_ip
  )
`);

/**
 * Cree un lead et sa preuve de consentement dans une transaction.
 * @param {object} opts
 * @param {object} opts.body     - champs du prospect (deja valides)
 * @param {string} opts.email
 * @param {string} opts.telephone
 * @param {string} opts.source   - 'formulaire' | 'affilie:<nom>'
 * @param {object} opts.consent  - { ip, userAgent, sourceUrl, referer, method, collectedAt, confirmedAt, confirmIp }
 * @returns {{leadId:number, confirmToken:string|null, snapshot:object}}
 */
export function createLeadWithConsent({ body, email, telephone, source, consent }) {
  const ts = nowIso();
  const snapshot = buildConsentSnapshot();
  const method = consent.method || "single_optin";
  const confirmToken =
    method === "double_optin" && !consent.confirmedAt
      ? crypto.randomBytes(24).toString("hex")
      : null;

  const leadData = {
    created_at: ts,
    updated_at: ts,
    civilite: body.civilite || null,
    prenom: String(body.prenom).trim(),
    nom: String(body.nom).trim(),
    email,
    telephone,
    code_postal: body.code_postal ? String(body.code_postal).trim() : null,
    date_naissance: body.date_naissance || null,
    tranche_age: body.tranche_age || trancheFromDOB(body.date_naissance) || null,
    situation: body.situation || null,
    mutuelle_actuelle: body.mutuelle_actuelle || null,
    budget_mensuel: body.budget_mensuel || null,
    source: source || body.source || "formulaire",
    ile: body.ile || null,
    persona: body.persona || null,
    utm_source: body.utm_source || null,
    utm_medium: body.utm_medium || null,
    utm_campaign: body.utm_campaign || null,
    utm_term: body.utm_term || null,
    utm_content: body.utm_content || null,
    statut: "nouveau",
    score: 0,
    double_optin_confirme: consent.confirmedAt ? 1 : 0,
  };
  leadData.score = computeScore(leadData);

  const tx = db.transaction(() => {
    const info = insertLead.run(leadData);
    const leadId = info.lastInsertRowid;
    insertConsent.run({
      lead_id: leadId,
      collected_at: consent.collectedAt || ts,
      ip_address: consent.ip || "",
      user_agent: consent.userAgent || null,
      source_url: consent.sourceUrl || "",
      referer: consent.referer || null,
      consent_version: snapshot.version,
      consent_text: JSON.stringify(snapshot),
      method,
      confirm_token: confirmToken,
      confirmed_at: consent.confirmedAt || null,
      confirm_ip: consent.confirmIp || null,
    });
    return leadId;
  });

  return { leadId: tx(), confirmToken, snapshot };
}
