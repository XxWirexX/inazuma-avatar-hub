# ⚡ Inazuma Avatar Hub

**Plateforme communautaire de partage de Codes d'Avatar pour Inazuma Eleven: Victory Road**

> Partagez, découvrez et votez pour les meilleurs avatars de la communauté !

🌐 **Live:** [inazuma.wireredblue.xyz](https://inazuma.wireredblue.xyz)

---

## 🎯 Fonctionnalités

- ✅ **Partage d'avatars** : Upload ton screenshot + Code d'Avatar
- ✅ **Galerie communautaire** : Explore les créations de la communauté
- ✅ **Copie instantanée** : Copie le Code d'Avatar en un clic
- ✅ **Système de votes** : Like tes avatars préférés
- ✅ **Filtres avancés** : Recherche par style, rôle, tags
- ✅ **Authentification** : Google, Discord ou Email/Password
- ✅ **Responsive** : Fonctionne sur mobile, tablette et desktop

---

## 🚀 Stack Technique

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Auth:** NextAuth.js
- **Storage:** Cloudinary (images)
- **Deployment:** Docker + Docker Compose + Nginx
- **SSL:** Let's Encrypt (auto-renew)

---

## 🛠️ Installation locale

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- Compte Cloudinary (gratuit)

### 1. Cloner le projet

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/inazuma-avatar-hub.git
cd inazuma-avatar-hub
\`\`\`

### 2. Installer les dépendances

\`\`\`bash
npm install
\`\`\`

### 3. Configuration

Copier \`.env.example\` vers \`.env.local\` et remplir les variables :

\`\`\`bash
cp .env.example .env.local
\`\`\`

Éditer \`.env.local\` :
\`\`\`env
MONGODB_URI=mongodb://admin:devpassword123@localhost:27017/inazuma_avatars?authSource=admin
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### 4. Lancer avec Docker (recommandé)

\`\`\`bash
docker-compose -f docker-compose.dev.yml up
\`\`\`

**Accès :**
- 🌐 App : [http://localhost:3000](http://localhost:3000)
- 🗃️ Mongo Express : [http://localhost:8081](http://localhost:8081)

### 5. Ou lancer en mode dev classique

\`\`\`bash
# Démarrer MongoDB uniquement
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=devpassword123 mongo:7

# Lancer Next.js
npm run dev
\`\`\`

---

## 📦 Déploiement sur VPS

Consulter le guide complet : **[DEPLOYMENT.md](./DEPLOYMENT.md)**

**Résumé rapide :**

\`\`\`bash
# Sur le VPS
cd /var/www/inazuma-avatar-hub
docker compose -f docker-compose.prod.yml up -d --build
\`\`\`

---

## 📁 Structure du projet

\`\`\`
inazuma-avatar-hub/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── (auth)/            # Pages d'authentification
│   └── (main)/            # Pages principales
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   └── avatar/           # Composants spécifiques avatars
├── lib/                   # Utilitaires et config
│   ├── db/               # Connexion MongoDB
│   ├── cloudinary/       # Upload images
│   └── auth.ts           # Config NextAuth
├── types/                 # Types TypeScript
├── public/               # Assets statiques
├── Dockerfile            # Image Docker production
├── Dockerfile.dev        # Image Docker dev
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── nginx.conf            # Config Nginx
└── DEPLOYMENT.md         # Guide de déploiement
\`\`\`

---

## 🧪 Développement

### Commandes utiles

\`\`\`bash
# Dev avec hot reload
npm run dev

# Build production
npm run build

# Lancer la prod en local
npm run start

# Linter
npm run lint

# Docker dev
docker-compose -f docker-compose.dev.yml up

# Docker prod
docker-compose -f docker-compose.prod.yml up -d --build
\`\`\`

### Accès Mongo Express (dev)

Interface web MongoDB : [http://localhost:8081](http://localhost:8081)

---

## 🔒 Sécurité

- ✅ HTTPS obligatoire en production (Let's Encrypt)
- ✅ Rate limiting sur l'API (Nginx)
- ✅ Variables d'environnement sécurisées
- ✅ Validation des inputs (Zod)
- ✅ Protection CSRF (NextAuth)
- ✅ Headers de sécurité (Nginx)

---

**Créé avec ❤️ pour la communauté Inazuma Eleven**
