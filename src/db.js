import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";
import { createSqljsDb } from "./sqljs-adapter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || join(__dirname, "..", "data");
mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = process.env.DB_PATH || join(DATA_DIR, "leads.sqlite");

// Choix du moteur de base de donnees :
//  - 'better-sqlite3' (natif, rapide) si disponible ET non desactive ;
//  - sinon repli automatique sur sql.js (100 % JavaScript, aucune compilation).
// Force le moteur avec DB_ENGINE = 'better-sqlite3' | 'sqljs'.
let db;
let engineName = "sql.js";
const forced = process.env.DB_ENGINE;

async function tryBetterSqlite() {
  const { default: Database } = await import("better-sqlite3");
  const d = new Database(DB_PATH);
  d.pragma("journal_mode = WAL");
  d.pragma("foreign_keys = ON");
  return d;
}

if (forced !== "sqljs") {
  try {
    db = await tryBetterSqlite();
    engineName = "better-sqlite3";
  } catch (e) {
    if (forced === "better-sqlite3") throw e;
    db = await createSqljsDb(DB_PATH);
    engineName = "sql.js";
  }
} else {
  db = await createSqljsDb(DB_PATH);
}

/**
 * Schema
 * -----
 * leads              : la fiche prospect + son statut de qualification (CRM)
 * consent_proofs     : la PREUVE de consentement horodatee (RGPD / loi 30 juin 2025)
 *                      liee 1-1 a un lead, conservee meme si le lead est supprime/anonymise
 *
 * IMPORTANT : aucune donnee de sante (pathologie, traitement...) n'est stockee.
 * On ne conserve que des donnees non sensibles : age, situation, mutuelle actuelle, budget.
 */
function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at        TEXT    NOT NULL,
      updated_at        TEXT    NOT NULL,

      -- Identite / contact (donnees non sensibles)
      civilite          TEXT,
      prenom            TEXT    NOT NULL,
      nom               TEXT    NOT NULL,
      email             TEXT    NOT NULL,
      telephone         TEXT    NOT NULL,
      code_postal       TEXT,

      -- Qualification metier (PAS de donnees de sante)
      date_naissance    TEXT,   -- 'YYYY-MM-DD'
      tranche_age       TEXT,   -- derive de la date de naissance : '55-64', '65-74', '75+'
      situation         TEXT,   -- ex: 'actif', 'retraite', 'independant'
      mutuelle_actuelle TEXT,   -- ex: 'oui', 'non'
      budget_mensuel    TEXT,   -- ex: '30-60', '60-100', '100+'

      -- Attribution / acquisition
      source            TEXT,   -- 'formulaire' | 'affilie:<nom>' | 'lp:<slug>' | 'whatsapp'
      ile               TEXT,   -- 'Martinique' | 'Guadeloupe' | 'La Reunion' | ...
      persona           TEXT,   -- 'senior' | 'famille' | 'fonctionnaire' | 'autres'
      utm_source        TEXT,
      utm_medium        TEXT,
      utm_campaign      TEXT,
      utm_term          TEXT,
      utm_content       TEXT,

      -- CRM
      statut            TEXT    NOT NULL DEFAULT 'nouveau',
                                -- nouveau | a_rappeler | qualifie | non_joignable | non_interesse | transmis | rejete
      score             INTEGER,          -- score de qualification 0-100 (calcule)
      notes             TEXT,
      assigne_a         TEXT,             -- teleconseiller
      courtier_orias    TEXT,             -- courtier ORIAS destinataire une fois transmis
      transmis_at       TEXT,

      -- Etat du consentement
      double_optin_confirme INTEGER NOT NULL DEFAULT 0,
      desinscrit_at     TEXT              -- droit d'opposition exerce
    );

    CREATE TABLE IF NOT EXISTS consent_proofs (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id             INTEGER NOT NULL,
      collected_at        TEXT    NOT NULL,     -- horodatage du consentement (ISO 8601, UTC)
      ip_address          TEXT    NOT NULL,     -- IP du prospect au moment de la coche
      user_agent          TEXT,
      source_url          TEXT    NOT NULL,     -- URL exacte de la page de capture
      referer             TEXT,
      consent_version     TEXT    NOT NULL,     -- version du texte de consentement affiche
      consent_text        TEXT    NOT NULL,     -- texte EXACT presente au prospect (fige)
      consent_checkbox    INTEGER NOT NULL,     -- 1 = case cochee volontairement
      method              TEXT    NOT NULL,     -- 'single_optin' | 'double_optin'
      -- double opt-in
      confirm_token       TEXT,
      confirmed_at        TEXT,
      confirm_ip          TEXT,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS outbound_messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id     INTEGER,
      channel     TEXT    NOT NULL,   -- 'email' | 'sms'
      recipient   TEXT    NOT NULL,
      subject     TEXT,
      body        TEXT,
      status      TEXT    NOT NULL,   -- 'sent' | 'fallback' | 'error'
      error       TEXT,
      created_at  TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS webhook_deliveries (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id      INTEGER NOT NULL,
      url          TEXT    NOT NULL,
      status       TEXT    NOT NULL,   -- 'success' | 'error' | 'skipped'
      http_status  INTEGER,
      attempts     INTEGER NOT NULL DEFAULT 1,
      response     TEXT,
      error        TEXT,
      created_at   TEXT    NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_leads_statut ON leads(statut);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_consent_lead ON consent_proofs(lead_id);
    CREATE INDEX IF NOT EXISTS idx_consent_token ON consent_proofs(confirm_token);
    CREATE TABLE IF NOT EXISTS ad_spend (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      jour        TEXT    NOT NULL,   -- 'YYYY-MM-DD'
      ile         TEXT,
      source      TEXT,               -- 'meta' | 'tiktok' | 'google' | 'radio' ...
      montant_eur REAL    NOT NULL,
      note        TEXT,
      created_at  TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wa_clicks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      ile         TEXT,
      persona     TEXT,
      source      TEXT,
      utm_source  TEXT,
      utm_campaign TEXT,
      variant     TEXT,
      ip          TEXT,
      user_agent  TEXT,
      created_at  TEXT    NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_outbound_lead ON outbound_messages(lead_id);
    CREATE INDEX IF NOT EXISTS idx_webhook_lead ON webhook_deliveries(lead_id);
    CREATE INDEX IF NOT EXISTS idx_spend_jour ON ad_spend(jour, ile);
    CREATE INDEX IF NOT EXISTS idx_waclicks_created ON wa_clicks(created_at, ile);
  `);

  // Migration legere : ajoute les colonnes d'attribution si absentes (bases existantes).
  const cols = db.prepare("PRAGMA table_info(leads)").all().map((c) => c.name);
  const toAdd = {
    source: "TEXT",
    ile: "TEXT",
    persona: "TEXT",
    date_naissance: "TEXT",
    utm_source: "TEXT",
    utm_medium: "TEXT",
    utm_campaign: "TEXT",
    utm_term: "TEXT",
    utm_content: "TEXT",
  };
  for (const [name, type] of Object.entries(toAdd)) {
    if (!cols.includes(name)) db.exec(`ALTER TABLE leads ADD COLUMN ${name} ${type}`);
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_leads_utm ON leads(utm_source, utm_campaign)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_leads_ile ON leads(ile)");
}

init();

if (process.argv.includes("--init")) {
  console.log(`Base de donnees initialisee : ${DB_PATH}`);
  process.exit(0);
}

export default db;
export { DB_PATH, engineName };
