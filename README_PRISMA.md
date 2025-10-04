# Migration vers Prisma DB

Ce guide vous aide à configurer et déployer votre application avec Prisma DB sur Deno Deploy.

## 📋 Prérequis

1. Un compte sur [Prisma Data Platform](https://cloud.prisma.io/)
2. Une base de données PostgreSQL (vous pouvez en obtenir une gratuite sur [Neon](https://neon.tech/) ou [Supabase](https://supabase.com/))

## 🚀 Configuration

### 1. Créer une base de données PostgreSQL

Créez une base de données PostgreSQL sur l'un de ces services :
- **Neon** : https://neon.tech/ (recommandé pour Deno Deploy)
- **Supabase** : https://supabase.com/
- **Railway** : https://railway.app/

Récupérez l'URL de connexion (format : `postgresql://user:password@host:5432/database`)

### 2. Configurer Prisma Accelerate

1. Allez sur https://cloud.prisma.io/
2. Créez un nouveau projet
3. Configurez Prisma Accelerate avec votre base de données
4. Récupérez votre `DATABASE_URL` avec Accelerate (format : `prisma+postgres://accelerate.prisma-data.net/?api_key=...`)

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# URL Prisma Accelerate (pour production)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# URL directe PostgreSQL (pour les migrations)
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Optionnel : MongoDB pour migration
# MONGODB_URI="mongodb://localhost:27017"
# MONGODB_DB_NAME="calisthenie_app"
```

### 4. Générer le client Prisma et créer le schéma

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma db push
```

### 5. Importer les exercices de base

```bash
node scripts/seed-exercises.js
```

### 6. (Optionnel) Migrer les données MongoDB existantes

Si vous avez des données dans MongoDB que vous voulez migrer :

```bash
node scripts/migrate-to-prisma.js
```

## 📦 Commandes utiles

```bash
# Générer le client Prisma
npx prisma generate

# Créer/mettre à jour le schéma de base de données
npx prisma db push

# Ouvrir Prisma Studio (interface visuelle)
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Voir le schéma actuel
npx prisma db pull

# Réinitialiser la base de données (ATTENTION: supprime toutes les données)
npx prisma db push --force-reset
```

## 🌐 Déploiement sur Deno Deploy

### 1. Préparer le projet

Votre application est maintenant prête pour Deno Deploy. Assurez-vous que :
- Le fichier `prisma/schema.prisma` existe
- Le client Prisma est généré
- Les variables d'environnement sont configurées

### 2. Configurer Deno Deploy

1. Allez sur https://dash.deno.com/
2. Créez un nouveau projet
3. Liez votre repository GitHub
4. Configurez les variables d'environnement :
   - `DATABASE_URL` : votre URL Prisma Accelerate
   - `DIRECT_URL` : votre URL PostgreSQL directe

### 3. Déployer

```bash
# Via GitHub (recommandé)
# Poussez votre code sur GitHub, Deno Deploy déploiera automatiquement

# Ou via Deno CLI
deno task deploy
```

## 🔧 Structure du projet

```
├── prisma/
│   └── schema.prisma          # Schéma Prisma
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Client Prisma
│   └── app/api/               # Routes API utilisant Prisma
├── scripts/
│   ├── seed-exercises.js      # Import exercices de base
│   └── migrate-to-prisma.js   # Migration depuis MongoDB
└── .env.local                 # Variables d'environnement
```

## 🆘 Dépannage

### Erreur "Client is not configured to run queries"

Assurez-vous que `DATABASE_URL` est correctement configuré dans `.env.local` et que vous avez exécuté `npx prisma generate`.

### Erreur de connexion à la base de données

Vérifiez que :
- Votre base de données PostgreSQL est accessible
- L'URL de connexion est correcte
- Le pare-feu autorise les connexions

### Performances lentes

Utilisez Prisma Accelerate pour de meilleures performances :
```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY"
```

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Accelerate](https://www.prisma.io/accelerate)
- [Deno Deploy Documentation](https://docs.deno.com/deploy/)
- [Neon Database](https://neon.tech/docs)

## 🎉 C'est fait !

Votre application utilise maintenant Prisma DB et est prête pour Deno Deploy ! 🚀

