/**
 * Source de vérité unique du texte de consentement (prospection téléphonique télécom).
 * ---------------------------------------------------------------------------------
 * Contexte marché belge (fibre / packs Proximus commercialisés par un partenaire agréé) :
 *
 *  - En Belgique, le démarchage téléphonique est aujourd'hui en régime d'OPT-OUT :
 *    l'appel est autorisé sauf si le numéro figure sur la liste « Ne m'appelez plus ! »
 *    (DNCM asbl). Toute entreprise DOIT consulter cette liste avant campagne
 *    (art. VI.111 à VI.114 du Code de droit économique) sous peine d'amende (jusqu'à 80.000 €).
 *
 *  - Une proposition de loi (Doc. 1081, inspirée de la loi française du 30 juin 2025) vise
 *    à basculer la Belgique vers l'OPT-IN (consentement préalable). Ce site est donc conçu
 *    « opt-in by design » : on recueille un consentement libre, spécifique, éclairé et
 *    univoque (case NON pré-cochée) — conforme dès aujourd'hui et déjà prêt pour l'opt-in.
 *
 * Règles respectées :
 *  - LIBRE : la coche n'est pas une condition d'obtention du devis.
 *  - SPÉCIFIQUE : consentement dédié à la prospection télécom (fibre / internet / TV / mobile) par téléphone.
 *  - ÉCLAIRÉ : identité du responsable, finalité, destinataires, durée et droits indiqués.
 *  - UNIVOQUE : case à cocher NON pré-cochée (acte positif clair) — géré côté UI + serveur.
 *  - RÉVOCABLE : retrait à tout moment (email/désinscription) mentionné.
 *  - PREUVE : version + texte exact figés et stockés avec chaque lead.
 *
 * À CHAQUE MODIFICATION DU TEXTE -> incrémenter CONSENT_VERSION.
 */

export const CONSENT_VERSION = "2026-08-be-v1";

// Identité (à personnaliser avec la société belge licenciée qui vous mandate).
// Ces valeurs alimentent la landing, les mentions légales et le certificat de consentement.
export const ORG = {
  marque: process.env.ORG_BRAND || "ProxiFibre",
  raisonSociale: process.env.ORG_LEGAL_NAME || "ProxiFibre (partenaire agréé)",
  formeJuridique: process.env.ORG_LEGAL_FORM || "",
  // Numéro d'entreprise BCE / KBO (10 chiffres) de la société qui détient la licence.
  numeroEntreprise: process.env.ORG_BCE || "BE 0XXX.XXX.XXX",
  adresse: process.env.ORG_ADDRESS || "Belgique",
  email: process.env.ORG_EMAIL || "contact@proxifibre.be",
  emailDpo: process.env.ORG_DPO_EMAIL || "privacy@proxifibre.be",
  telephone: process.env.ORG_PHONE || "+32 2 000 00 00",
  // Marque du produit commercialisé (réseau / opérateur).
  operateur: process.env.ORG_OPERATOR || "Proximus",
  // Licence DNCM (« Ne m'appelez plus ! ») — obligatoire pour l'outbound en Belgique.
  licenceDncm: process.env.ORG_DNCM_LICENSE || "",
  hebergeur: {
    nom: process.env.HOST_NAME || "Hébergeur (Union européenne)",
    adresse: process.env.HOST_ADDRESS || "Union européenne",
    telephone: process.env.HOST_PHONE || "",
  },
};

// Case à cocher obligatoire (opt-in téléphonique spécifique télécom) — décochée par défaut.
export const CONSENT_TELEPHONE =
  `J'accepte d'être contacté(e) par téléphone par ${ORG.marque} ` +
  `(ou un conseiller partenaire agréé) afin de vérifier mon éligibilité à la fibre et de recevoir ` +
  `une offre télécom ${ORG.operateur} (internet, TV, mobile) adaptée à ma demande. ` +
  `Je comprends que je peux retirer ce consentement à tout moment, sans frais.`;

// Mentions d'information (RGPD) affichées sous le formulaire — informatives, non cochables.
export function mentionInformation() {
  return [
    `Les informations recueillies via ce formulaire sont enregistrées par ${ORG.raisonSociale}` +
      (ORG.formeJuridique ? ` (${ORG.formeJuridique})` : "") +
      `, responsable de traitement, aux seules fins de vérifier votre éligibilité à la fibre, ` +
      `de vous rappeler et de vous proposer une offre télécom ${ORG.operateur} correspondant à votre demande.`,
    `Base légale : votre consentement (art. 6.1.a RGPD) et l'exécution de mesures précontractuelles à votre demande.`,
    `Aucune donnée sensible n'est collectée. Merci de ne pas en communiquer.`,
    `Destinataires : nos équipes commerciales habilitées et, le cas échéant, la société partenaire agréée chargée de traiter votre demande d'abonnement.`,
    `Prospection téléphonique en Belgique : nous respectons la liste « Ne m'appelez plus ! » (DNCM) ` +
      `et n'appelons que les personnes ayant donné leur accord.`,
    `Durée de conservation : la fiche prospect est conservée 3 ans à compter du dernier contact ; ` +
      `la preuve de consentement est conservée 5 ans à titre probatoire.`,
    `Hébergement des données : Union européenne.`,
    `Vos droits : accès, rectification, effacement, opposition, limitation et portabilité. ` +
      `Pour les exercer ou retirer votre consentement : ${ORG.emailDpo}. ` +
      `Vous pouvez introduire une réclamation auprès de l'Autorité de protection des données (APD/GBA, www.autoriteprotectiondonnees.be).`,
  ];
}

// Bloc de consentement complet (texte figé) stocké comme PREUVE avec chaque lead.
export function buildConsentSnapshot() {
  return {
    version: CONSENT_VERSION,
    checkbox_label: CONSENT_TELEPHONE,
    information_notice: mentionInformation().join("\n"),
    generated_by: ORG.raisonSociale,
  };
}
