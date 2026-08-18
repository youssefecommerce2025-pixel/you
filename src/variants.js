// Variantes de landing page par région / persona (marché belge, fibre Proximus).
// Chaque variante personnalise le hero, préremplit des champs et fixe l'attribution.
//
// Numéro WhatsApp : WHATSAPP_NUMBER (format international sans + ni espaces, ex: 32470000000).

export const WHATSAPP_NUMBER = (process.env.WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

export const VARIANTS = {
  "wallonie-fibre": {
    region: "Wallonie",
    persona: "fibre-neuve",
    objectif: "fibre",
    title: "La fibre Proximus arrive en Wallonie : êtes-vous éligible ?",
    subtitle:
      "Vérifiez gratuitement si la fibre est disponible à votre adresse et recevez la meilleure offre internet, TV et mobile. Un conseiller vous rappelle sous 15 minutes.",
    bullets: [
      "Vérification d'éligibilité fibre gratuite",
      "Internet ultra-stable jusqu'à plusieurs Gbps",
      "Rappel d'un conseiller sous 15 minutes",
    ],
    wa_message:
      "Bonjour, je souhaite vérifier si la fibre Proximus est disponible à mon adresse en Wallonie.",
  },
  "bruxelles-fibre": {
    region: "Bruxelles",
    persona: "fibre-neuve",
    objectif: "fibre",
    title: "Fibre Proximus à Bruxelles : passez à la vitesse supérieure",
    subtitle:
      "Internet lent aux heures de pointe ? Vérifiez votre éligibilité à la fibre et comparez les packs. Un conseiller vous rappelle rapidement.",
    bullets: [
      "Éligibilité fibre vérifiée à votre adresse",
      "Packs internet + TV + mobile au meilleur prix",
      "Sans engagement, rappel sous 15 minutes",
    ],
    wa_message:
      "Bonjour, je veux vérifier mon éligibilité à la fibre Proximus à Bruxelles et comparer les offres.",
  },
  "switch-voo": {
    region: "Wallonie",
    persona: "switch-voo",
    objectif: "fibre",
    title: "Encore chez VOO / Orange ? Votre débit chute le soir ?",
    subtitle:
      "Découvrez ce que la fibre Proximus peut vous apporter : stabilité, débit et un pack adapté à votre foyer. Vérification gratuite, un conseiller vous rappelle.",
    bullets: [
      "Comparez votre offre actuelle à la fibre Proximus",
      "Un câble dédié, pas partagé avec le quartier",
      "Rappel gratuit sous 15 minutes",
    ],
    wa_message:
      "Bonjour, je suis chez VOO/Orange et je souhaite comparer avec la fibre Proximus.",
  },
  "soho-independants": {
    region: "Wallonie",
    persona: "soho",
    objectif: "pack",
    title: "Indépendants & TPE : une connexion pro qui ne lâche jamais",
    subtitle:
      "Internet fibre professionnel avec back-up 4G/5G, ligne fixe et mobile. Vérifiez votre éligibilité et recevez une offre adaptée à votre activité.",
    bullets: [
      "Fibre pro + back-up mobile (jamais hors ligne)",
      "Internet, TV et mobile sur une seule facture",
      "Un conseiller dédié vous rappelle rapidement",
    ],
    wa_message:
      "Bonjour, je suis indépendant/TPE et je cherche une offre internet pro Proximus (fibre + mobile).",
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
    region: VARIANTS[slug].region,
    persona: VARIANTS[slug].persona,
    title: VARIANTS[slug].title,
  }));
}
