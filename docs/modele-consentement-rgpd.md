# Modèle de mentions de consentement — Mutuelle santé (RGPD + loi du 30 juin 2025)

> ⚠️ **Avertissement** : ce document est un modèle opérationnel destiné à t'orienter. Il ne remplace
> pas la validation par un avocat spécialisé (droit de la consommation / assurance) et un DPO.
> Personnalise toutes les mentions entre crochets `[...]` avec tes vraies informations.

Ce modèle est **implémenté** dans le code : `src/consent.js` en est la source de vérité (texte figé
et versionné), affiché sur la landing page et stocké comme preuve avec chaque lead.

---

## 1. Pourquoi ces mentions ? (rappel légal)

À partir du **11 août 2026**, la **loi n° 2025-594 du 30 juin 2025** (nouvel art. L. 223-1 du Code de
la consommation) interdit le démarchage téléphonique **sans consentement préalable**. Le consentement
doit être :

| Critère | Ce que ça impose concrètement |
|---|---|
| **Libre** | La coche n'est PAS une condition pour obtenir le devis/service. |
| **Spécifique** | Le consentement vise uniquement la prospection **mutuelle santé par téléphone**. |
| **Éclairé** | Identité du responsable, finalité, destinataires, durée, droits clairement indiqués. |
| **Univoque** | Case à cocher **NON pré-cochée** = acte positif clair. Pas de case pré-cochée, pas de CGU. |
| **Révocable** | Un moyen simple de retirer son consentement / se désinscrire. |
| **Prouvable** | Horodatage + IP + URL + version du texte conservés (charge de la preuve sur toi). |

Le secteur assurance ajoute : immatriculation **ORIAS** du distributeur, supervision **ACPR**,
**devoir de conseil**, et **interdiction de collecter des données de santé** dans le formulaire.

---

## 2. Case à cocher opt-in (obligatoire, décochée par défaut)

> ☐ J'accepte d'être contacté(e) par téléphone par **[TA RAISON SOCIALE]** et/ou un courtier en
> assurance partenaire immatriculé à l'ORIAS, afin de recevoir un devis et des offres de mutuelle
> santé correspondant à ma demande. Je comprends que je peux retirer ce consentement à tout moment.

**Règles d'affichage :**
- La case doit être **décochée par défaut**.
- Elle ne doit pas conditionner l'accès au service (consentement libre).
- Le texte doit rester lisible (pas en gris minuscule).

---

## 3. Mention d'information RGPD (sous le formulaire)

> Les informations recueillies via ce formulaire sont enregistrées par **[TA RAISON SOCIALE]**
> (**[forme juridique]**, **[adresse]**), responsable de traitement, aux seules fins de traiter votre
> demande de devis de mutuelle santé et de vous mettre en relation avec un courtier en assurance
> partenaire immatriculé à l'ORIAS.
>
> **Base légale** : votre consentement (art. 6.1.a RGPD) et l'exécution de mesures précontractuelles
> prises à votre demande.
>
> **Aucune donnée de santé** (pathologie, traitement, antécédent) n'est collectée. Merci de ne pas en
> communiquer.
>
> **Destinataires** : nos équipes habilitées et, le cas échéant, le courtier partenaire sélectionné.
>
> **Durée de conservation** : fiche prospect conservée 3 ans à compter du dernier contact ; preuve de
> consentement conservée 5 ans à titre probatoire.
>
> **Hébergement** : Union européenne.
>
> **Vos droits** : accès, rectification, effacement, opposition, limitation, portabilité. Pour les
> exercer ou retirer votre consentement : **[dpo@ton-domaine.fr]**. Réclamation possible auprès de la
> CNIL (www.cnil.fr).

---

## 4. Double opt-in (recommandé pour la mutuelle santé)

Pour une preuve renforcée et une meilleure qualité de lead, envoie un **email ou SMS de confirmation**
avec un lien unique. Exemple de message :

> Bonjour [Prénom], pour finaliser votre demande de devis mutuelle santé et être recontacté(e) par un
> conseiller, merci de confirmer votre demande en cliquant ici : **[lien de confirmation]**.
> Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.

Dans l'app, le double opt-in s'active avec la variable `DOUBLE_OPTIN=1`. La confirmation est
horodatée avec l'IP du clic (`confirmed_at`, `confirm_ip`).

---

## 5. Éléments de preuve conservés par lead

Pour chaque lead, l'application stocke automatiquement (table `consent_proofs`) :

- `collected_at` — horodatage ISO 8601 (UTC) du consentement ;
- `ip_address` — IP du prospect au moment de la coche ;
- `user_agent` — navigateur/appareil ;
- `source_url` — URL exacte de la page de capture ;
- `referer` — provenance ;
- `consent_version` — version du texte présenté (ex. `2026-08-v1`) ;
- `consent_text` — copie figée du texte exact affiché ;
- `consent_checkbox` — preuve que la case a été cochée ;
- `method` — `single_optin` ou `double_optin` (+ `confirmed_at`, `confirm_ip`).

Export pour un contrôle CNIL/ACPR : `GET /api/admin/leads/:id/consent`.

---

## 6. Versionnage

À **chaque modification** du texte de consentement, **incrémente** `CONSENT_VERSION` dans
`src/consent.js` (ex. `2026-08-v1` → `2026-09-v2`). Les anciens leads conservent la version sous
laquelle ils ont consenti — ne jamais réécrire l'historique.

---

## 7. Checklist de conformité avant mise en production

- [ ] Raison sociale, adresse, ORIAS et contacts DPO renseignés partout.
- [ ] Case opt-in décochée par défaut et non conditionnante.
- [ ] Aucun champ de données de santé dans le formulaire.
- [ ] Mention d'information RGPD visible et complète.
- [ ] Preuve de consentement stockée et exportable.
- [ ] Procédé de désinscription / retrait du consentement fonctionnel.
- [ ] Le distributeur final est bien immatriculé ORIAS.
- [ ] Encadrement du transfert de données si traitement hors UE (ex. centre au Maroc) :
      clauses contractuelles types (CCT) + mesures de sécurité.
- [ ] Registre des traitements et politique de confidentialité en ligne.
- [ ] Validation finale par avocat + DPO.
