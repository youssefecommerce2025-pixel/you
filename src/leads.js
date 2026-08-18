// Logique partagée de création d'un lead + preuve de consentement.
// Utilisée par le formulaire public (/api/leads) et l'intake affilié (/api/partner/leads).
// Domaine : leads fibre / télécom Proximus sur le marché belge.

import crypto from "node:crypto";
import db from "./db.js";
import { buildConsentSnapshot } from "./consent.js";

const nowIso = () => new Date().toISOString();

/* --------------------------------------------------------------------------
 * Référentiels métier (valeurs autorisées)
 * ------------------------------------------------------------------------ */
export const OPERATEURS = ["proximus", "voo_orange", "telenet_base", "autre", "aucun"];
export const OBJECTIFS = ["fibre", "pack", "mobile", "infos"];
export const TYPES_CLIENT = ["residentiel", "soho"];
export const ELIGIBILITES = ["disponible", "en_cours", "planifie", "inconnu"];

/** Déduit la région belge à partir du code postal (4 chiffres). */
export function regionFromPostalCode(cp) {
  const n = Number(String(cp || "").trim());
  if (!Number.isInteger(n) || n < 1000 || n > 9999) return null;
  if (n >= 1000 && n <= 1299) return "Bruxelles";
  // Brabant wallon (1300–1499) + Liège/Namur/Hainaut/Luxembourg (4000–7999)
  if ((n >= 1300 && n <= 1499) || (n >= 4000 && n <= 7999)) return "Wallonie";
  return "Flandre";
}

/** Normalise un numéro (retire espaces, +, 00…). */
export function normalizePhoneDigits(telephone) {
  let d = String(telephone || "").replace(/[\s.\-()/]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  return d;
}

/**
 * Numéro belge uniquement (rejette la métropole française et l'étranger).
 *  - fixe national    : 0 + 8 chiffres  (ex. Bruxelles 02 xxx xx xx)
 *  - mobile national  : 04 + 8 chiffres (ex. 0470 12 34 56)
 *  - international     : 32 + forme nationale sans le 0
 */
export function isBelgianPhone(telephone) {
  let d = normalizePhoneDigits(telephone);
  if (/^32/.test(d)) d = "0" + d.slice(2); // +32 -> forme nationale
  if (/^04\d{8}$/.test(d)) return true; // mobile (10 chiffres)
  if (/^0[1-9]\d{7}$/.test(d)) return true; // fixe (9 chiffres)
  return false;
}

/** Code postal belge : 4 chiffres (1000–9999). */
export function isBelgianPostalCode(cp) {
  return /^[1-9]\d{3}$/.test(String(cp || "").trim());
}

/** Score de qualification 0–100 (signaux commerciaux fibre). */
export function computeScore(l) {
  let s = 0;
  if (l.telephone) s += 25;
  if (l.code_postal) s += 10;
  if (["Bruxelles", "Wallonie"].includes(l.region)) s += 10; // niche francophone prioritaire
  if (["voo_orange", "telenet_base", "autre"].includes(l.operateur_actuel)) s += 20; // switcher
  else if (l.operateur_actuel === "aucun") s += 10;
  else if (l.operateur_actuel === "proximus") s += 5;
  if (["fibre", "pack"].includes(l.objectif)) s += 20;
  else if (l.objectif === "mobile") s += 10;
  if (l.type_client === "soho") s += 10;
  if (l.eligibilite_fibre === "disponible") s += 5;
  return Math.min(100, s);
}

export function validateLead(body) {
  const errors = [];
  const email = String(body.email || "").trim();
  const telephone = String(body.telephone || "").trim();
  const code_postal = String(body.code_postal || "").trim();
  if (!String(body.prenom || "").trim()) errors.push("prénom requis");
  if (!String(body.nom || "").trim()) errors.push("nom requis");
  // Email facultatif pour un lead fibre (le rappel se fait par téléphone) ; validé si fourni.
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push("email invalide");
  if (!isBelgianPhone(telephone)) {
    errors.push(
      "téléphone invalide : indiquez un numéro belge (ex. 0470 12 34 56 ou 02 123 45 67)"
    );
  }
  if (!code_postal) {
    errors.push("code postal requis");
  } else if (!isBelgianPostalCode(code_postal)) {
    errors.push("code postal invalide : 4 chiffres (Belgique, 1000 à 9999)");
  }
  return { errors, email, telephone };
}

/** Restreint une valeur à une liste blanche (sinon null). */
function oneOf(value, allowed) {
  const v = String(value || "").trim().toLowerCase();
  return allowed.includes(v) ? v : null;
}

const insertLead = db.prepare(`
  INSERT INTO leads (
    created_at, updated_at, civilite, prenom, nom, email, telephone, code_postal, adresse,
    region, operateur_actuel, objectif, type_client, eligibilite_fibre,
    source, persona, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    statut, score, double_optin_confirme
  ) VALUES (
    @created_at, @updated_at, @civilite, @prenom, @nom, @email, @telephone, @code_postal, @adresse,
    @region, @operateur_actuel, @objectif, @type_client, @eligibilite_fibre,
    @source, @persona, @utm_source, @utm_medium, @utm_campaign, @utm_term, @utm_content,
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
 * Crée un lead et sa preuve de consentement dans une transaction.
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

  const code_postal = body.code_postal ? String(body.code_postal).trim() : null;
  const leadData = {
    created_at: ts,
    updated_at: ts,
    civilite: body.civilite || null,
    prenom: String(body.prenom).trim(),
    nom: String(body.nom).trim(),
    email: email || null,
    telephone,
    code_postal,
    adresse: body.adresse ? String(body.adresse).trim() : null,
    region: body.region || regionFromPostalCode(code_postal) || null,
    operateur_actuel: oneOf(body.operateur_actuel, OPERATEURS),
    objectif: oneOf(body.objectif, OBJECTIFS),
    type_client: oneOf(body.type_client, TYPES_CLIENT) || "residentiel",
    eligibilite_fibre: oneOf(body.eligibilite_fibre, ELIGIBILITES) || "inconnu",
    source: source || body.source || "formulaire",
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
