# Guide de déploiement — Nom de domaine + serveur (VPS)

Ce guide t'accompagne pas à pas pour héberger l'application sur ton propre serveur avec ton nom de
domaine et le HTTPS. L'application étant en **Node.js**, il te faut un **VPS** (serveur privé virtuel),
pas un hébergement mutualisé « PHP » classique.

> ⚠️ RGPD : choisis un hébergeur avec des **serveurs en Union européenne** (données de prospects français).

---

## 1. Acheter un nom de domaine

Chez un registrar : **OVHcloud**, **Gandi**, **Infomaniak**, **Namecheap**, **Cloudflare**...
(~10-15 €/an). Exemple : `ma-mutuelle-dom.fr`.

## 2. Louer un VPS

Ton app est légère : un petit VPS suffit largement.

| Fournisseur (UE) | Offre d'entrée | Indicatif |
|---|---|---|
| **Hetzner** (Allemagne) | CX22 (2 vCPU, 4 Go) | ~4-5 €/mois |
| **Scaleway** (France) | DEV1-S | ~5-8 €/mois |
| **OVHcloud** (France) | VPS value | ~5-7 €/mois |
| **Infomaniak** (Suisse/UE) | VPS Lite | ~6 €/mois |

Choisis **Ubuntu 24.04 LTS** comme système. Note l'**adresse IP** du serveur et le mot de passe / la
clé SSH fournis.

## 3. Faire pointer le domaine vers le serveur

Dans l'interface DNS de ton registrar, crée 2 enregistrements **A** vers l'IP de ton VPS :

```
Type  Nom    Valeur (IP du VPS)
A     @      203.0.113.10
A     www    203.0.113.10
```

La propagation prend de quelques minutes à quelques heures.

## 4. Se connecter au serveur

Depuis ton PC (terminal / PowerShell) :

```bash
ssh root@203.0.113.10
```

(Optionnel mais conseillé) crée un utilisateur dédié `deploy` :

```bash
adduser deploy && usermod -aG sudo deploy
su - deploy
```

## 5. Installer Node.js et les outils

```bash
sudo apt update && sudo apt upgrade -y
# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git nginx
node --version   # doit afficher v22.x
```

## 6. Récupérer et configurer l'application

```bash
sudo mkdir -p /var/www/leads-mutuelle && sudo chown $USER:$USER /var/www/leads-mutuelle
git clone https://github.com/youssefecommerce2025-pixel/you.git /var/www/leads-mutuelle
cd /var/www/leads-mutuelle
git checkout cursor/leads-mutuelle-sante-optin   # ou main si tu as fusionne la PR
npm ci --omit=dev

# Configuration
cp .env.example .env
nano .env        # renseigne ADMIN_TOKEN, PUBLIC_BASE_URL, WHATSAPP_NUMBER, etc.
mkdir -p data
```

Teste rapidement : `node src/server.js` puis `Ctrl+C` (tu dois voir « Landing page : ... »).

## 7. Lancer l'app en service (démarrage auto + redémarrage)

```bash
sudo cp deploy/leads-mutuelle.service /etc/systemd/system/
sudo nano /etc/systemd/system/leads-mutuelle.service   # verifie User= et WorkingDirectory=
sudo systemctl daemon-reload
sudo systemctl enable --now leads-mutuelle
sudo systemctl status leads-mutuelle                    # doit etre "active (running)"
```

## 8. Mettre Nginx devant l'app

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/leads-mutuelle
sudo nano /etc/nginx/sites-available/leads-mutuelle     # remplace ton-domaine.fr
sudo ln -s /etc/nginx/sites-available/leads-mutuelle /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

À ce stade, `http://ton-domaine.fr` doit déjà afficher le site.

## 9. Activer le HTTPS (gratuit, Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ton-domaine.fr -d www.ton-domaine.fr
```

Certbot configure le HTTPS automatiquement et le renouvellement. Ton site est en
`https://ton-domaine.fr`. Pense à mettre `PUBLIC_BASE_URL=https://ton-domaine.fr` dans `.env` puis
`sudo systemctl restart leads-mutuelle`.

## 10. Pare-feu (recommandé)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Mettre à jour l'application plus tard

```bash
cd /var/www/leads-mutuelle
git pull
npm ci --omit=dev
sudo systemctl restart leads-mutuelle
```

## Sauvegarder la base de données (leads)

La base est un simple fichier : `/var/www/leads-mutuelle/data/leads.sqlite`.

```bash
# Sauvegarde ponctuelle
cp data/leads.sqlite ~/backup-leads-$(date +%F).sqlite
```

Mets en place une sauvegarde régulière (cron + copie hors serveur) pour ne jamais perdre tes leads.

## Voir les logs / diagnostiquer

```bash
sudo journalctl -u leads-mutuelle -f      # logs de l'application
sudo tail -f /var/log/nginx/error.log     # logs nginx
```

---

## Récapitulatif des URLs une fois en ligne

- Landing : `https://ton-domaine.fr/`
- Landings DOM par île : `https://ton-domaine.fr/lp/martinique-senior`, `/lp/reunion-famille`, ...
- CRM : `https://ton-domaine.fr/admin.html` (token = `ADMIN_TOKEN`)
- Confidentialité / mentions légales : `/confidentialite.html`, `/mentions-legales.html`

> Rappel : renseigne tes vraies mentions dans `src/consent.js` (raison sociale, ORIAS, DPO...) avant
> d'ouvrir au public. Ce guide ne constitue pas un conseil juridique.
