# 🚀 Guide de Déploiement VPS - Inazuma Avatar Hub

Guide complet pour déployer **inazuma.wireredblue.xyz** de A à Z sur un VPS.

---

## 📋 Prérequis

- ✅ VPS Ubuntu 22.04 / Debian 12 (ou similaire)
- ✅ Accès SSH root ou sudo
- ✅ Domaine `wireredblue.xyz` pointant vers l'IP du VPS
- ✅ Compte Cloudinary (gratuit : [cloudinary.com](https://cloudinary.com))

---

## 🔧 ÉTAPE 1 : Configuration initiale du VPS

### 1.1 Connexion SSH

```bash
ssh root@YOUR_VPS_IP
```

### 1.2 Mise à jour du système

```bash
apt update && apt upgrade -y
```

### 1.3 Installation de Docker et Docker Compose

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Démarrer Docker
systemctl enable docker
systemctl start docker

# Vérifier l'installation
docker --version
docker compose version
```

### 1.4 Installation de Git

```bash
apt install git -y
```

---

## 🌐 ÉTAPE 2 : Configuration du domaine

### 2.1 Ajouter un sous-domaine dans votre registrar DNS

**Créer un enregistrement A :**
```
Type: A
Nom: inazuma
Valeur: YOUR_VPS_IP
TTL: 300 (ou Auto)
```

**Créer un enregistrement A pour www (optionnel) :**
```
Type: A
Nom: www.inazuma
Valeur: YOUR_VPS_IP
TTL: 300
```

### 2.2 Vérifier la propagation DNS (attendre 5-10 minutes)

```bash
ping inazuma.wireredblue.xyz
```

Si ça répond avec votre IP, c'est bon ✅

---

## 📦 ÉTAPE 3 : Cloner le projet sur le VPS

### 3.1 Créer un dossier pour l'app

```bash
mkdir -p /var/www
cd /var/www
```

### 3.2 Cloner le repo (ou transférer les fichiers)

**Option A : Via Git (si repo GitHub/GitLab)**
```bash
git clone https://github.com/YOUR_USERNAME/inazuma-avatar-hub.git
cd inazuma-avatar-hub
```

**Option B : Via SCP depuis votre PC**
```bash
# Sur VOTRE PC (pas sur le VPS)
cd P:\KizunaHub\inazuma-avatar-hub
scp -r . root@YOUR_VPS_IP:/var/www/inazuma-avatar-hub/
```

Ensuite sur le VPS :
```bash
cd /var/www/inazuma-avatar-hub
```

---

## 🔐 ÉTAPE 4 : Configuration des variables d'environnement

### 4.1 Créer le fichier `.env.production`

```bash
nano .env.production
```

### 4.2 Remplir avec ces valeurs (à personnaliser) :

```env
# ==================================
# ENVIRONNEMENT
# ==================================
NODE_ENV=production

# ==================================
# MONGODB
# ==================================
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=VOTRE_MOT_DE_PASSE_SUPER_SECURE_123

# ==================================
# NEXTAUTH
# ==================================
NEXTAUTH_URL=https://inazuma.wireredblue.xyz
NEXTAUTH_SECRET=VOTRE_SECRET_GENERE_ICI

# ==================================
# CLOUDINARY
# ==================================
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

### 4.3 Générer un secret NextAuth

```bash
openssl rand -base64 32
```

Copie le résultat et colle-le dans `NEXTAUTH_SECRET`

### 4.4 Récupérer les credentials Cloudinary

1. Aller sur [cloudinary.com](https://cloudinary.com) et se connecter
2. Dashboard → Product Environment Credentials
3. Copier `Cloud Name`, `API Key`, `API Secret`

**💾 Sauvegarder le fichier : `Ctrl + O`, `Enter`, puis `Ctrl + X`**

---

## 🔒 ÉTAPE 5 : Obtenir un certificat SSL (Let's Encrypt)

### 5.1 Installer Certbot

```bash
apt install certbot -y
```

### 5.2 Créer le dossier SSL

```bash
mkdir -p /var/www/inazuma-avatar-hub/ssl
```

### 5.3 Obtenir le certificat

```bash
certbot certonly --standalone -d inazuma.wireredblue.xyz -d www.inazuma.wireredblue.xyz
```

**Suivre les instructions :**
- Entrer votre email
- Accepter les conditions (Y)
- Le certificat sera généré dans `/etc/letsencrypt/live/inazuma.wireredblue.xyz/`

### 5.4 Copier les certificats dans le projet

```bash
cp /etc/letsencrypt/live/inazuma.wireredblue.xyz/fullchain.pem /var/www/inazuma-avatar-hub/ssl/
cp /etc/letsencrypt/live/inazuma.wireredblue.xyz/privkey.pem /var/www/inazuma-avatar-hub/ssl/
```

### 5.5 Automatiser le renouvellement (certificat valable 90 jours)

```bash
crontab -e
```

Ajouter cette ligne à la fin :
```
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/inazuma.wireredblue.xyz/*.pem /var/www/inazuma-avatar-hub/ssl/ && docker restart inazuma-nginx-prod
```

**Sauvegarder : `Ctrl + O`, `Enter`, `Ctrl + X`**

---

## 🐳 ÉTAPE 6 : Lancer l'application avec Docker

### 6.1 Charger les variables d'environnement

```bash
export $(cat .env.production | xargs)
```

### 6.2 Build et démarrer les conteneurs

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**Explication des services :**
- `mongodb` : Base de données MongoDB
- `app` : Application Next.js
- `nginx` : Reverse proxy + SSL

### 6.3 Vérifier que tout tourne

```bash
docker ps
```

Tu devrais voir 3 conteneurs qui tournent ✅ :
```
inazuma-mongodb-prod
inazuma-app-prod
inazuma-nginx-prod
```

### 6.4 Voir les logs (si besoin)

```bash
# Logs de l'app Next.js
docker logs -f inazuma-app-prod

# Logs de MongoDB
docker logs -f inazuma-mongodb-prod

# Logs de Nginx
docker logs -f inazuma-nginx-prod
```

---

## ✅ ÉTAPE 7 : Tester l'application

### 7.1 Ouvrir dans le navigateur

```
https://inazuma.wireredblue.xyz
```

✅ **Si tu vois la page d'accueil Next.js = C'est déployé !**

### 7.2 Vérifier le SSL

- Le cadenas 🔒 doit être vert dans la barre d'adresse
- Certificat valide pour 90 jours

---

## 🔄 ÉTAPE 8 : Workflow de développement

### Mode développement (sur ton PC)

```bash
# Lancer en local avec Docker
docker-compose -f docker-compose.dev.yml up

# Accès :
# - App : http://localhost:3000
# - Mongo Express : http://localhost:8081
```

### Déployer une mise à jour sur le VPS

**Sur ton PC :**
```bash
# Commit tes changements
git add .
git commit -m "Update: nouvelle fonctionnalité"
git push
```

**Sur le VPS :**
```bash
cd /var/www/inazuma-avatar-hub

# Pull les changements
git pull

# Rebuild et redémarrer
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Vérifier
docker ps
docker logs -f inazuma-app-prod
```

**Ou en une ligne :**
```bash
cd /var/www/inazuma-avatar-hub && git pull && docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🛠️ Commandes utiles

### Redémarrer l'application

```bash
cd /var/www/inazuma-avatar-hub
docker compose -f docker-compose.prod.yml restart
```

### Arrêter l'application

```bash
docker compose -f docker-compose.prod.yml down
```

### Voir l'utilisation des ressources

```bash
docker stats
```

### Nettoyer les anciennes images Docker

```bash
docker system prune -a
```

### Backup de la base de données

```bash
docker exec inazuma-mongodb-prod mongodump --out /dump
docker cp inazuma-mongodb-prod:/dump ./backup-$(date +%Y%m%d)
```

### Restaurer un backup

```bash
docker cp ./backup-20241111 inazuma-mongodb-prod:/dump
docker exec inazuma-mongodb-prod mongorestore /dump
```

---

## 🔥 Firewall (Sécurité)

### Configurer UFW (Ubuntu Firewall)

```bash
# Installer UFW
apt install ufw -y

# Autoriser SSH (IMPORTANT sinon tu te coupes l'accès)
ufw allow 22

# Autoriser HTTP et HTTPS
ufw allow 80
ufw allow 443

# Activer le firewall
ufw enable

# Vérifier
ufw status
```

---

## 📊 Monitoring (optionnel)

### Installer Portainer (interface Docker)

```bash
docker volume create portainer_data
docker run -d -p 9000:9000 --name portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

**Accès : `http://YOUR_VPS_IP:9000`**

---

## 🆘 Dépannage

### L'app ne démarre pas

```bash
# Vérifier les logs
docker logs inazuma-app-prod

# Problèmes courants :
# - Variables d'environnement mal configurées
# - MongoDB pas démarré
```

### Erreur de connexion MongoDB

```bash
# Vérifier que MongoDB tourne
docker ps | grep mongo

# Redémarrer MongoDB
docker restart inazuma-mongodb-prod
```

### Certificat SSL expiré

```bash
# Renouveler manuellement
certbot renew
cp /etc/letsencrypt/live/inazuma.wireredblue.xyz/*.pem /var/www/inazuma-avatar-hub/ssl/
docker restart inazuma-nginx-prod
```

### Le site affiche "502 Bad Gateway"

```bash
# L'app Next.js ne répond pas
docker restart inazuma-app-prod
docker logs -f inazuma-app-prod
```

---

## 📝 Checklist finale

- [ ] VPS configuré et à jour
- [ ] Docker et Docker Compose installés
- [ ] DNS configuré (sous-domaine `inazuma`)
- [ ] Projet cloné sur le VPS
- [ ] `.env.production` créé et rempli
- [ ] Certificat SSL obtenu (Let's Encrypt)
- [ ] Conteneurs Docker démarrés
- [ ] Site accessible en HTTPS
- [ ] Firewall configuré
- [ ] Renouvellement SSL automatisé (cron)

---

## 🎉 C'est terminé !

Ton site est maintenant en production sur **https://inazuma.wireredblue.xyz** 🚀

Pour toute question ou problème, check les logs :
```bash
docker logs -f inazuma-app-prod
```

**Bon dev ! ⚡**
