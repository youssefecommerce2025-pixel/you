# ProxiFibre — Plateforme de génération de leads fibre Proximus (marché belge)

Application autonome pour **générer des leads fibre / télécom depuis les réseaux sociaux** et les
convertir par téléphone, pensée pour un **télévendeur freelance** qui commercialise les offres
**Proximus** via une société belge agréée.

Le principe : une publicité *« Vérifiez si la fibre est disponible chez vous »* → un formulaire de
demande de rappel → **vous rappelez le prospect sous 15 minutes** (speed-to-lead). Le tout avec une
**preuve de consentement horodatée** (opt-in by design), pour être conforme au RGPD, respecter la
liste belge « Ne m'appelez plus ! » (DNCM) et anticiper le futur passage à l'opt-in (proposition de
loi belge n° 1081, inspirée de la loi française du 30 juin 2025).

> ⚠️ **Avertissement** : ce projet est un outil opérationnel, pas un conseil juridique. Fais valider
> ton montage (mandat Proximus, licence DNCM, RGPD) par ta société partenaire et un juriste avant
> exploitation. Renseigne tes vraies mentions via les variables `ORG_*` (voir `.env.example`).

## Ce que contient le projet

1. **Landing page + formulaire opt-in** (`public/index.html`, `public/app.js`)
   - Vérification d'éligibilité fibre + rappel sous 15 min, 3 angles de conversion.
   - Formulaire multi-étapes : code postal (BE) & opérateur actuel → objectif & type de client →
     contact + case opt-in **décochée par défaut**.
   - Validation belge (téléphone `04…`/`0…`, code postal 4 chiffres), dérivation automatique de la
     **région** (Bruxelles / Wallonie / Flandre).
   - Capture de la **preuve de consentement** : horodatage, IP, URL exacte, user-agent, version et
     texte exact du consentement présenté.

2. **CRM de qualification + analytics** (`src/db.js`, `src/server.js`, `public/admin.html`)
   - Base SQLite : `leads` (fiche + qualification télécom) et `consent_proofs` (preuve horodatée).
   - CRM protégé par token : liste, recherche, filtres, **statuts**, score, **speed-to-lead**
     (horodatage du 1er contact), assignation, transmission à la société partenaire (webhook).
   - Analytics : entonnoir, **CPL par région**, agrégats par opérateur / objectif / source / UTM,
     et un **simulateur de revenus** (commission par vente).
   - Export CSV et **certificat de consentement** imprimable (contrôle APD/GBA).

3. **Playbook d'acquisition** (`public/playbook.html`, `docs/playbook-fibre-belgique.md`)
   - Les 3 **annonces prêtes à copier** (A/B/C), la config du **formulaire instantané**, le
     **script d'appel** (ouverture, éligibilité, qualification, closing, objections) et le **setup
     Ads Manager** pas à pas.

4. **Modèle de consentement versionné** (`src/consent.js`, `docs/modele-consentement-belgique.md`)
   - Source de vérité unique, **versionnée**, du texte de consentement et des mentions RGPD (contexte belge).

## Démarrage

```bash
npm install
npm start
```

- Landing page : http://localhost:3000/
- Playbook : http://localhost:3000/playbook.html
- CRM conseiller : http://localhost:3000/admin.html

## Lancer avec Docker

```bash
docker compose up --build
```

Ouvre http://localhost:3000 (CRM : http://localhost:3000/admin.html). Le token du CRM est défini
dans `docker-compose.yml` (`ADMIN_TOKEN`). La base SQLite est persistée dans le volume `leads_data`.

## Déployer en ligne (URL publique)

Le fichier `render.yaml` permet un déploiement en un clic sur [Render](https://render.com) (région
Frankfurt = UE/RGPD). Guides détaillés (VPS + Nginx + HTTPS, Hostinger) dans `deploy/`.

La même image Docker fonctionne sur Railway, Fly.io, Scaleway, un VPS, etc.

## Configuration (variables d'environnement)

| Variable | Rôle | Défaut |
|---|---|---|
| `PORT` | Port HTTP | `3000` |
| `ADMIN_TOKEN` | Token d'accès au CRM | `admin-demo-token` |
| `ORG_BRAND` / `ORG_LEGAL_NAME` / `ORG_BCE` / `ORG_ADDRESS` / `ORG_EMAIL` / `ORG_DPO_EMAIL` / `ORG_PHONE` | Identité affichée (landing, mentions, certificat) | valeurs de démo |
| `ORG_OPERATOR` | Produit / réseau commercialisé | `Proximus` |
| `ORG_DNCM_LICENSE` | Référence de licence DNCM de la société | — |
| `WHATSAPP_NUMBER` | Numéro WhatsApp (format `32470000000`) | — |
| `DOUBLE_OPTIN` | `1` pour activer le double opt-in | désactivé |
| `PUBLIC_BASE_URL` | URL publique (liens de confirmation) | déduite de la requête |
| `DB_PATH` / `DATA_DIR` | Emplacement de la base SQLite | `data/` |
| `DB_ENGINE` | `better-sqlite3` (natif) ou `sqljs` (100 % JS) | auto |
| `SMTP_*` / `MAIL_FROM` | Envoi email (double opt-in) | repli fichier/console |
| `SMS_API_URL` / `SMS_API_KEY` / `SMS_SENDER` | Envoi SMS (Twilio, OVH…) | repli fichier/console |
| `PARTNER_WEBHOOK_URL` / `PARTNER_WEBHOOK_SECRET` | Transmission des leads au CRM partenaire | désactivé |
| `PARTNER_API_KEYS` | Clés d'intake affilié, format `cle:Nom,cle2:Nom2` | aucune |

## Principales routes API

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/config` | Identité + texte de consentement + mentions RGPD |
| `GET` | `/api/variant/:slug` · `/lp/:slug` | Variantes de landing (Wallonie, Bruxelles, switch VOO, SOHO) |
| `POST` | `/api/leads` | Création d'un lead + preuve de consentement |
| `POST` | `/api/track/whatsapp` | Suivi des clics WhatsApp (par région) |
| `POST` | `/api/leads/desinscription` | Droit d'opposition (par email) |
| `GET` | `/api/admin/leads` · `/api/admin/stats` · `/api/admin/analytics` | CRM (auth) |
| `PATCH` | `/api/admin/leads/:id` | Qualification / statut / speed-to-lead (auth) |
| `GET` | `/api/admin/leads/export.csv` | Export CSV (auth) |
| `GET` | `/api/admin/leads/:id/consent[/certificate]` | Preuve / certificat de consentement (auth) |
| `POST` | `/api/admin/leads/:id/transmettre` | Transmission au webhook partenaire (auth) |
| `POST` | `/api/partner/leads` | Intake de leads d'affiliés (clé API `X-Api-Key`) |

Pages : `/` (landing), `/playbook.html` (playbook), `/admin.html` (CRM),
`/confidentialite.html`, `/mentions-legales.html`. Bandeau cookies sur les pages publiques.

## Tests

```bash
npm test   # suite d'integration (node:test), base SQLite temporaire isolee
```

## Rappel de conformité (Belgique)

- Case opt-in décochée par défaut, non conditionnante (consentement libre, spécifique, éclairé, univoque).
- Consentement spécifique à la prospection télécom (fibre / internet / TV / mobile) par téléphone.
- Respect de la liste « Ne m'appelez plus ! » (DNCM) — licence obligatoire pour l'outbound.
- Preuve de consentement horodatée conservée (5 ans recommandé), exportable (certificat imprimable).
- Distribution finale via une société **agréée** pour la commercialisation des offres Proximus.
- Marques citées (Proximus, VOO, Orange, Telenet) à titre informatif ; ce site n'est pas officiel.

Voir `docs/modele-consentement-belgique.md` pour le détail et `docs/playbook-fibre-belgique.md`
pour la stratégie d'acquisition complète.
