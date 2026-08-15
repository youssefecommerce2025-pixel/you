// Tests du module pixels (hashing CAPI + envoi Meta / TikTok).

import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  sha256Hex,
  normalizeEmail,
  toE164Digits,
  sendConversionEvents,
  pixelsConfigured,
} from "../src/pixels.js";

test("normalizeEmail : minuscules et trim", () => {
  assert.equal(normalizeEmail("  Sophie.MARTIN@Ex.FR "), "sophie.martin@ex.fr");
});

test("toE164Digits : 0696 Martinique → 596696…", () => {
  assert.equal(toE164Digits("0696 12 34 56"), "596696123456");
  assert.equal(toE164Digits("+596696123456"), "596696123456");
  assert.equal(toE164Digits("0690123456"), "590690123456");
  assert.equal(toE164Digits("0692123456"), "262692123456");
});

test("sha256Hex : email normalise produit le hash attendu", () => {
  const hex = sha256Hex(normalizeEmail("Sophie@Ex.FR"));
  assert.equal(hex.length, 64);
  assert.equal(hex, crypto.createHash("sha256").update("sophie@ex.fr").digest("hex"));
});

test("sendConversionEvents : no-op sans consentement pub", async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, text: async () => "{}" };
  };
  const r = await sendConversionEvents(
    { adsConsent: false, email: "a@b.fr", telephone: "0696123456" },
    fakeFetch,
    { META_PIXEL_ID: "1", META_CAPI_TOKEN: "t" }
  );
  assert.equal(r.skipped, true);
  assert.equal(calls.length, 0);
});

test("sendConversionEvents : no-op si tokens absents", async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, text: async () => "{}" };
  };
  const empty = {};
  const r = await sendConversionEvents(
    { adsConsent: true, email: "a@b.fr", telephone: "0696123456" },
    fakeFetch,
    empty
  );
  assert.equal(r.skipped, true);
  assert.equal(r.reason, "not_configured");
  assert.equal(calls.length, 0);
  const cfg = pixelsConfigured(empty);
  assert.equal(cfg.meta, false);
  assert.equal(cfg.tiktok, false);
});

test("sendConversionEvents : POST hashes vers Meta et TikTok si configure", async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url: String(url), body: JSON.parse(opts.body), headers: opts.headers });
    return { ok: true, status: 200, text: async () => JSON.stringify({ events_received: 1 }) };
  };
  const env = {
    META_PIXEL_ID: "111222333",
    META_CAPI_TOKEN: "EAAB-test",
    TIKTOK_PIXEL_ID: "CABCDEF",
    TIKTOK_ACCESS_TOKEN: "tt-token",
  };
  const r = await sendConversionEvents(
    {
      adsConsent: true,
      eventId: "evt-abc",
      leadId: 42,
      email: "sophie@ex.fr",
      telephone: "0696123456",
      prenom: "Sophie",
      nom: "Martin",
      codePostal: "97200",
      sourceUrl: "https://assurdom.fr/?utm_source=meta",
      ip: "203.0.113.9",
      userAgent: "TestAgent/1.0",
      fbp: "fb.1.1.1",
      fbc: "fb.1.1.clid",
      ttp: "ttp-cookie",
      ttclid: "ttclid-xyz",
    },
    fakeFetch,
    env
  );
  assert.equal(r.eventId, "evt-abc");
  assert.equal(r.meta.ok, true);
  assert.equal(r.tiktok.ok, true);
  assert.equal(calls.length, 2);

  const meta = calls.find((c) => c.url.includes("graph.facebook.com"));
  assert.ok(meta);
  assert.equal(meta.body.access_token, "EAAB-test");
  assert.equal(meta.body.data[0].event_name, "Lead");
  assert.equal(meta.body.data[0].event_id, "evt-abc");
  assert.equal(meta.body.data[0].action_source, "website");
  const em = crypto.createHash("sha256").update("sophie@ex.fr").digest("hex");
  const ph = crypto.createHash("sha256").update("596696123456").digest("hex");
  assert.equal(meta.body.data[0].user_data.em[0], em);
  assert.equal(meta.body.data[0].user_data.ph[0], ph);
  assert.equal(meta.body.data[0].user_data.fbp, "fb.1.1.1");
  assert.doesNotMatch(
    JSON.stringify(meta.body),
    /sophie@ex\.fr/i,
    "ne doit PAS contenir l'email en clair"
  );

  const tt = calls.find((c) => c.url.includes("tiktok.com"));
  assert.ok(tt);
  assert.equal(tt.headers["Access-Token"], "tt-token");
  assert.equal(tt.body.event_source, "web");
  assert.equal(tt.body.event_source_id, "CABCDEF");
  assert.equal(tt.body.data[0].event, "SubmitForm");
  assert.equal(tt.body.data[0].event_id, "evt-abc");
  assert.equal(tt.body.data[0].user.email, em);
  assert.equal(tt.body.data[0].user.phone, ph);
  assert.equal(tt.body.data[0].user.ttclid, "ttclid-xyz");
});
