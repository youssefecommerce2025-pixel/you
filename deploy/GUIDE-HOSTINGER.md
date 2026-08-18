# Guide d'installation sur Hostinger (offre « Unlimited » avec Node.js)

Guide simple, étape par étape, pour mettre ton site en ligne sur Hostinger. Aucune manipulation
technique compliquée : le site a été préparé pour s'installer **sans compilation**.

> Vocabulaire :
> - **Node.js** = le « moteur » qui fait tourner ton site.
> - **hPanel** = le tableau de bord de Hostinger (là où tu gères tout).
> - **Variable d'environnement** = un réglage secret (mot de passe, numéro WhatsApp...) que le site lit
>   au démarrage.

---

## Étape 1 — Acheter l'offre et le domaine

1. Prends l'offre **Unlimited** (celle qui affiche **Node.js**).
2. Pendant l'achat, choisis un **centre de données en Europe** (France/Pays-Bas) — important pour la loi
   sur les données (RGPD).
3. Réserve ton nom de domaine (ex. `assurdom.fr`), inclus gratuitement 1 an.

## Étape 2 — Créer l'application Node.js

Dans **hPanel** :

1. Menu **Sites web** → ton site → cherche **« Node.js »** (section Avancé / Applications).
2. Clique **Créer une application**.
3. Renseigne :
   - **Version de Node.js** : choisis **22** (ou la plus récente proposée).
   - **Fichier de démarrage** (entry file) : `server.cjs`
   - **Dossier de l'application** : laisse par défaut (ex. `domains/assurdom.fr/nodejs`).

## Étape 3 — Mettre le code du site

Deux options, choisis la plus simple pour toi :

**Option A — depuis GitHub (recommandé)**
- Dans l'écran de l'application Node.js, connecte le dépôt GitHub
  `youssefecommerce2025-pixel/you` (branche `main` ou `cursor/site-leads-fibre-proximus-belgique-5ad5`).
- Hostinger télécharge le code et lance l'installation tout seul.

**Option B — envoi manuel (ZIP)**
- Télécharge le code depuis GitHub (bouton **Code → Download ZIP**).
- Dans hPanel → **Gestionnaire de fichiers**, ouvre le dossier de l'application et **envoie/dézippe** le ZIP.
- Reviens sur l'écran Node.js et clique **NPM install** (installe les composants du site).

## Étape 4 — Régler les paramètres (variables d'environnement)

Toujours dans l'écran de l'application Node.js, ajoute ces variables (rubrique « Variables
d'environnement ») :

| Nom | Valeur | À quoi ça sert |
|---|---|---|
| `ADMIN_TOKEN` | *(un mot de passe long, secret)* | Accès à ton espace conseiller (CRM) |
| `PUBLIC_BASE_URL` | `https://assurdom.fr` | Ton adresse publique |
| `WHATSAPP_NUMBER` | *(ton numéro, ex. 596696XXXXXX)* | Bouton WhatsApp |
| `DB_ENGINE` | `sqljs` | Utilise la base « sans compilation » (recommandé sur Hostinger) |

*(Tu pourras en ajouter d'autres plus tard : email, SMS, webhook... voir `.env.example`.)*

## Étape 5 — Démarrer et vérifier

1. Clique **Redémarrer** (ou **Démarrer**) l'application dans hPanel.
2. Ouvre `https://assurdom.fr` → ta landing page doit s'afficher.
3. Le HTTPS (le petit cadenas 🔒) est **automatique** chez Hostinger.

## Tes adresses une fois en ligne

- Landing : `https://assurdom.fr/`
- Pages par île (DOM) : `https://assurdom.fr/lp/martinique-senior`, `/lp/reunion-famille`, etc.
- Espace conseiller (CRM) : `https://assurdom.fr/admin.html` → connexion avec ton `ADMIN_TOKEN`.

---

## Questions fréquentes

**« Le site affiche une erreur au démarrage »**
→ Vérifie que le **fichier de démarrage** est bien `server.cjs`, que **NPM install** a été lancé,
et que la variable `DB_ENGINE` vaut `sqljs`. Puis **Redémarre** l'application.

**« Où sont stockés mes clients (leads) ? »**
→ Dans un fichier `data/leads.sqlite` dans le dossier de l'application. Grâce aux **sauvegardes
quotidiennes** de l'offre Unlimited, une copie est faite chaque jour. Pense à télécharger une copie de
ce fichier de temps en temps par sécurité.

**« Comment mettre à jour le site plus tard ? »**
→ Option A (GitHub) : clique **Redéployer**. Option B (ZIP) : renvoie le nouveau ZIP puis
**Redémarre**.

> Avant d'ouvrir au public : renseigne tes vraies informations via les variables `ORG_*` du `.env`
> (nom de ta société, numéro d'entreprise BCE/KBO, licence DNCM, contact). Ce guide n'est pas un
> conseil juridique.
