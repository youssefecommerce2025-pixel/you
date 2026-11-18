# Amerray & Co. — nouveau site

Boutique moderne pour [amerray.com](https://amerray.com) (React + Vite + Tailwind), bilingue français / arabe, pensée mobile d'abord pour le marché marocain.

Le catalogue (934 produits : parfums, packs, musc, bakhour, kids, maison) est importé directement depuis la boutique Shopify actuelle, avec les mêmes noms, prix, photos, handles et identifiants de variantes. Aucune donnée n'est perdue.

## Lancer le site en local

Prérequis : Node.js 20 ou plus récent.

```bash
cd amerray-site
npm install
npm run dev
```

Puis ouvrir http://localhost:5173.

Version optimisée (production) :

```bash
npm run build
npm run preview   # http://localhost:4173
```

## Mettre à jour le catalogue

```bash
npm run import:catalog
```

Le script `scripts/import-catalog.mjs` relit `amerray.com/collections/*/products.json` et régénère `src/data/catalog.json` (notes olfactives, famille, saison, tenue, sillage, avis clients extraits des fiches produits).

## Recevoir les commandes

Le formulaire « Paiement à la livraison » (nom, téléphone, ville, adresse) :

1. ouvre WhatsApp vers le +212 665-440983 avec le récapitulatif complet de la commande ;
2. si la variable `VITE_ORDER_WEBHOOK` est définie (Google Sheets Apps Script, Make, Zapier, n8n…), envoie aussi la commande en JSON à cette URL.

```bash
VITE_ORDER_WEBHOOK="https://script.google.com/macros/s/XXXX/exec" npm run build
```

## Ce qui a été ajouté par rapport au site actuel

- Recherche instantanée par parfum original, marque ou note (« Sauvage », « Baccarat », « vanille »…).
- Offre 3 + 1 calculée automatiquement dans le panier, avec barre de progression et suggestions pour compléter le pack.
- Page « Composer mon pack » interactive (4 emplacements, le 4e offert).
- Quiz olfactif en 5 questions avec recommandations notées.
- Fiches produit : pyramide olfactive, tenue, sillage, saisons, moments, avis, estimation de livraison par ville, commande WhatsApp, barre d'achat collante sur mobile.
- Filtres par genre, famille, saison, moment et intensité.
- Version arabe complète (droite à gauche).
- Checkout en une étape sans compte, validation des numéros marocains, estimation de la date de livraison.
- Favoris, produits vus récemment, barre d'onglets mobile, bouton WhatsApp flottant.
- SEO : balises meta, données structurées Product / Store (JSON-LD).

## Déploiement

Le dossier `dist/` est un site statique : Netlify, Vercel, Cloudflare Pages ou n'importe quel hébergeur. Le fichier `public/_redirects` gère les URL de l'application sur Netlify / Cloudflare Pages.
