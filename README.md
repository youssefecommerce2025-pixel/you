# Backend — Leads mutuelle santé (API)

API Node.js (Express + SQLite) pour la génération légale de leads mutuelle santé, conforme à la
**loi du 30 juin 2025** (opt-in au 11 août 2026). Le **frontend** (landing page + CRM) est dans un
dépôt séparé : `frontend`.

## Démarrage

```bash
npm install
npm start          # http://localhost:3000
npm test           # suite de tests
```

## Rôle

Ce service expose l'API et la logique métier :

- réception des leads + **capture de la preuve de consentement** (horodatage, IP, URL, version) ;
- **CRM** : consultation, qualification, scoring, statuts, export CSV, export de preuve ;
- **double opt-in** (email/SMS), désinscription (droit d'opposition) ;
- **webhook** de transmission vers le CRM d'un courtier partenaire (HMAC, retries) ;
- **intake affilié** (`/api/partner/leads`) + **analytics** (conversion par source/UTM).

## CORS (frontend séparé)

Le frontend étant hébergé sur un autre domaine, autorise-le via la variable d'environnement :

```
ALLOWED_ORIGINS=https://ton-frontend.fr,https://autre-domaine.fr
```

(ou `*` pour tout autoriser — déconseillé en production).

## Variables d'environnement

| Variable | Rôle | Défaut |
|---|---|---|
| `PORT` | Port HTTP | `3000` |
| `ADMIN_TOKEN` | Token d'accès au CRM | `admin-demo-token` |
| `ALLOWED_ORIGINS` | Domaines frontend autorisés (CORS) | aucun |
| `DOUBLE_OPTIN` | `1` pour activer le double opt-in | désactivé |
| `PUBLIC_BASE_URL` | URL publique (liens de confirmation) | déduite |
| `DB_PATH` / `DATA_DIR` | Emplacement de la base SQLite | `data/` |
| `SMTP_*` / `MAIL_FROM` | Envoi email | repli fichier |
| `SMS_API_URL` / `SMS_API_KEY` / `SMS_SENDER` | Envoi SMS | repli fichier |
| `PARTNER_WEBHOOK_URL` / `PARTNER_WEBHOOK_SECRET` | Webhook courtier | désactivé |
| `PARTNER_API_KEYS` | Clés API d'intake affilié (`cle:Nom,...`) | aucune |

## Déploiement

- **Docker** : `docker compose up --build`
- **Render** : blueprint `render.yaml` (région UE, disque persistant).

Voir `docs/modele-consentement-rgpd.md` pour le volet juridique.

> Ceci n'est pas un conseil juridique : fais valider ton montage par un avocat spécialisé + DPO.
