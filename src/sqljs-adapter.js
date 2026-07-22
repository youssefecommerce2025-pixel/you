// Adaptateur sql.js exposant une API compatible better-sqlite3.
//
// Objectif : permettre a l'application de fonctionner SANS module natif a compiler
// (ideal pour l'hebergement mutualise type Hostinger). sql.js est du SQLite compile
// en WebAssembly : 100 % JavaScript, aucune compilation a l'installation.
//
// L'API imitee : db.prepare(sql).{run,get,all}, db.exec(sql), db.pragma(str),
// db.transaction(fn). La base tient en memoire et est persistee sur disque.

import initSqlJs from "sql.js";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";

const require = createRequire(import.meta.url);

function remapNamed(params) {
  // better-sqlite3 : cles sans prefixe. sql.js attend '@nom'.
  const out = {};
  for (const k of Object.keys(params)) out["@" + k] = params[k];
  return out;
}

function normalizeArgs(args) {
  if (args.length === 1 && args[0] && typeof args[0] === "object" && !Array.isArray(args[0])) {
    return remapNamed(args[0]); // parametres nommes
  }
  if (args.length === 1 && Array.isArray(args[0])) return args[0]; // tableau positionnel
  return args; // positionnels multiples
}

export async function createSqljsDb(dbPath) {
  const wasmPath = require.resolve("sql.js/dist/sql-wasm.wasm");
  const SQL = await initSqlJs({ locateFile: () => wasmPath });

  const database =
    dbPath && existsSync(dbPath)
      ? new SQL.Database(readFileSync(dbPath))
      : new SQL.Database();

  // Persistance sur disque : ecriture atomique (fichier temporaire puis renommage),
  // immediate apres chaque ecriture pour ne jamais perdre un lead.
  let inTransaction = false;
  function persistNow() {
    if (!dbPath) return;
    try {
      const data = Buffer.from(database.export());
      const tmp = dbPath + ".tmp";
      writeFileSync(tmp, data);
      renameSync(tmp, dbPath);
    } catch (e) {
      console.error("Erreur de sauvegarde de la base:", e);
    }
  }
  function saveUnlessInTx() {
    if (!inTransaction) persistNow();
  }
  // Filets de securite a l'arret du process (y compris process.exit()).
  process.on("exit", persistNow);
  process.on("SIGINT", () => process.exit(0));
  process.on("SIGTERM", () => process.exit(0));

  function lastInsertRowid() {
    const r = database.exec("SELECT last_insert_rowid() AS id");
    return r.length ? r[0].values[0][0] : 0;
  }

  function makeStatement(sql) {
    return {
      run(...args) {
        const stmt = database.prepare(sql);
        try {
          stmt.run(normalizeArgs(args));
        } finally {
          stmt.free();
        }
        const changes = database.getRowsModified();
        const info = { changes, lastInsertRowid: lastInsertRowid() };
        saveUnlessInTx();
        return info;
      },
      get(...args) {
        const stmt = database.prepare(sql);
        let row;
        try {
          stmt.bind(normalizeArgs(args));
          row = stmt.step() ? stmt.getAsObject() : undefined;
        } finally {
          stmt.free();
        }
        return row;
      },
      all(...args) {
        const stmt = database.prepare(sql);
        const rows = [];
        try {
          stmt.bind(normalizeArgs(args));
          while (stmt.step()) rows.push(stmt.getAsObject());
        } finally {
          stmt.free();
        }
        return rows;
      },
    };
  }

  const db = {
    prepare: (sql) => makeStatement(sql),
    exec(sql) {
      database.run(sql);
      saveUnlessInTx();
      return db;
    },
    pragma(str) {
      // Les PRAGMA type WAL n'ont pas de sens en memoire : on les execute sans erreur.
      try {
        database.run("PRAGMA " + str);
      } catch {}
      return [];
    },
    transaction(fn) {
      return (...args) => {
        database.run("BEGIN");
        inTransaction = true;
        try {
          const result = fn(...args);
          database.run("COMMIT");
          inTransaction = false;
          persistNow();
          return result;
        } catch (e) {
          try {
            database.run("ROLLBACK");
          } catch {}
          inTransaction = false;
          throw e;
        }
      };
    },
    close() {
      persistNow();
      database.close();
    },
    __engine: "sql.js",
  };

  db.pragma("foreign_keys = ON");
  return db;
}
