// Variantes de landing page par ile / persona (DOM-TOM).
// Chaque variante personnalise le hero, pre-remplit des champs et fixe l'attribution.
//
// Numero WhatsApp : WHATSAPP_NUMBER (format international sans + ni espaces, ex: 596696XXXXXX).

export const WHATSAPP_NUMBER = (process.env.WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

export const VARIANTS = {
  "martinique-senior": {
    ile: "Martinique",
    persona: "senior",
    tranche_age: "65-74",
    title: "Mutuelle senior en Martinique : mieux remboursé, sans payer plus cher",
    subtitle:
      "Optique, dentaire, hospitalisation : comparez les mutuelles adaptées aux seniors et recevez un devis gratuit. Un conseiller vous rappelle.",
    bullets: [
      "Spécial 60 ans et + en Martinique",
      "Meilleurs remboursements lunettes, dents, hospitalisation",
      "Devis gratuit et sans engagement",
    ],
    wa_message:
      "Bonjour, je souhaite comparer les mutuelles senior en Martinique et recevoir un devis.",
  },
  "guadeloupe-senior": {
    ile: "Guadeloupe",
    persona: "senior",
    tranche_age: "65-74",
    title: "Mutuelle senior en Guadeloupe : payez le juste prix",
    subtitle:
      "Comparez les offres adaptées aux seniors guadeloupéens (optique, dentaire, hospitalisation) et recevez un devis gratuit.",
    bullets: [
      "Spécial 60 ans et + en Guadeloupe",
      "Économisez sur votre complémentaire santé",
      "Un conseiller local vous rappelle rapidement",
    ],
    wa_message:
      "Bonjour, je souhaite comparer les mutuelles senior en Guadeloupe et recevoir un devis.",
  },
  "reunion-famille": {
    ile: "La Réunion",
    persona: "famille",
    tranche_age: "35-54",
    title: "Une bonne mutuelle pour toute la famille à La Réunion, sans exploser le budget",
    subtitle:
      "Comparez les mutuelles familiales et trouvez la meilleure couverture au meilleur prix. Devis gratuit, un conseiller vous rappelle.",
    bullets: [
      "Couverture pour toute la famille",
      "Le meilleur rapport garanties / prix",
      "Gratuit et sans engagement",
    ],
    wa_message:
      "Bonjour, je cherche une mutuelle pour ma famille à La Réunion et je souhaite un devis.",
  },
  "guyane-famille": {
    ile: "Guyane",
    persona: "famille",
    tranche_age: "35-54",
    title: "Mutuelle famille en Guyane : bien couvert, au meilleur prix",
    subtitle:
      "Comparez les offres et recevez un devis gratuit adapté à votre famille. Un conseiller vous rappelle.",
    bullets: [
      "Adapté aux familles guyanaises",
      "Comparaison gratuite de plusieurs assureurs",
      "Sans engagement",
    ],
    wa_message:
      "Bonjour, je souhaite comparer les mutuelles famille en Guyane et recevoir un devis.",
  },
  "dom-fonctionnaire": {
    ile: "DOM-TOM",
    persona: "fonctionnaire",
    tranche_age: "35-54",
    title: "Fonctionnaires en Outre-mer : optimisez votre mutuelle santé",
    subtitle:
      "Comparez les meilleures complémentaires santé adaptées aux agents de la fonction publique en DOM. Devis gratuit.",
    bullets: [
      "Offres adaptées aux fonctionnaires en Outre-mer",
      "Garanties renforcées possibles",
      "Devis gratuit, un conseiller vous rappelle",
    ],
    wa_message:
      "Bonjour, je suis fonctionnaire en Outre-mer et je souhaite optimiser ma mutuelle santé.",
  },
};

export function getVariant(slug) {
  const v = VARIANTS[slug];
  if (!v) return null;
  return { slug, whatsapp: WHATSAPP_NUMBER, ...v };
}

export function listVariants() {
  return Object.keys(VARIANTS).map((slug) => ({
    slug,
    ile: VARIANTS[slug].ile,
    persona: VARIANTS[slug].persona,
    title: VARIANTS[slug].title,
  }));
}
