# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single self-contained Node.js/Express + SQLite app (French "mutuelle santé"
opt-in lead-generation platform). The Express process serves both the JSON API and the static
frontend in `public/`, so there is only one service to run.

Note: the `main` branch is an empty stub. The actual product lives on feature branches
(e.g. `cursor/leads-mutuelle-sante-optin`). Work from a branch that contains `package.json`/`src/`.

### Runtime / tooling
- Node.js 22 and npm. `better-sqlite3` is a native module but installs from a prebuilt binary
  here (no compile needed); `python3`, `make`, `g++` are present as a fallback.
- Dependencies are installed by the startup update script (`npm ci`). No separate DB service is
  needed — SQLite is embedded and the DB file is auto-created under `DATA_DIR` (default `data/`)
  on first run. `data/` and `*.sqlite` are gitignored.

### Run / test / build (see `package.json` scripts and `README.md`)
- Run (dev, auto-reload): `npm run dev` — serves http://localhost:3000 (landing) and
  `/admin.html` (CRM). Health check: `GET /health`.
- Run (plain): `npm start`.
- Test: `npm test` (`node --test`). The suite is self-contained: it sets its own temp
  `DATA_DIR`/`DB_PATH` and `ADMIN_TOKEN`, so it needs no running server or external services.
- Lint: none configured (no ESLint config or lint script exists).
- Build: no build step for the app (plain JS + static assets); "build" only means the Docker image.

### Non-obvious notes
- The CRM at `/admin.html` is gated by a bearer token. Set `ADMIN_TOKEN` when running
  (e.g. `ADMIN_TOKEN=demo-admin-token npm run dev`); it defaults to `admin-demo-token`.
  Admin API calls need `Authorization: Bearer <token>` (or `?token=`).
- `POST /api/leads` requires `consent_telephone: true` (opt-in), otherwise returns 400.
- All external integrations (SMTP email, SMS, partner webhooks, affiliate intake) are OPTIONAL
  and degrade gracefully: with no `SMTP_HOST`/`SMS_API_URL`/`PARTNER_WEBHOOK_URL` set, messages
  are written to `data/outbox.log` and the `outbound_messages` table. None are required to run
  or test end-to-end.
