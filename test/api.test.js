// Tests d'integration de l'API (runner integre node:test).
// Chaque execution utilise une base SQLite temporaire isolee.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import crypto from "node:crypto";
import http from "node:http";

// Configure l'environnement AVANT d'importer l'app (db.js lit ces variables a l'import).
const TMP = mkdtempSync(join(tmpdir(), "leads-test-"));
process.env.DATA_DIR = TMP;
process.env.DB_PATH = join(TMP, "test.sqlite");
process.env.ADMIN_TOKEN = "test-token";
process.env.NODE_ENV = "test";
process.env.PARTNER_API_KEYS = "aff-key-1:AffilieTest";
process.env.WHATSAPP_NUMBER = "596696000000";

let server;
let baseUrl;
const admin = { headers: { Authorization: "Bearer test-token" } };

before(async () => {
  const { default: app } = await import("../src/server.js");
  server = http.createServer(app);
  await new Promise((r) => server.listen(0, r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server?.close();
  rmSync(TMP, { recursive: true, force: true });
});

async function req(method, path, { body, headers } = {}) {
  const res = await fetch(baseUrl + path, {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, json };
}

const validLead = () => ({
  prenom: "Sophie",
  nom: "Martin",
  email: `sophie${Math.random().toString(36).slice(2)}@ex.fr`,
  telephone: "0612345678",
  tranche_age: "55-64",
  budget_mensuel: "60-100",
  consent_telephone: true,
});

test("GET /health renvoie ok", async () => {
  const r = await req("GET", "/health");
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
});

test("GET /api/config expose la version et le libelle de consentement", async () => {
  const r = await req("GET", "/api/config");
  assert.equal(r.status, 200);
  assert.ok(r.json.consentVersion);
  assert.match(r.json.consentCheckboxLabel, /telephone/i);
});

test("POST /api/leads refuse sans consentement", async () => {
  const body = { ...validLead(), consent_telephone: false };
  const r = await req("POST", "/api/leads", { body });
  assert.equal(r.status, 400);
  assert.match(r.json.error, /consentement/i);
});

test("POST /api/leads refuse un telephone invalide", async () => {
  const body = { ...validLead(), telephone: "123" };
  const r = await req("POST", "/api/leads", { body });
  assert.equal(r.status, 400);
  assert.match(r.json.error, /telephone/i);
});

test("POST /api/leads cree un lead avec opt-in et enregistre la preuve", async () => {
  const body = { ...validLead(), utm_source: "google", utm_campaign: "mutuelle-senior" };
  const r = await req("POST", "/api/leads", {
    body,
    headers: { Referer: "https://compare.fr/devis" },
  });
  assert.equal(r.status, 201);
  assert.ok(r.json.leadId);

  const proof = await req("GET", `/api/admin/leads/${r.json.leadId}/consent`, admin);
  assert.equal(proof.status, 200);
  assert.equal(proof.json.preuve_consentement.case_cochee, true);
  assert.ok(proof.json.preuve_consentement.horodatage);
  assert.ok(proof.json.preuve_consentement.version_consentement);
});

test("Les routes admin exigent un token", async () => {
  const r = await req("GET", "/api/admin/leads");
  assert.equal(r.status, 401);
});

test("PATCH /api/admin/leads/:id met a jour le statut et le score", async () => {
  const created = await req("POST", "/api/leads", { body: validLead() });
  const id = created.json.leadId;
  const r = await req("PATCH", `/api/admin/leads/${id}`, {
    ...admin,
    body: { statut: "qualifie", notes: "OK" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.lead.statut, "qualifie");
  assert.ok(r.json.lead.score > 0);
});

test("PATCH refuse un statut invalide", async () => {
  const created = await req("POST", "/api/leads", { body: validLead() });
  const r = await req("PATCH", `/api/admin/leads/${created.json.leadId}`, {
    ...admin,
    body: { statut: "n_importe_quoi" },
  });
  assert.equal(r.status, 400);
});

test("Export CSV protege + contient l'entete attendue", async () => {
  const noauth = await req("GET", "/api/admin/leads/export.csv");
  assert.equal(noauth.status, 401);

  const res = await fetch(baseUrl + "/api/admin/leads/export.csv", admin);
  assert.equal(res.status, 200);
  const csv = await res.text();
  assert.match(csv, /utm_source/);
  assert.match(csv, /telephone/);
});

test("Intake affilie : refuse sans cle API", async () => {
  const r = await req("POST", "/api/partner/leads", { body: validLead() });
  assert.equal(r.status, 401);
});

test("Intake affilie : refuse une preuve de consentement incomplete", async () => {
  const r = await req("POST", "/api/partner/leads", {
    headers: { "x-api-key": "aff-key-1" },
    body: { ...validLead() }, // pas d'objet consent
  });
  assert.equal(r.status, 400);
  assert.match(r.json.error, /consentement/i);
});

test("Intake affilie : cree un lead avec source=affilie:<nom>", async () => {
  const r = await req("POST", "/api/partner/leads", {
    headers: { "x-api-key": "aff-key-1" },
    body: {
      ...validLead(),
      consent: {
        ip: "203.0.113.5",
        collected_at: new Date().toISOString(),
        source_url: "https://affilie.fr/devis",
        user_agent: "test",
      },
    },
  });
  assert.equal(r.status, 201);
  assert.equal(r.json.source, "affilie:AffilieTest");
});

test("Analytics : renvoie l'entonnoir et les agregats par source/UTM", async () => {
  const r = await req("GET", "/api/admin/analytics?days=90", admin);
  assert.equal(r.status, 200);
  assert.ok(r.json.funnel);
  assert.ok(Array.isArray(r.json.parSource));
  assert.ok(Array.isArray(r.json.parUtmSource));
  assert.ok(r.json.funnel.total >= 1);
});

test("Desinscription : marque le lead comme desinscrit", async () => {
  const lead = validLead();
  await req("POST", "/api/leads", { body: lead });
  const r = await req("POST", "/api/leads/desinscription", { body: { email: lead.email } });
  assert.equal(r.status, 200);
  assert.ok(r.json.desinscrits >= 1);
});

test("Webhook : transmission 'skipped' si non configure", async () => {
  const created = await req("POST", "/api/leads", { body: validLead() });
  const r = await req("POST", `/api/admin/leads/${created.json.leadId}/transmettre`, admin);
  assert.equal(r.status, 200);
  assert.equal(r.json.webhook.status, "skipped");
});

test("Variantes : /api/variant/:slug renvoie la personnalisation DOM", async () => {
  const r = await req("GET", "/api/variant/martinique-senior");
  assert.equal(r.status, 200);
  assert.equal(r.json.ile, "Martinique");
  assert.equal(r.json.persona, "senior");
  assert.equal(r.json.whatsapp, "596696000000");
  const bad = await req("GET", "/api/variant/inconnu");
  assert.equal(bad.status, 404);
});

test("Variantes : /lp/:slug sert la landing page (HTML)", async () => {
  const res = await fetch(baseUrl + "/lp/reunion-famille");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<title>/i);
});

test("Lead avec ile/persona : bien enregistre et visible dans l'analytics par ile", async () => {
  const body = { ...validLead(), ile: "Martinique", persona: "senior", source: "lp:martinique-senior" };
  const r = await req("POST", "/api/leads", { body });
  assert.equal(r.status, 201);
  const a = await req("GET", "/api/admin/analytics?days=90", admin);
  const mq = a.json.parIle.find((x) => x.cle === "Martinique");
  assert.ok(mq, "l'ile Martinique doit apparaitre");
  assert.ok(mq.leads >= 1);
});

test("Tracking WhatsApp : enregistre un clic", async () => {
  const r = await req("POST", "/api/track/whatsapp", {
    body: { ile: "Guadeloupe", persona: "senior", variant: "guadeloupe-senior" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
});

test("Budget pub : ajout + calcul du CPL par ile", async () => {
  const jour = new Date().toISOString().slice(0, 10);
  const add = await req("POST", "/api/admin/spend", {
    ...admin,
    body: { jour, ile: "Martinique", source: "meta", montant_eur: 100 },
  });
  assert.equal(add.status, 201);

  const a = await req("GET", "/api/admin/analytics?days=90", admin);
  const mq = a.json.parIle.find((x) => x.cle === "Martinique");
  assert.ok(mq.depense_eur >= 100);
  assert.ok(mq.cpl_eur > 0, "le CPL doit etre calcule");
  assert.ok(a.json.global.depense_eur >= 100);
});

test("Budget pub : refuse un montant/jour invalide et exige le token", async () => {
  const noauth = await req("POST", "/api/admin/spend", { body: { jour: "2026-01-01", montant_eur: 10 } });
  assert.equal(noauth.status, 401);
  const bad = await req("POST", "/api/admin/spend", { ...admin, body: { jour: "abc", montant_eur: 10 } });
  assert.equal(bad.status, 400);
});

// Verifie que le module leads calcule un score coherent
test("createLeadWithConsent : score maximal pour un profil complet", async () => {
  const { computeScore } = await import("../src/leads.js");
  const score = computeScore({
    telephone: "1",
    email: "a@b.fr",
    code_postal: "75011",
    tranche_age: "55-64",
    situation: "retraite",
    mutuelle_actuelle: "oui",
    budget_mensuel: "60-100",
  });
  assert.equal(score, 100);
});
