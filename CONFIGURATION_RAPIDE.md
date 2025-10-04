# ⚡ Configuration Rapide pour Deno Deploy

## 🎯 PHASE 1 : Faire fonctionner localement (À FAIRE MAINTENANT)

### Étape 1 : Configurer .env.local

Copiez votre URL de connexion Neon et créez/modifiez `.env.local` :

```env
DATABASE_URL="postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require"
```

**⚠️ IMPORTANT : Remplacez par VOTRE URL Neon complète !**

Pour trouver votre URL Neon :
1. Allez sur https://console.neon.tech/
2. Sélectionnez votre projet
3. Cliquez sur "Connection Details"
4. Copiez la "Connection string" complète

### Étape 2 : Générer le client Prisma et créer les tables

Dans le terminal, exécutez ces 3 commandes :

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### Étape 3 : Démarrer l'application

```bash
npm run dev
```

### Étape 4 : Tester

1. Allez sur http://localhost:3000
2. Créez un compte
3. Connectez-vous
4. Vérifiez que les exercices s'affichent

✅ **Si tout fonctionne, passez à la PHASE 2**

---

## 🚀 PHASE 2 : Configuration pour Deno Deploy

### Étape 1 : Configurer Prisma Accelerate

1. **Créez un compte sur Prisma Cloud :**
   - Allez sur https://cloud.prisma.io/
   - Cliquez sur "Sign up" (ou "Log in")

2. **Créez un projet Accelerate :**
   - Cliquez sur "New Project"
   - Donnez un nom à votre projet
   - Sélectionnez "Accelerate"

3. **Configurez la connexion :**
   - Collez votre URL Neon (celle de votre .env.local)
   - Cliquez sur "Create"

4. **Copiez l'URL Accelerate générée :**
   - Elle ressemble à : `prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGci...`

### Étape 2 : Mettre à jour .env.local

Modifiez votre `.env.local` pour avoir les DEUX URLs :

```env
# URL Accelerate (pour Deno Deploy et production)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=VOTRE_CLE_API"

# URL directe Neon (pour les migrations)
DIRECT_URL="postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require"
```

### Étape 3 : Mettre à jour le schéma Prisma

Modifiez `prisma/schema.prisma` pour réactiver `directUrl` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Étape 4 : Regénérer le client

```bash
npx prisma generate
```

### Étape 5 : Tester localement avec Accelerate

```bash
npm run dev
```

Testez à nouveau que tout fonctionne.

---

## 🌐 PHASE 3 : Déploiement sur Deno Deploy

### Étape 1 : Pousser sur GitHub

```bash
git add .
git commit -m "Configuration Prisma pour Deno Deploy"
git push origin main
```

### Étape 2 : Créer un projet Deno Deploy

1. Allez sur https://dash.deno.com/
2. Cliquez sur "New Project"
3. Connectez votre compte GitHub
4. Sélectionnez votre repository
5. Laissez les paramètres par défaut

### Étape 3 : Configurer les variables d'environnement

Dans Deno Deploy, ajoutez ces variables :

```
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=VOTRE_CLE
DIRECT_URL = postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require
```

### Étape 4 : Déployer

Deno Deploy déploiera automatiquement à chaque push sur `main`.

---

## ✅ Checklist complète

### Phase 1 (Local - à faire maintenant) :
- [ ] `.env.local` créé avec DATABASE_URL (Neon direct)
- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` exécuté
- [ ] `npm run prisma:seed` exécuté
- [ ] Application démarre sans erreur
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Exercices s'affichent

### Phase 2 (Accelerate) :
- [ ] Compte Prisma Cloud créé
- [ ] Projet Accelerate configuré
- [ ] URL Accelerate copiée
- [ ] `.env.local` mis à jour avec DATABASE_URL (Accelerate) et DIRECT_URL (Neon)
- [ ] `prisma/schema.prisma` mis à jour avec directUrl
- [ ] `npx prisma generate` exécuté
- [ ] Application testée localement avec Accelerate

### Phase 3 (Deno Deploy) :
- [ ] Code poussé sur GitHub
- [ ] Projet Deno Deploy créé
- [ ] Variables d'environnement configurées
- [ ] Application déployée et fonctionnelle

---

## 🆘 En cas de problème

### Erreur "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Erreur de connexion à la base de données
- Vérifiez que l'URL Neon est correcte
- Vérifiez qu'elle contient `?sslmode=require`

### Tables non créées
```bash
npx prisma db push --force-reset
npm run prisma:seed
```

---

## ⏱️ Temps estimé

- **Phase 1 (Local)** : 10-15 minutes
- **Phase 2 (Accelerate)** : 10 minutes
- **Phase 3 (Deno Deploy)** : 5-10 minutes

**Total : ~30 minutes pour être en production ! 🚀**

