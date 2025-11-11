// Script d'initialisation MongoDB pour la production
db = db.getSiblingDB('inazuma_avatars');

// Créer les collections
db.createCollection('users');
db.createCollection('avatars');
db.createCollection('sessions');

// Index pour les utilisateurs
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Index pour les avatars
db.avatars.createIndex({ userId: 1 });
db.avatars.createIndex({ createdAt: -1 });
db.avatars.createIndex({ votes: -1 });
db.avatars.createIndex({ code: 1 }, { unique: true });

// Index pour les sessions NextAuth
db.sessions.createIndex({ sessionToken: 1 }, { unique: true });
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

print('MongoDB initialized successfully for Inazuma Avatar Hub');
