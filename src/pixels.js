// Pixels publicitaires Meta (Facebook) et TikTok.
//
// - Cote navigateur : les IDs publics sont exposes via /api/config ; le script
//   public/pixels.js ne charge les tags QU'APRES consentement cookies "ads".
// - Cote serveur (CAPI / Events API) : envoi de l'evenement Lead avec email /
//   telephone hashes SHA-256, uniquement si ads_consent === true.
// - Deduplication : le meme event_id est envoye par le navigateur ET le serveur.
//
// Aucune donnee de sante n'est transmise. Les tokens CAPI restent cote serveur.

import crypto from "node:crypto";

const META_GRAPH_VERSION = "v21.0";
const META_EVENTS_URL = (pixelId) =>
  `https://graph.facebook.com/${META_GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events`;
const TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

function readEnv(env, ...keys) {
  const src = env || process.env;
  for (const key of keys) {
    const v = String(src[key] || "").trim();
    if (v) return v;
  }
  return "";
}

export function metaPixelId(env) {
  return readEnv(env, "META_PIXEL_ID", "FACEBOOK_PIXEL_ID");
}

export function tiktokPixelId(env) {
  return readEnv(env, "TIKTOK_PIXEL_ID");
}

function metaCapiToken(env) {
  return readEnv(env, "META_CAPI_TOKEN", "META_CAPI_ACCESS_TOKEN");
}

function tiktokAccessToken(env) {
  return readEnv(env, "TIKTOK_ACCESS_TOKEN");
}

export function pixelsConfigured(env) {
  return {
    meta: Boolean(metaPixelId(env)),
    tiktok: Boolean(tiktokPixelId(env)),
    metaCapi: Boolean(metaPixelId(env) && metaCapiToken(env)),
    tiktokEvents: Boolean(tiktokPixelId(env) && tiktokAccessToken(env)),
  };
}

export function sha256Hex(value) {
  const s = String(value || "").trim();
  if (!s) return "";
  return crypto.createHash("sha256").update(s).digest("hex");
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhoneDigits(telephone) {
  let d = String(telephone || "").replace(/[\s.\-()]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  return d;
}

/**
 * Convertit un numero DOM-TOM en chiffres E.164 (sans +), pour le hashing CAPI.
 * 0696123456 → 596696123456
 */
export function toE164Digits(telephone) {
  const d = normalizePhoneDigits(telephone);
  if (!d) return "";
  if (d.startsWith("0")) {
    const rest = d.slice(1);
    const prefix3 = rest.slice(0, 3);
    const country = {
      590: "590",
      690: "590",
      691: "590",
      596: "596",
      696: "596",
      697: "596",
      594: "594",
      694: "594",
      262: "262",
      692: "262",
      693: "262",
      269: "262",
      639: "262",
      508: "508",
      687: "687",
      689: "689",
      681: "681",
    }[prefix3];
    if (country) return country + rest;
  }
  return d;
}

function hashName(value) {
  const s = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z]/g, "");
  return sha256Hex(s);
}

function cleanClickId(value) {
  const s = String(value || "").trim();
  return s && s.length < 512 ? s : "";
}

/**
 * Envoie l'evenement de conversion aux APIs serveur Meta et TikTok.
 * No-op si les tokens ne sont pas configures, ou si adsConsent n'est pas true.
 * Ne bloque jamais la creation du lead (erreurs logguees, jamais throw vers l'appelant).
 */
export async function sendConversionEvents(payload, fetchImpl = fetch, env = process.env) {
  if (!payload || payload.adsConsent !== true) {
    return { skipped: true, reason: "no_ads_consent" };
  }

  const cfg = pixelsConfigured(env);
  if (!cfg.metaCapi && !cfg.tiktokEvents) {
    return { skipped: true, reason: "not_configured" };
  }

  const eventId = String(payload.eventId || crypto.randomUUID());
  const eventTime = Math.floor(Date.now() / 1000);
  const email = normalizeEmail(payload.email);
  const phone = toE164Digits(payload.telephone);
  const em = sha256Hex(email);
  const ph = sha256Hex(phone);
  const fn = hashName(payload.prenom);
  const ln = hashName(payload.nom);
  const zp = sha256Hex(String(payload.codePostal || "").trim());
  const country = sha256Hex("fr");
  const sourceUrl = String(payload.sourceUrl || "").slice(0, 2048);
  const ip = String(payload.ip || "").slice(0, 64);
  const ua = String(payload.userAgent || "").slice(0, 512);
  const fbp = cleanClickId(payload.fbp);
  const fbc = cleanClickId(payload.fbc);
  const ttp = cleanClickId(payload.ttp);
  const ttclid = cleanClickId(payload.ttclid);
  const externalId = payload.leadId ? sha256Hex(String(payload.leadId)) : "";

  const results = { eventId, meta: null, tiktok: null };

  if (cfg.metaCapi) {
    const user_data = {
      em: em ? [em] : undefined,
      ph: ph ? [ph] : undefined,
      fn: fn || undefined,
      ln: ln || undefined,
      zp: zp || undefined,
      country: country || undefined,
      external_id: externalId || undefined,
      client_ip_address: ip || undefined,
      client_user_agent: ua || undefined,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    };
    Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

    const body = {
      data: [
        {
          event_name: "Lead",
          event_time: eventTime,
          event_id: eventId,
          event_source_url: sourceUrl || undefined,
          action_source: "website",
          user_data,
          custom_data: {
            content_name: "devis_mutuelle",
            content_category: "mutuelle_sante",
            currency: "EUR",
          },
        },
      ],
      access_token: metaCapiToken(env),
    };
    const testCode = readEnv(env, "META_TEST_EVENT_CODE");
    if (testCode) body.test_event_code = testCode;

    results.meta = await postJson(fetchImpl, META_EVENTS_URL(metaPixelId(env)), body);
  }

  if (cfg.tiktokEvents) {
    const user = {
      email: em || undefined,
      phone: ph || undefined,
      ip: ip || undefined,
      user_agent: ua || undefined,
      locale: "fr-FR",
      ttclid: ttclid || undefined,
      ttp: ttp || undefined,
      external_id: externalId || undefined,
    };
    Object.keys(user).forEach((k) => user[k] === undefined && delete user[k]);

    const body = {
      event_source: "web",
      event_source_id: tiktokPixelId(env),
      data: [
        {
          event: "SubmitForm",
          event_time: eventTime,
          event_id: eventId,
          user,
          page: { url: sourceUrl || undefined },
          properties: {
            content_type: "product",
            contents: [{ content_id: "devis_mutuelle", content_name: "devis_mutuelle" }],
            currency: "EUR",
          },
        },
      ],
    };
    const testCode = readEnv(env, "TIKTOK_TEST_EVENT_CODE");
    if (testCode) body.test_event_code = testCode;

    results.tiktok = await postJson(fetchImpl, TIKTOK_EVENTS_URL, body, {
      "Access-Token": tiktokAccessToken(env),
    });
  }

  return results;
}

async function postJson(fetchImpl, url, body, extraHeaders = {}) {
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...extraHeaders },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
    if (!res.ok) {
      console.error("Pixels API error", res.status, url, json);
      return { ok: false, status: res.status, body: json };
    }
    return { ok: true, status: res.status, body: json };
  } catch (e) {
    console.error("Pixels API network error", url, e);
    return { ok: false, error: String(e?.message || e) };
  }
}
