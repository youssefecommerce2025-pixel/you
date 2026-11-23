# Captivia — site vitrine

Site bilingue (français / arabe, droite à gauche) de Captivia, atelier de conception de sites e-commerce pour les marques marocaines de parfumerie, soins et cosmétiques. React + Vite + Tailwind + Framer Motion.

```bash
cd captivia-site
npm install
npm run dev      # http://localhost:5180
npm run build    # génère dist/ (site statique)
```

## Où modifier quoi

- **Tous les textes** (storytelling, offres, prix, comparatif, questions du diagnostic, FAQ), en français et en arabe : `src/lib/content.ts`.
- **Numéro WhatsApp, e-mail, Instagram** : variables d'environnement (voir `.env.example`), sinon les valeurs par défaut de `src/lib/config.ts`.
- **Logique de recommandation** (poids de chaque réponse vers chaque offre) : `src/lib/diagnostic.ts`.
- **Palettes, typographies et images de la maquette interactive** : `src/lib/design.ts`.

## Réception des demandes du diagnostic

À la fin du diagnostic, le client voit l'offre recommandée et un bouton qui ouvre WhatsApp avec un message prérempli. En plus :

- **Netlify** : les réponses arrivent dans *Forms › diagnostic* sans configuration (formulaire statique déclaré dans `index.html`).
- **Webhook** (Google Sheets via Apps Script, Make, Zapier…) : définir `VITE_LEAD_WEBHOOK`. Le site y envoie un POST JSON avec le contact, les réponses, le commentaire, l'offre recommandée et la maquette composée dans l'atelier.

## Langue

La langue suit le navigateur, se change avec le bouton de l'en-tête et peut être forcée par l'URL : `?lang=fr` ou `?lang=ar`.
