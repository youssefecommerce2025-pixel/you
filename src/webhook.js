// Transmission automatique d'un lead qualifie vers le CRM de la societe partenaire.
//
// - URL cible : PARTNER_WEBHOOK_URL (globale) ou par partenaire (voir resolveUrl).
// - Signature HMAC-SHA256 (en-tete X-Signature) si PARTNER_WEBHOOK_SECRET est defini,
//   pour que le partenaire verifie l'authenticite du payload.
// - Retries avec backoff, et tracabilite complete dans la table webhook_deliveries.
// - Le payload inclut un resume de la preuve de consentement (RGPD / DNCM).

import crypto from "node:crypto";
import db from "./db.js";

const nowIso = () => new Date().toISOString();
const MAX_ATTEMPTS = Number(process.env.WEBHOOK_MAX_ATTEMPTS || 3);

export function webhookConfigured() {
  return Boolean(process.env.PARTNER_WEBHOOK_URL);
}

// Permet de router vers des URLs differentes selon le partenaire (optionnel).
// Convention : variable d'env PARTNER_WEBHOOK_URL__<SLUG> (slug en MAJUSCULES, non-alnum -> _).
function resolveUrl(partenaire) {
  if (partenaire) {
    const slug = String(partenaire)
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const specific = process.env[`PARTNER_WEBHOOK_URL__${slug}`];
    if (specific) return specific;
  }
  return process.env.PARTNER_WEBHOOK_URL || null;
}

function buildPayload(lead, proof) {
  return {
    event: "lead.transmis",
    sent_at: nowIso(),
    lead: {
      id: lead.id,
      civilite: lead.civilite,
      prenom: lead.prenom,
      nom: lead.nom,
      email: lead.email,
      telephone: lead.telephone,
      code_postal: lead.code_postal,
      adresse: lead.adresse,
      region: lead.region,
      operateur_actuel: lead.operateur_actuel,
      objectif: lead.objectif,
      type_client: lead.type_client,
      eligibilite_fibre: lead.eligibilite_fibre,
      score: lead.score,
      created_at: lead.created_at,
    },
    partenaire: lead.partenaire || null,
    // Résumé de preuve de consentement
    consentement: proof
      ? {
          horodatage: proof.collected_at,
          adresse_ip: proof.ip_address,
          url_de_capture: proof.source_url,
          version: proof.consent_version,
          methode: proof.method,
          double_optin_confirme: !!proof.confirmed_at,
        }
      : null,
  };
}

function sign(body) {
  const secret = process.env.PARTNER_WEBHOOK_SECRET;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function record({ lead_id, url, status, http_status, attempts, response, error }) {
  db.prepare(
    `INSERT INTO webhook_deliveries (lead_id, url, status, http_status, attempts, response, error, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    lead_id,
    url,
    status,
    http_status ?? null,
    attempts,
    response ? String(response).slice(0, 2000) : null,
    error ?? null,
    nowIso()
  );
}

// Transmet un lead. Retourne { ok, status, http_status, ... }.
export async function dispatchLead(lead) {
  const url = resolveUrl(lead.partenaire);
  if (!url) {
    record({
      lead_id: lead.id,
      url: "(non configure)",
      status: "skipped",
      attempts: 0,
      error: "Aucune URL de webhook configuree",
    });
    return { ok: false, status: "skipped", reason: "no_url" };
  }

  const proof = db
    .prepare("SELECT * FROM consent_proofs WHERE lead_id = ? ORDER BY id DESC LIMIT 1")
    .get(lead.id);
  const payload = buildPayload(lead, proof);
  const body = JSON.stringify(payload);
  const signature = sign(body);

  let lastError = null;
  let lastHttp = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Event": "lead.transmis",
          "X-Lead-Id": String(lead.id),
          ...(signature ? { "X-Signature": `sha256=${signature}` } : {}),
        },
        body,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      lastHttp = res.status;
      const text = await res.text().catch(() => "");
      if (res.ok) {
        record({
          lead_id: lead.id,
          url,
          status: "success",
          http_status: res.status,
          attempts: attempt,
          response: text,
        });
        return { ok: true, status: "success", http_status: res.status, attempts: attempt };
      }
      lastError = `HTTP ${res.status}: ${text.slice(0, 200)}`;
    } catch (e) {
      lastError = String(e?.message || e);
    }
    if (attempt < MAX_ATTEMPTS) await sleep(500 * attempt); // backoff simple
  }

  record({
    lead_id: lead.id,
    url,
    status: "error",
    http_status: lastHttp,
    attempts: MAX_ATTEMPTS,
    error: lastError,
  });
  return { ok: false, status: "error", http_status: lastHttp, error: lastError };
}

export function deliveriesForLead(leadId) {
  return db
    .prepare("SELECT * FROM webhook_deliveries WHERE lead_id = ? ORDER BY id DESC")
    .all(leadId);
}
