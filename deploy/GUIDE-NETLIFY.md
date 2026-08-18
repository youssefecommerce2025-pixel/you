# Guide — Mettre le site en ligne sur Netlify (liens publics)

Netlify héberge des **fichiers statiques**. Ce projet a en plus un **backend Node**
(API `/api/*`, CRM `/admin.html`, base SQLite). L'architecture recommandée :

```
Netlify  →  sert les pages (public/)  →  proxifie /api/*  →  Backend Node (Render / VPS)
```

Le fichier `netlify.toml` à la racine fait déjà ce travail : il publie `public/`, redirige
`/lp/*` vers la landing, et proxifie `/api/*` + `/health` vers ton backend.

---

## Étape 1 — Mettre le backend en ligne (5 min, gratuit)

Le plus simple : **Render** (config déjà prête dans `render.yaml`).

1. Va sur [render.com](https://render.com) → **New > Blueprint** → sélectionne ce dépôt.
2. Render lit `render.yaml`, crée le service (région **Frankfurt** = UE/RGPD) et te donne une URL
   du type `https://leads-fibre-proximus-belgique.onrender.com`.
3. Dans l'onglet **Environment**, récupère la valeur générée de `ADMIN_TOKEN` (accès au CRM) et
   ajoute tes variables `ORG_*` + `WHATSAPP_NUMBER`.

> Pour un essai **gratuit** : mets `plan: free` et supprime le bloc `disk` dans `render.yaml`
> (attention : sans disque, la base SQLite est réinitialisée à chaque redéploiement).

**Alternative pour une démo rapide** : un tunnel Cloudflare (`cloudflared tunnel --url http://localhost:3000`)
te donne une URL `https://xxxx.trycloudflare.com` — mais elle est **temporaire**.

## Étape 2 — Renseigner l'URL du backend

Ouvre `netlify.toml` et remplace les **3 occurrences** de `BACKEND_URL` par ton domaine backend
(sans `https://` en double), par exemple :

```toml
to = "https://leads-fibre-proximus-belgique.onrender.com/api/:splat"
```

## Étape 3 — Déployer sur Netlify

### Option A — Depuis Git (recommandé, redéploiement automatique)

1. Va sur [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Connecte GitHub et choisis le dépôt, branche `cursor/site-leads-fibre-proximus-belgique-5ad5`
   (ou `main` après fusion de la PR).
3. Netlify lit `netlify.toml` : **Publish directory = `public`**, aucune commande de build.
4. **Deploy site** → tu obtiens une URL `https://<nom-aleatoire>.netlify.app`.
5. (Optionnel) **Site settings > Change site name** pour avoir `https://proxifibre.netlify.app`.

### Option B — Glisser-déposer (le plus rapide, sans Git)

1. Va sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Glisse le dossier **`public/`** dans la zone.
3. Tu obtiens immédiatement une URL `https://….netlify.app`.

> ⚠️ En glisser-déposer, `netlify.toml` (qui est à la racine, pas dans `public/`) n'est **pas** pris
> en compte : les routes `/lp/*` et le proxy `/api/*` ne fonctionneront pas. Utilise l'option A
> pour un site complet.

## Étape 4 — Vérifier

Une fois en ligne, teste ces URLs :

| Page | Chemin |
|---|---|
| Landing (check fibre) | `/` |
| Playbook acquisition | `/playbook.html` |
| CRM conseiller | `/admin.html` |
| Landing Wallonie | `/lp/wallonie-fibre` |
| Landing Bruxelles | `/lp/bruxelles-fibre` |
| Switch VOO / Orange | `/lp/switch-voo` |
| Indépendants / TPE | `/lp/soho-independants` |
| Confidentialité | `/confidentialite.html` |
| Mentions légales | `/mentions-legales.html` |

Contrôles rapides :
- La landing s'affiche avec le thème violet et le formulaire.
- Tape `5000` dans le code postal → « 📍 Wallonie » doit apparaître (test 100 % client).
- Soumets le formulaire → le lead doit apparaître dans `/admin.html` (nécessite le backend + le token).

## Domaine personnalisé

**Site settings > Domain management > Add a domain** : ajoute `proxifibre.be` (ou ton domaine),
puis suis les instructions DNS. Netlify fournit le **HTTPS gratuit** (Let's Encrypt).

---

## Limites à connaître

- Netlify **ne peut pas** héberger la base SQLite : le backend doit vivre ailleurs (Render, VPS…).
- Le CRM (`/admin.html`) et l'envoi de leads dépendent du backend : si le proxy n'est pas configuré,
  la landing reste visible mais non fonctionnelle.
- Alternative « tout-en-un » : héberger **l'app complète** sur Render / un VPS (voir
  `GUIDE-DEPLOIEMENT.md`) et n'utiliser Netlify que si tu veux séparer le front.
