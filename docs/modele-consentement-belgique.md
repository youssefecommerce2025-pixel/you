# Modèle de consentement — Prospection téléphonique télécom (Belgique)

Ce document décrit le texte de consentement recueilli sur la landing (source de vérité :
`src/consent.js`, versionnée via `CONSENT_VERSION`).

## Cadre légal belge

- **Régime actuel : opt-out.** Le démarchage téléphonique est autorisé sauf opposition du
  consommateur, via la liste **« Ne m'appelez plus ! »** gérée par l'asbl DNCM
  (art. VI.110 à VI.114 du Code de droit économique). Toute entreprise doit consulter cette liste
  avant campagne — amende jusqu'à **80 000 €** en cas de manquement.
- **Évolution : vers l'opt-in.** La proposition de loi n° 1081 (inspirée de la loi française du
  30 juin 2025) vise à basculer la Belgique vers le **consentement préalable**. Ce site est conçu
  **opt-in by design** : conforme aujourd'hui et déjà prêt pour l'opt-in.
- **RGPD** : le consentement doit être **libre, spécifique, éclairé et univoque**, et **révocable**.

## Exigences respectées

| Exigence | Mise en œuvre |
|---|---|
| Libre | La coche n'est pas une condition d'obtention du devis / de la vérification. |
| Spécifique | Consentement dédié à la prospection télécom (fibre / internet / TV / mobile) par téléphone. |
| Éclairé | Identité du responsable, finalité, destinataires, durée et droits indiqués. |
| Univoque | Case à cocher **non pré-cochée** (acte positif clair), vérifiée côté serveur. |
| Révocable | Retrait à tout moment (email / désinscription). |
| Preuve | Version + texte exact figés, horodatage, IP, URL, user-agent stockés par lead. |

## Texte de la case (par défaut)

> J'accepte d'être contacté(e) par téléphone par **{marque}** (ou un conseiller partenaire agréé)
> afin de vérifier mon éligibilité à la fibre et de recevoir une offre télécom **{opérateur}**
> (internet, TV, mobile) adaptée à ma demande. Je comprends que je peux retirer ce consentement à
> tout moment, sans frais.

## Preuve conservée (par lead)

Horodatage (UTC), adresse IP, URL exacte de la page, referer, user-agent, version du consentement,
texte exact présenté, méthode (single/double opt-in) et, le cas échéant, la confirmation double
opt-in. Exportable en JSON et sous forme de **certificat imprimable** depuis le CRM.

## Checklist avant exploitation

- [ ] Licence **DNCM** active (via la société qui te mandate) et liste consultée avant chaque campagne.
- [ ] Mentions `ORG_*` renseignées (raison sociale, BCE/KBO, adresse, email, DPO).
- [ ] Horaires d'appel respectés ; procédure d'opt-out opérationnelle.
- [ ] Durée de conservation : fiche 3 ans, preuve 5 ans.
- [ ] Hébergement des données en Union européenne.
- [ ] Validation par la société partenaire + un juriste (consommation / RGPD).
