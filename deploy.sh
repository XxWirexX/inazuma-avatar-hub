#!/bin/bash

# Script de déploiement rapide pour Inazuma Avatar Hub
# Usage: ./deploy.sh [dev|prod]

set -e

ENV=${1:-dev}

echo "🚀 Déploiement en mode: $ENV"

if [ "$ENV" = "dev" ]; then
    echo "📦 Lancement de l'environnement de développement..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up -d --build
    echo "✅ Dev lancé sur http://localhost:3000"
    echo "🗃️  Mongo Express disponible sur http://localhost:8081"
elif [ "$ENV" = "prod" ]; then
    echo "📦 Déploiement en production..."

    # Vérifier que .env.production existe
    if [ ! -f .env.production ]; then
        echo "❌ Erreur: .env.production n'existe pas"
        echo "Créez-le en vous basant sur .env.example"
        exit 1
    fi

    # Charger les variables d'environnement
    export $(cat .env.production | grep -v '^#' | xargs)

    # Build et démarrage
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d --build

    echo "✅ Production déployée"
    echo "🌐 Site accessible sur https://inazuma.wireredblue.xyz"

    # Afficher les logs
    echo ""
    echo "📊 Logs de l'application:"
    docker logs -f --tail=50 inazuma-app-prod
else
    echo "❌ Usage: ./deploy.sh [dev|prod]"
    exit 1
fi
