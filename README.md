# Plateforme de génération de leads — Mutuelle santé (conforme opt-in 2026)

Application autonome pour **générer des leads mutuelle santé de façon légale** sur le marché français,
dans le cadre de la **loi n° 2025-594 du 30 juin 2025** qui impose le **consentement préalable (opt-in)**
pour tout démarchage téléphonique à compter du **11 août 2026**.

> ⚠️ **Avertissement** : ce projet est un outil opérationnel, pas un conseil juridique. Fais valider ton
> montage par un avocat spécialisé (consommation/assurance) et un DPO avant exploitation.

## Ce que contient le projet (les 3 points)

1. **Landing page + formulaire opt-in conforme** (`public/index.html`, `public/app.js`)
   - Formulaire de demande de devis avec case opt-in **décochée par défaut** (acte positif clair).
   - **Capture de la preuve** : horodatage, adresse IP, URL exacte de la page, user-agent, version et
     texte exact du consentement présenté.
   - Aucune donnée de santé collectée.

2. **Stockage des preuves de consentement + CRM de qualification** (`src/db.js`, `src/server.js`, `public/admin.html`)
   - Base SQLite : table `leads` (fiche + qualification) et `consent_proofs` (preuve horodatée).
   - CRM protégé par token : liste, recherche, filtres, scoring, statuts, assignation, transmission à
     un courtier ORIAS, et **export de la preuve de consentement** (contrôle CNIL/ACPR).
   - Double opt-in optionnel, droit d'opposition / désinscription.

3. **Modèle de mentions de consentement RGPD / mutuelle santé** (`src/consent.js`, `docs/modele-consentement-rgpd.md`)
   - Source de vérité unique, **versionnée**, du texte de consentement et des mentions RGPD.

## Démarrage

```bash
npm install
npm start
```

- Landing page : http://localhost:3000/
- CRM conseiller : http://localhost:3000/admin.html

## Configuration (variables d'environnement)

| Variable | Rôle | Défaut |
|---|---|---|
| `PORT` | Port HTTP | `3000` |
| `ADMIN_TOKEN` | Token d'accès au CRM | `admin-demo-token` |
| `DOUBLE_OPTIN` | `1` pour activer le double opt-in | désactivé |
| `PUBLIC_BASE_URL` | URL publique pour les liens de confirmation | déduite de la requête |
| `DB_PATH` | Chemin du fichier SQLite | `data/leads.sqlite` |
| `DATA_DIR` | Dossier de données | `data/` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | Envoi email (double opt-in) | repli fichier/console |
| `MAIL_FROM` | Expéditeur des emails | `no-reply@example.fr` |
| `SMS_API_URL` / `SMS_API_KEY` / `SMS_SENDER` | Envoi SMS via un fournisseur HTTP (Twilio, OVH...) | repli fichier/console |
| `PARTNER_WEBHOOK_URL` | Webhook du CRM courtier (transmission des leads) | désactivé |
| `PARTNER_WEBHOOK_URL__<SLUG>` | Webhook spécifique par courtier (slug du nom ORIAS) | — |
| `PARTNER_WEBHOOK_SECRET` | Secret HMAC-SHA256 (en-tête `X-Signature`) | non signé |
| `WEBHOOK_MAX_ATTEMPTS` | Nombre d'essais avec backoff | `3` |
| `PARTNER_API_KEYS` | Clés API d'intake affilié, format `cle:Nom,cle2:Nom2` | aucune |

> Sans SMTP/SMS configuré, les messages de confirmation sont écrits dans `data/outbox.log` et
> tracés dans la table `outbound_messages` (utile en développement).

**Avant la production** : change `ADMIN_TOKEN`, renseigne tes vraies mentions dans `src/consent.js`
(raison sociale, ORIAS, DPO...), mets l'app derrière HTTPS, et branche l'envoi email/SMS pour le
double opt-in.

## Principales routes API

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/config` | Texte de consentement officiel + mentions RGPD |
| `POST` | `/api/leads` | Création d'un lead + capture de la preuve de consentement |
| `GET` | `/api/leads/confirm?token=` | Confirmation double opt-in |
| `POST` | `/api/leads/desinscription` | Droit d'opposition (par email) |
| `GET` | `/api/admin/leads` | Liste des leads (auth) |
| `GET` | `/api/admin/stats` | Statistiques (auth) |
| `PATCH` | `/api/admin/leads/:id` | Qualification / mise à jour (auth) |
| `GET` | `/api/admin/leads/export.csv` | Export CSV des leads (auth, filtrable) |
| `GET` | `/api/admin/leads/:id/consent` | Export de la preuve de consentement (auth) |
| `POST` | `/api/admin/leads/:id/transmettre` | Transmet (ou re-transmet) le lead au webhook courtier (auth) |
| `GET` | `/api/admin/leads/:id/deliveries` | Historique des livraisons webhook (auth) |
| `GET` | `/api/admin/analytics` | Analytics : entonnoir + conversion par source/UTM (auth) |
| `POST` | `/api/partner/leads` | Intake de leads d'affiliés externes (clé API `X-Api-Key`) |

Pages : `/` (landing), `/admin.html` (CRM), `/confidentialite.html` (confidentialité),
`/mentions-legales.html` (mentions légales). Bandeau cookies (Google Consent Mode v2) sur les
pages publiques.

## Transmission vers le CRM d'un courtier partenaire (webhook)

Quand un lead passe au statut `transmis` (ou via le bouton « Transmettre » du CRM), l'application
envoie un `POST` JSON vers `PARTNER_WEBHOOK_URL` avec :

- les données du lead (aucune donnée de santé) + un résumé de la preuve de consentement ;
- l'en-tête `X-Signature: sha256=<hmac>` si `PARTNER_WEBHOOK_SECRET` est défini ;
- retries avec backoff, et traçabilité complète dans la table `webhook_deliveries`.

Routage multi-courtiers possible via `PARTNER_WEBHOOK_URL__<SLUG>` (slug = nom ORIAS en majuscules).

## Intake de leads d'affiliés externes

Endpoint `POST /api/partner/leads` authentifié par clé API (en-tête `X-Api-Key`, définie via
`PARTNER_API_KEYS`). L'affilié **doit** fournir la preuve de consentement recueillie de son côté :

```json
{
  "prenom": "...", "nom": "...", "email": "...", "telephone": "0612345678",
  "consent_telephone": true,
  "consent": {
    "ip": "203.0.113.5",
    "collected_at": "2026-08-12T10:00:00Z",
    "source_url": "https://affilie.fr/devis",
    "user_agent": "...", "double_optin": false
  }
}
```

Le lead est enregistré avec `source = affilie:<Nom>` pour le suivi analytics.

## Tests

```bash
npm test   # suite d'integration (node:test), base SQLite temporaire isolee
```

## Rappel de conformité

- Case opt-in décochée par défaut, non conditionnante.
- Consentement spécifique à la mutuelle santé par téléphone.
- Aucune donnée de santé dans les formulaires.
- Preuve horodatée conservée (5 ans recommandé), exportable.
- Distributeur final immatriculé **ORIAS**, supervision **ACPR**, devoir de conseil.
- Encadrement du transfert de données si traitement hors UE (ex. centre d'appel au Maroc).

Voir `docs/modele-consentement-rgpd.md` pour le détail juridique et la checklist.
