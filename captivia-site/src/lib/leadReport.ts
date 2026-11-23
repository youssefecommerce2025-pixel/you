import type { FeatureId, PaletteId, Universe } from './design'
import type { Lead, OfferId, QuestionId } from './diagnostic'

const OFFERS: Record<OfferId, string> = {
  essentiel: 'L’Essentiel Express',
  experience: 'L’Expérience Olfactive',
  prestige: 'Prestige & Sur-Mesure',
}

const QUESTIONS: Record<QuestionId, { options: Record<string, string> }> = {
  univers: {
    options: { parfum: 'Parfumerie', soin: 'Soins et skincare', cosmetique: 'Cosmétiques et maquillage', multi: 'Un peu de tout' },
  },
  canal: {
    options: {
      dm: 'Uniquement en messages (Instagram, TikTok, WhatsApp)',
      site: 'A déjà un site (YouCan, Shopify, autre)',
      boutique: 'Boutique physique et réseaux sociaux',
      lancement: 'Lance sa marque',
    },
  },
  catalogue: {
    options: { s: 'Moins de 20', m: 'Entre 20 et 80', l: 'Plus de 80' },
  },
  commandes: {
    options: { s: 'Moins de 50', m: 'Entre 50 et 300', l: 'Plus de 300' },
  },
  frustration: {
    options: {
      dm: 'Perd des ventes dans les messages',
      image: 'Le site ne reflète pas le luxe de la marque',
      panier: 'Un client ou une cliente n’achète qu’un seul produit',
      unique: 'Veut se démarquer de la concurrence',
    },
  },
  fonctions: {
    options: {
      cod: 'Commande en 1 clic et paiement à la livraison',
      story: 'Fiches produits expertes',
      pack: 'Packs et offres 3 + 1',
      avis: 'Avis des clients et des clientes',
      quiz: 'Quiz pour guider le choix',
      bilingue: 'Version en arabe',
      wow: 'Animations',
      dashboard: 'Tableau de bord des ventes',
    },
  },
  budget: {
    options: { s: 'Moins de 2 000 DH', m: 'Entre 2 000 et 4 000 DH', l: 'Plus de 4 000 DH', conseil: 'Préfère être conseillé(e)' },
  },
  delai: {
    options: { urgent: 'Le plus vite possible', mois: 'Dans le mois', flexible: 'Pas pressé(e)' },
  },
}

const UNIVERSES: Record<Universe, string> = {
  parfum: 'Parfumerie',
  soin: 'Soins et skincare',
  cosmetique: 'Cosmétiques',
}

const PALETTES: Record<PaletteId, string> = {
  amethyste: 'Améthyste',
  'noir-or': 'Noir et or',
  rose: 'Rose poudré',
  oud: 'Sable et oud',
  botanique: 'Botanique',
}

const FONTS = { elegante: 'Élégante', editoriale: 'Éditoriale', moderne: 'Moderne' }

const FEATURES: Record<FeatureId, string> = {
  cod: 'Commande 1 clic et paiement à la livraison',
  story: 'Fiche produit experte',
  pack: 'Pack 3 achetés = 1 offert',
  avis: 'Avis des clients et des clientes',
  quiz: 'Quiz trouvez votre produit',
  bilingue: 'Version français et arabe',
}

function labels(id: QuestionId, values: string[] | undefined) {
  const q = QUESTIONS[id]
  return (values ?? []).map((value) => q.options[value] ?? value).join(' · ')
}

function casablancaStamp(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('fr-MA', {
    timeZone: 'Africa/Casablanca',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** Flat, French, human-readable row sent to Google Sheets and used for the WhatsApp alert. */
export function leadReport(lead: Lead) {
  const offer = OFFERS[lead.recommendation.offer]
  const alternative = OFFERS[lead.recommendation.alternative]
  return {
    source: 'captivia-diagnostic',
    date: casablancaStamp(lead.createdAt),
    prenom: lead.contact.firstName.trim(),
    nom: lead.contact.lastName.trim(),
    marque: lead.contact.brand.trim(),
    telephone: lead.contact.phone.trim(),
    email: lead.contact.email.trim(),
    langue: lead.lang === 'ar' ? 'Arabe' : 'Français',
    offre: offer,
    compatibilite: `${lead.recommendation.match} %`,
    alternative,
    univers: labels('univers', lead.answers.univers),
    canal: labels('canal', lead.answers.canal),
    catalogue: labels('catalogue', lead.answers.catalogue),
    commandes: labels('commandes', lead.answers.commandes),
    frustration: labels('frustration', lead.answers.frustration),
    fonctions: labels('fonctions', lead.answers.fonctions),
    budget: labels('budget', lead.answers.budget),
    delai: labels('delai', lead.answers.delai),
    commentaire: lead.comment.trim(),
    maquette: [
      UNIVERSES[lead.design.universe],
      PALETTES[lead.design.palette],
      FONTS[lead.design.font],
      lead.design.features.map((feature) => FEATURES[feature]).join(', '),
    ]
      .filter(Boolean)
      .join(' · '),
    offre_regardee: lead.interestedOffer ? OFFERS[lead.interestedOffer] : '',
  }
}
