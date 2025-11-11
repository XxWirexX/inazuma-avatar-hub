# ⚡ Quick Start - Inazuma Avatar Hub

Guide rapide pour démarrer en 5 minutes.

---

## 🎯 Développement local (Option 1 : Docker - Recommandé)

### 1. Lancer avec Docker

```bash
cd inazuma-avatar-hub
docker-compose -f docker-compose.dev.yml up
```

**C'est tout ! Maintenant accède à :**
- 🌐 **App** : http://localhost:3000
- 🗃️ **Mongo Express** : http://localhost:8081

### 2. Arrêter

```bash
docker-compose -f docker-compose.dev.yml down
```

---

## 🎯 Développement local (Option 2 : Sans Docker)

### 1. Installer MongoDB

```bash
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=devpassword123 \
  mongo:7
```

### 2. Lancer Next.js

```bash
npm install
npm run dev
```

**Accès :** http://localhost:3000

---

## 🚀 Déploiement VPS (Production)

### Méthode rapide avec le script

```bash
./deploy.sh prod
```

### Ou manuellement

```bash
# 1. Créer .env.production (voir .env.example)
nano .env.production

# 2. Déployer
export $(cat .env.production | xargs)
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Vérifier
docker ps
docker logs -f inazuma-app-prod
```

**Guide complet :** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🛠️ Commandes utiles

```bash
# Dev
npm run dev                               # Lance Next.js en dev
docker-compose -f docker-compose.dev.yml up    # Lance tout avec Docker

# Build
npm run build                             # Build Next.js
npm start                                 # Lance le build en local

# Docker
./deploy.sh dev                           # Déploie en dev
./deploy.sh prod                          # Déploie en prod

# Logs
docker logs -f inazuma-app-prod          # Logs de l'app
docker logs -f inazuma-mongodb-prod      # Logs MongoDB
docker logs -f inazuma-nginx-prod        # Logs Nginx

# Cleanup
docker system prune -a                    # Nettoie Docker
```

---

## 📋 Checklist avant le premier lancement

**Dev :**
- [ ] Docker installé
- [ ] `docker-compose -f docker-compose.dev.yml up`
- [ ] Ouvrir http://localhost:3000

**Prod :**
- [ ] VPS Ubuntu/Debian
- [ ] Docker + Docker Compose installés
- [ ] Domaine configuré (DNS A record)
- [ ] `.env.production` créé et rempli
- [ ] Certificat SSL obtenu (Let's Encrypt)
- [ ] `./deploy.sh prod`

---

## ❓ Besoin d'aide ?

- 📖 **Documentation complète :** [README.md](./README.md)
- 🚀 **Guide de déploiement VPS :** [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 **Problème ?** Vérifie les logs avec `docker logs`

---

**Bon dev ! ⚡**
