// Tests d'integration de l'API (runner integre node:test).
// Chaque execution utilise une base SQLite temporaire isolee.
// Domaine : leads fibre / telecom Proximus (marche belge).

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import http from "node:http";

// Configure l'environnement AVANT d'importer l'app (db.js lit ces variables a l'import).
const TMP = mkdtempSync(join(tmpdir(), "leads-test-"));
process.env.DATA_DIR = TMP;
process.env.DB_PATH = join(TMP, "test.sqlite");
process.env.ADMIN_TOKEN = "test-token";
process.env.NODE_ENV = "test";
process.env.PARTNER_API_KEYS = "aff-key-1:AffilieTest";
process.env.WHATSAPP_NUMBER = "32470000000";

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
  nom: "Dubois",
  email: `sophie${Math.random().toString(36).slice(2)}@ex.be`,
  telephone: "0470123456",
  code_postal: "1000",
  operateur_actuel: "voo_orange",
  objectif: "fibre",
  type_client: "residentiel",
  consent_telephone: true,
});

test("GET /health renvoie ok", async () => {
  const r = await req("GET", "/health");
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
});

test("GET /api/config expose la version et le libelle de consentement (telecom BE)", async () => {
  const r = await req("GET", "/api/config");
  assert.equal(r.status, 200);
  assert.ok(r.json.consentVersion);
  assert.match(r.json.consentCheckboxLabel, /t[ée]l[ée]phone/i);
  assert.match(r.json.consentCheckboxLabel, /Proximus/);
  assert.equal(r.json.whatsapp, "32470000000");
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
  assert.match(r.json.error, /t[ée]l[ée]phone/i);
});

test("POST /api/leads refuse un telephone francais (metropole)", async () => {
  const body = { ...validLead(), telephone: "0612345678" };
  const r = await req("POST", "/api/leads", { body });
  assert.equal(r.status, 400);
  assert.match(r.json.error, /t[ée]l[ée]phone/i);
});

test("POST /api/leads refuse un code postal hors Belgique", async () => {
  const body = { ...validLead(), code_postal: "75001" };
  const r = await req("POST", "/api/leads", { body });
  assert.equal(r.status, 400);
  assert.match(r.json.error, /code postal/i);
});

test("POST /api/leads accepte telephone et CP belges (formats varies)", async () => {
  const cases = [
    { telephone: "0470 12 34 56", code_postal: "1000" }, // mobile · Bruxelles
    { telephone: "+32470123456", code_postal: "4000" }, // intl · Wallonie (Liège)
    { telephone: "02 123 45 67", code_postal: "5000" }, // fixe Bruxelles · Namur
    { telephone: "043210987", code_postal: "7000" }, // fixe Liège · Mons
    { telephone: "0032489000000", code_postal: "9000" }, // 0032 · Flandre (Gand)
  ];
  for (const c of cases) {
    const body = { ...validLead(), ...c, email: `ok${Math.random().toString(36).slice(2)}@ex.be` };
    const r = await req("POST", "/api/leads", { body });
    assert.equal(r.status, 201, `attendu 201 pour ${JSON.stringify(c)}, obtenu ${r.status} ${JSON.stringify(r.json)}`);
  }
});

test("POST /api/leads derive la region a partir du code postal", async () => {
  const r = await req("POST", "/api/leads", { body: { ...validLead(), code_postal: "5000" } });
  assert.equal(r.status, 201);
  const { leads } = await (await fetch(baseUrl + "/api/admin/leads?q=Dubois", admin)).json();
  const lead = leads.find((l) => l.id === r.json.leadId);
  assert.equal(lead.region, "Wallonie");
});

test("POST /api/leads cree un lead avec opt-in et enregistre la preuve", async () => {
  const body = { ...validLead(), utm_source: "meta", utm_campaign: "fibre-wallonie" };
  const r = await req("POST", "/api/leads", {
    body,
    headers: { Referer: "https://proxifibre.be/lp/wallonie-fibre" },
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
    body: { statut: "qualifie", notes: "OK", eligibilite_fibre: "disponible" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.lead.statut, "qualifie");
  assert.ok(r.json.lead.score > 0);
  // Le 1er contact est horodate quand le lead quitte "nouveau" (speed-to-lead).
  assert.ok(r.json.lead.premier_contact_at);
});

test("PATCH refuse un statut invalide", async () => {
  const created = await req("POST", "/api/leads", { body: validLead() });
  const r = await req("PATCH", `/api/admin/leads/${created.json.leadId}`, {
    ...admin,
    body: { statut: "n_importe_quoi" },
  });
  assert.equal(r.status, 400);
});

test("Export CSV protege + contient l'entete attendue (telecom)", async () => {
  const noauth = await req("GET", "/api/admin/leads/export.csv");
  assert.equal(noauth.status, 401);

  const res = await fetch(baseUrl + "/api/admin/leads/export.csv", admin);
  assert.equal(res.status, 200);
  const csv = await res.text();
  assert.match(csv, /region/);
  assert.match(csv, /operateur_actuel/);
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
        source_url: "https://affilie.be/fibre",
        user_agent: "test",
      },
    },
  });
  assert.equal(r.status, 201);
  assert.equal(r.json.source, "affilie:AffilieTest");
});

test("Analytics : renvoie l'entonnoir et les agregats par region/source", async () => {
  const r = await req("GET", "/api/admin/analytics?days=90", admin);
  assert.equal(r.status, 200);
  assert.ok(r.json.funnel);
  assert.ok(Array.isArray(r.json.parRegion));
  assert.ok(Array.isArray(r.json.parSource));
  assert.ok(Array.isArray(r.json.parOperateur));
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

test("Variantes : /api/variant/:slug renvoie la personnalisation regionale", async () => {
  const r = await req("GET", "/api/variant/wallonie-fibre");
  assert.equal(r.status, 200);
  assert.equal(r.json.region, "Wallonie");
  assert.equal(r.json.persona, "fibre-neuve");
  assert.equal(r.json.whatsapp, "32470000000");
  const bad = await req("GET", "/api/variant/inconnu");
  assert.equal(bad.status, 404);
});

test("Variantes : /lp/:slug sert la landing page (HTML)", async () => {
  const res = await fetch(baseUrl + "/lp/bruxelles-fibre");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<title>/i);
});

test("Lead avec region/persona : visible dans l'analytics par region", async () => {
  const body = { ...validLead(), region: "Wallonie", persona: "switch-voo", source: "lp:switch-voo" };
  const r = await req("POST", "/api/leads", { body });
  assert.equal(r.status, 201);
  const a = await req("GET", "/api/admin/analytics?days=90", admin);
  const wal = a.json.parRegion.find((x) => x.cle === "Wallonie");
  assert.ok(wal, "la region Wallonie doit apparaitre");
  assert.ok(wal.leads >= 1);
});

test("Tracking WhatsApp : enregistre un clic", async () => {
  const r = await req("POST", "/api/track/whatsapp", {
    body: { region: "Bruxelles", persona: "fibre-neuve", variant: "bruxelles-fibre" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.json.ok, true);
});

test("Budget pub : ajout + calcul du CPL par region", async () => {
  const jour = new Date().toISOString().slice(0, 10);
  const add = await req("POST", "/api/admin/spend", {
    ...admin,
    body: { jour, region: "Wallonie", source: "meta", montant_eur: 100 },
  });
  assert.equal(add.status, 201);

  const a = await req("GET", "/api/admin/analytics?days=90", admin);
  const wal = a.json.parRegion.find((x) => x.cle === "Wallonie");
  assert.ok(wal.depense_eur >= 100);
  assert.ok(wal.cpl_eur > 0, "le CPL doit etre calcule");
  assert.ok(a.json.global.depense_eur >= 100);
});

test("Budget pub : refuse un montant/jour invalide et exige le token", async () => {
  const noauth = await req("POST", "/api/admin/spend", { body: { jour: "2026-01-01", montant_eur: 10 } });
  assert.equal(noauth.status, 401);
  const bad = await req("POST", "/api/admin/spend", { ...admin, body: { jour: "abc", montant_eur: 10 } });
  assert.equal(bad.status, 400);
});

// Verifie que le module leads calcule un score coherent (signaux fibre)
test("computeScore : score maximal pour un profil switcher complet", async () => {
  const { computeScore } = await import("../src/leads.js");
  const score = computeScore({
    telephone: "1",
    code_postal: "1000",
    region: "Bruxelles",
    operateur_actuel: "voo_orange",
    objectif: "fibre",
    type_client: "soho",
    eligibilite_fibre: "disponible",
  });
  assert.equal(score, 100);
});

// Validation belge unitaire
test("isBelgianPhone / isBelgianPostalCode : accepte BE, rejette FR", async () => {
  const { isBelgianPhone, isBelgianPostalCode, regionFromPostalCode } = await import("../src/leads.js");
  assert.equal(isBelgianPhone("0470123456"), true);
  assert.equal(isBelgianPhone("+32 2 123 45 67"), true);
  assert.equal(isBelgianPhone("0612345678"), false); // mobile FR
  assert.equal(isBelgianPostalCode("1000"), true);
  assert.equal(isBelgianPostalCode("75001"), false);
  assert.equal(regionFromPostalCode("1050"), "Bruxelles");
  assert.equal(regionFromPostalCode("4000"), "Wallonie");
  assert.equal(regionFromPostalCode("9000"), "Flandre");
});
