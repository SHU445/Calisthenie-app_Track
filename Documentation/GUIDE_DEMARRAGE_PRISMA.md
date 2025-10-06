# 🚀 Guide de Démarrage Rapide - Migration vers Prisma

## ✅ Étapes complétées

Votre application a été migrée avec succès de MongoDB vers Prisma ! Voici ce qui a été fait :

1. ✅ Création du schéma Prisma (`prisma/schema.prisma`)
2. ✅ Mise à jour de toutes les routes API pour utiliser Prisma
3. ✅ Création du client Prisma (`src/lib/prisma.ts`)
4. ✅ Scripts de migration et de seed créés
5. ✅ Configuration de package.json avec les commandes Prisma

## 📝 Prochaines étapes

### 1. Configurer la base de données

Vous avez déjà ajouté `DATABASE_URL` dans `.env.local`. Assurez-vous que le fichier contient :

```env
# URL Prisma Accelerate (pour production et Deno Deploy)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=VOTRE_CLE_API"

# URL PostgreSQL directe (pour les migrations)
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**Comment obtenir ces URLs :**
- Créez un compte sur https://cloud.prisma.io/
- Configurez Prisma Accelerate avec votre base PostgreSQL
- Copiez l'URL Prisma Accelerate dans `DATABASE_URL`
- Copiez l'URL PostgreSQL directe dans `DIRECT_URL`

### 2. Générer le client Prisma et créer les tables

Exécutez ces commandes dans l'ordre :

```bash
# 1. Générer le client Prisma
npm run prisma:generate

# 2. Créer les tables dans la base de données
npm run prisma:push

# 3. Importer les exercices de base
npm run prisma:seed
```

### 3. (Optionnel) Migrer vos données MongoDB

Si vous avez des données existantes dans MongoDB que vous voulez migrer :

```bash
# Assurez-vous que MONGODB_URI est dans .env.local
npm run prisma:migrate
```

### 4. Tester l'application

```bash
# Démarrer l'application
npm run dev

# Ouvrir l'interface Prisma Studio (optionnel)
npm run prisma:studio
```

## 🎯 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run prisma:generate` | Génère le client Prisma |
| `npm run prisma:push` | Crée/met à jour les tables de la base de données |
| `npm run prisma:studio` | Ouvre l'interface visuelle Prisma Studio |
| `npm run prisma:seed` | Importe les exercices de base depuis JSON |
| `npm run prisma:migrate` | Migre les données depuis MongoDB |
| `npm run dev` | Démarre le serveur de développement |

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Vérifiez la connexion à la base de données :**
   ```bash
   npm run prisma:studio
   ```
   Une interface web devrait s'ouvrir sur http://localhost:5555

2. **Vérifiez que les exercices sont importés :**
   - Ouvrez Prisma Studio
   - Cliquez sur la table "Exercise"
   - Vous devriez voir les exercices de base

3. **Testez l'API :**
   - Démarrez l'application avec `npm run dev`
   - Testez l'inscription et la connexion
   - Créez un entraînement

## 📦 Structure de la base de données

Votre base de données Prisma contient maintenant :

- **User** : Utilisateurs de l'application
- **Exercise** : Exercices (de base + personnalisés)
- **Workout** : Entraînements
- **WorkoutSet** : Séries d'exercices dans un entraînement
- **PersonalRecord** : Records personnels

## 🚨 Problèmes courants

### Erreur : "Environment variable not found: DATABASE_URL"

**Solution :** Vérifiez que `.env.local` existe et contient `DATABASE_URL`.

### Erreur : "Can't reach database server"

**Solution :** Vérifiez que :
- Votre base de données PostgreSQL est accessible
- L'URL de connexion est correcte
- Le pare-feu autorise les connexions

### Erreur lors de la génération du client

**Solution :**
```bash
# Supprimez le dossier node_modules/.prisma
rm -rf node_modules/.prisma
# Regénérez
npm run prisma:generate
```

## 🌐 Déploiement sur Deno Deploy

Votre application est maintenant prête pour Deno Deploy ! Suivez les instructions dans `README_PRISMA.md`.

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Accelerate](https://www.prisma.io/accelerate)
- [Guide complet](./README_PRISMA.md)

## 🎉 Félicitations !

Votre application utilise maintenant Prisma DB ! 🚀

Pour toute question, consultez la documentation Prisma ou ouvrez une issue sur GitHub.

