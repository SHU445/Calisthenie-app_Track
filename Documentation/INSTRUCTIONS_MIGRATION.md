# 🎯 Instructions de Migration vers Prisma

## ⚠️ IMPORTANT : À faire maintenant

### 1️⃣ Vérifier votre fichier `.env.local`

Assurez-vous que votre fichier `.env.local` contient les deux URLs suivantes :

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=VOTRE_CLE_API"
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**Si vous n'avez pas encore ces URLs :**

1. **Créer une base de données PostgreSQL gratuite** sur [Neon](https://neon.tech/) :
   - Inscrivez-vous sur https://neon.tech/
   - Créez un nouveau projet
   - Copiez l'URL de connexion PostgreSQL → `DIRECT_URL`

2. **Configurer Prisma Accelerate** sur https://cloud.prisma.io/ :
   - Inscrivez-vous sur Prisma Cloud
   - Créez un nouveau projet Accelerate
   - Collez votre URL PostgreSQL de Neon
   - Copiez l'URL Accelerate générée → `DATABASE_URL`

### 2️⃣ Exécuter le script de configuration

**Sur Windows (double-cliquez ou dans PowerShell) :**
```cmd
setup-prisma.bat
```

**Ou manuellement dans le terminal :**
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 3️⃣ (Optionnel) Migrer vos données MongoDB

Si vous avez des données existantes dans MongoDB :

1. Ajoutez dans `.env.local` :
   ```env
   MONGODB_URI="votre_url_mongodb"
   MONGODB_DB_NAME="calisthenie_app"
   ```

2. Exécutez :
   ```bash
   npm run prisma:migrate
   ```

### 4️⃣ Démarrer l'application

```bash
npm run dev
```

Votre application devrait maintenant fonctionner avec Prisma ! 🎉

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Ouvrir Prisma Studio** (interface visuelle de la base de données) :
   ```bash
   npm run prisma:studio
   ```
   Cela ouvrira http://localhost:5555

2. **Tester l'application** :
   - Créez un compte utilisateur
   - Consultez les exercices de base
   - Créez un entraînement

## 📝 Ce qui a changé

### ✅ Fichiers créés/modifiés :

1. **Schéma Prisma** : `prisma/schema.prisma`
   - Définit tous les modèles de données (User, Exercise, Workout, etc.)

2. **Client Prisma** : `src/lib/prisma.ts`
   - Remplace l'ancien `mongodb.ts`

3. **Routes API** : Tous les fichiers dans `src/app/api/`
   - `auth/login/route.ts`
   - `auth/register/route.ts`
   - `exercises/route.ts`
   - `exercises/[id]/route.ts`
   - `workouts/route.ts`
   - `workouts/[id]/route.ts`

4. **Scripts utiles** :
   - `scripts/seed-exercises.js` - Importer les exercices de base
   - `scripts/migrate-to-prisma.js` - Migration depuis MongoDB
   - `setup-prisma.bat` - Script de configuration Windows

5. **Documentation** :
   - `GUIDE_DEMARRAGE_PRISMA.md` - Guide complet
   - `README_PRISMA.md` - Documentation détaillée
   - `INSTRUCTIONS_MIGRATION.md` - Ce fichier

## 🚀 Avantages de Prisma

- ✅ **Meilleure performance** avec Prisma Accelerate
- ✅ **Type-safety** : TypeScript complet avec auto-complétion
- ✅ **Compatible Deno Deploy** : Déploiement facile
- ✅ **Migrations versionnées** : Contrôle des changements de schéma
- ✅ **Prisma Studio** : Interface visuelle pour la base de données
- ✅ **Requêtes optimisées** : Relations et joins automatiques

## 🆘 Besoin d'aide ?

### Erreur "Environment variable not found: DATABASE_URL"
➡️ Vérifiez que `.env.local` existe à la racine du projet avec `DATABASE_URL`

### Erreur "Can't reach database server"
➡️ Vérifiez que votre base PostgreSQL est accessible et que l'URL est correcte

### Erreur lors de l'import des exercices
➡️ Assurez-vous d'avoir exécuté `npm run prisma:push` avant `npm run prisma:seed`

### L'application ne démarre pas
➡️ Exécutez `npm run prisma:generate` puis redémarrez

## 📚 Commandes utiles

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer/mettre à jour les tables
npm run prisma:push

# Ouvrir Prisma Studio
npm run prisma:studio

# Importer les exercices
npm run prisma:seed

# Migrer depuis MongoDB
npm run prisma:migrate

# Démarrer l'app
npm run dev
```

## 🎉 Prochaines étapes

Une fois que tout fonctionne localement :

1. **Testez l'application** complètement
2. **Poussez sur GitHub** : `git push origin main`
3. **Déployez sur Deno Deploy** (voir `README_PRISMA.md`)

Bonne chance ! 🚀

