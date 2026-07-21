# Frontend — Leads mutuelle santé

Pages statiques (landing page, CRM conseiller, confidentialité, mentions légales) pour la plateforme
de génération de leads mutuelle santé. L'**API** est dans un dépôt séparé : `backend`.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Landing page + formulaire opt-in conforme |
| `admin.html` | CRM conseiller (qualification, analytics) |
| `confidentialite.html` | Politique de confidentialité (RGPD) |
| `mentions-legales.html` | Mentions légales |
| `cookies.js` / `cookies.css` | Bandeau cookies (Google Consent Mode v2) |
| `config.js` | **URL de l'API backend** (à configurer) |

## Configuration (important)

Ouvre `config.js` et indique l'adresse de ton backend :

```js
window.API_BASE = "https://leads-mutuelle-sante.onrender.com"; // URL de ton backend
```

Laisse `""` uniquement si le frontend et le backend sont servis par le même domaine.

Côté backend, pense à autoriser le domaine du frontend via `ALLOWED_ORIGINS` (CORS).

## Prévisualiser en local

Aucune compilation nécessaire. Sers simplement le dossier, par exemple :

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Puis ouvre l'adresse indiquée (ex. http://localhost:8080).

## Déploiement (hébergement statique gratuit)

Ce dossier peut être déployé tel quel sur :

- **Netlify** : glisser-déposer le dossier, ou connecter le dépôt.
- **GitHub Pages** : Settings > Pages > branche `main`.
- **Render (Static Site)** : voir `render.yaml`.
- **Cloudflare Pages**, **Vercel**, etc.

> N'oublie pas de renseigner `config.js` avec l'URL du backend avant/juste après le déploiement.
