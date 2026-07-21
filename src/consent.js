/**
 * POINT 3 - Modele de mentions de consentement RGPD / mutuelle sante
 * ------------------------------------------------------------------
 * Source de verite unique du texte de consentement.
 *
 * Regles legales respectees ici (loi n° 2025-594 du 30 juin 2025, RGPD, exigences ACPR) :
 *  - consentement LIBRE : la coche n'est pas une condition d'achat.
 *  - SPECIFIQUE : le consentement vise uniquement la prospection "mutuelle sante" par telephone.
 *  - ECLAIRE : identite du responsable, finalite, destinataires, duree, droits sont indiques.
 *  - UNIVOQUE / acte positif clair : case a cocher NON pre-cochee (gere cote UI/serveur).
 *  - REVOCABLE : lien / procede de desinscription mentionne.
 *  - PREUVE : la version + le texte exact sont figes et stockes avec chaque lead.
 *
 * A CHAQUE MODIFICATION DU TEXTE -> incrementer CONSENT_VERSION.
 * Les anciens leads gardent la version sous laquelle ils ont consenti (tracabilite).
 */

export const CONSENT_VERSION = "2026-08-v1";

// Personnalise ces valeurs avec ta vraie raison sociale / mentions.
export const ORG = {
  raisonSociale: "[TA RAISON SOCIALE]",
  formeJuridique: "[SARL / SAS / ...]",
  adresse: "[Adresse complete]",
  email: "contact@[ton-domaine].fr",
  emailDpo: "dpo@[ton-domaine].fr",
  telephone: "[Numero]",
  siteComparateur: "[nom-du-comparateur].fr",
  // Mentions legales complementaires
  capitalSocial: "[Montant] €",
  rcs: "[Ville] [SIREN]",
  siret: "[14 chiffres]",
  tvaIntra: "[FR + 11 chiffres]",
  directeurPublication: "[Nom du directeur de publication]",
  orias: "[Numero ORIAS a 8 chiffres]",
  hebergeur: {
    nom: "[Nom de l'hebergeur]",
    adresse: "[Adresse de l'hebergeur]",
    telephone: "[Telephone de l'hebergeur]",
  },
};

// Case a cocher obligatoire (opt-in telephonique specifique) - decochee par defaut.
export const CONSENT_TELEPHONE = [
  `J'accepte d'etre contacte(e) par telephone par ${ORG.raisonSociale}`,
  `et/ou un courtier en assurance partenaire immatricule a l'ORIAS,`,
  `afin de recevoir un devis et des offres de mutuelle sante correspondant a ma demande.`,
  `Je comprends que je peux retirer ce consentement a tout moment.`,
].join(" ");

// Mention d'information (RGPD) affichee sous le formulaire - non cochable, informative.
export function mentionInformation() {
  return [
    `Les informations recueillies via ce formulaire sont enregistrees par ${ORG.raisonSociale} (${ORG.formeJuridique}), ` +
      `responsable de traitement, aux seules fins de traiter votre demande de devis de mutuelle sante ` +
      `et de vous mettre en relation avec un courtier en assurance partenaire immatricule a l'ORIAS.`,
    `Base legale : votre consentement (art. 6.1.a RGPD) et l'execution de mesures precontractuelles a votre demande.`,
    `Nous ne collectons AUCUNE donnee de sante (pathologie, traitement, antecedent). Merci de ne pas en communiquer.`,
    `Destinataires : nos equipes habilitees et, le cas echeant, le courtier partenaire selectionne pour votre devis.`,
    `Duree de conservation : la fiche prospect est conservee 3 ans a compter du dernier contact ; ` +
      `la preuve de consentement est conservee 5 ans a titre probatoire.`,
    `Hebergement des donnees : Union europeenne.`,
    `Vos droits : acces, rectification, effacement, opposition, limitation et portabilite. ` +
      `Pour les exercer ou retirer votre consentement : ${ORG.emailDpo}. ` +
      `Vous pouvez introduire une reclamation aupres de la CNIL (www.cnil.fr).`,
  ];
}

// Bloc de consentement complet (texte fige) stocke comme PREUVE avec chaque lead.
export function buildConsentSnapshot() {
  return {
    version: CONSENT_VERSION,
    checkbox_label: CONSENT_TELEPHONE,
    information_notice: mentionInformation().join("\n"),
    generated_by: ORG.raisonSociale,
  };
}
