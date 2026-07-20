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

## Lancer avec Docker (aucune installation de Node requise)

Il te faut seulement [Docker](https://www.docker.com/products/docker-desktop/). Puis :

```bash
docker compose up --build
```

Ouvre ensuite http://localhost:3000 (CRM : http://localhost:3000/admin.html).
Le token du CRM est défini dans `docker-compose.yml` (`ADMIN_TOKEN`). La base SQLite est
persistée dans le volume `leads_data`. Pour arrêter : `Ctrl + C` puis `docker compose down`.

Sans compose, en Docker seul :

```bash
docker build -t leads-mutuelle .
docker run -p 3000:3000 -e ADMIN_TOKEN=test123 -v leads_data:/app/data leads-mutuelle
```

## Déployer en ligne (URL publique)

Le fichier `render.yaml` permet un déploiement en un clic sur [Render](https://render.com) :

1. Ce dépôt est déjà sur GitHub.
2. Sur Render : **New > Blueprint**, sélectionne ce dépôt.
3. Render lit `render.yaml`, crée le service (région Frankfurt = UE/RGPD) et fournit une URL `https://...onrender.com`.
4. Récupère le `ADMIN_TOKEN` généré dans le dashboard Render (onglet Environment) pour accéder au CRM.

> Le disque persistant (base SQLite conservée) nécessite le plan **starter** (payant). Pour un essai
> **gratuit**, mets `plan: free` et supprime le bloc `disk` dans `render.yaml` (la base sera alors
> réinitialisée à chaque redéploiement).

La même image Docker fonctionne aussi sur Railway, Fly.io, Scaleway, un VPS, etc.

## Voir le projet sans rien installer sur son PC (autre que Render)

Si Docker et l'installation de Node.js en local ne te conviennent pas, voici d'autres options —
tout se passe dans le navigateur, ta machine n'a rien à installer.

### Juste lire le code (0 clic, 0 compte)

Pour simplement regarder les fichiers (landing page, CRM, textes RGPD), il suffit de naviguer dans
ce dépôt GitHub, branche `cursor/leads-mutuelle-sante-optin`. Aucune installation, aucun compte.

### GitHub Codespaces — pour voir le site tourner, en un clic

C'est un « Node.js déjà installé, dans le navigateur ». GitHub te prête une machine dans le cloud,
tu n'installes rien chez toi.

1. Va sur ce lien : <https://codespaces.new/youssefecommerce2025-pixel/you/tree/cursor/leads-mutuelle-sante-optin>
   (connecte-toi avec ton compte GitHub si besoin).
2. Clique **Create codespace**. Une fenêtre type VS Code s'ouvre dans l'onglet du navigateur.
3. Patiente ~1 minute : les dépendances s'installent et le serveur démarre automatiquement
   (configuré dans `.devcontainer/devcontainer.json`) ; un aperçu s'ouvre tout seul.
4. Si l'aperçu ne s'ouvre pas seul : onglet **PORTS** en bas de l'écran → clique l'icône de globe
   sur la ligne du port `3000`.
5. Le token du CRM (`ADMIN_TOKEN`) pour `/admin.html` est `demo-admin-token` (défini dans le
   devcontainer, à changer avant toute vraie mise en production).

Gratuit jusqu'à 60h/mois sur un compte GitHub personnel, sans carte bancaire requise pour cet usage.
Pour montrer le site à quelqu'un d'autre : dans l'onglet **PORTS**, clic droit sur le port `3000` →
**Port Visibility** → **Public**, ce qui donne une vraie URL partageable.

### Replit — encore plus « zéro clavier »

1. Va sur <https://replit.com>, crée un compte gratuit (ou connexion GitHub).
2. **Create Repl** → **Import from GitHub** → colle `https://github.com/youssefecommerce2025-pixel/you`
   et choisis la branche `cursor/leads-mutuelle-sante-optin`.
3. Clique le gros bouton **Run** en haut. Replit installe les dépendances et lance `npm start`.
4. Une fenêtre d'aperçu apparaît avec une URL du type `https://....repl.co` — c'est ton adresse
   publique, comme avec Render.

### Rappel important

Sur Codespaces/Replit, sans configuration supplémentaire, la base SQLite n'est pas persistée de
façon durable (elle peut être réinitialisée si la machine cloud est recyclée) — parfait pour
« juste voir le site », pas adapté à une vraie production (pour ça, garde Render + disque persistant,
ou un VPS).

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
