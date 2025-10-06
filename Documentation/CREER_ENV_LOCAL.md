# 📝 Comment créer le fichier .env.local

## 🎯 Objectif

Créer un fichier `.env.local` à la racine du projet avec votre URL Neon.

---

## 📍 Méthode 1 : Avec l'explorateur de fichiers Windows

### Étape 1 : Ouvrir le dossier du projet

Ouvrez l'explorateur Windows et naviguez vers :
```
C:\Users\Utilisateur\Documents\Yanis\Calisthenie-app_Track\
```

### Étape 2 : Créer un nouveau fichier texte

1. Faites un **clic droit** dans le dossier
2. Sélectionnez **"Nouveau"** → **"Document texte"**
3. Nommez-le : `env.local.txt`

### Étape 3 : Ouvrir le fichier

Double-cliquez sur `env.local.txt` pour l'ouvrir avec le Bloc-notes.

### Étape 4 : Ajouter le contenu

Copiez-collez ceci dans le fichier :

```
DATABASE_URL="VOTRE_URL_NEON_ICI"
```

**Remplacez `VOTRE_URL_NEON_ICI` par votre vraie URL Neon !**

Exemple :
```
DATABASE_URL="postgresql://myuser:mypass@ep-cool-shape-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Étape 5 : Enregistrer

1. Cliquez sur **"Fichier"** → **"Enregistrer sous"**
2. Dans "Nom du fichier", tapez : `.env.local` (avec le point au début)
3. Dans "Type", sélectionnez **"Tous les fichiers (*.*)"**
4. Cliquez sur **"Enregistrer"**

### Étape 6 : Supprimer l'ancien fichier

Supprimez le fichier `env.local.txt` (vous n'en avez plus besoin).

---

## 📍 Méthode 2 : Avec VS Code (plus simple)

### Étape 1 : Ouvrir VS Code

Ouvrez votre projet dans VS Code.

### Étape 2 : Créer un nouveau fichier

1. Cliquez sur **"Fichier"** → **"Nouveau fichier"**
2. Ou appuyez sur `Ctrl+N`

### Étape 3 : Ajouter le contenu

Collez ceci :

```
DATABASE_URL="VOTRE_URL_NEON_ICI"
```

**Remplacez par votre vraie URL Neon !**

### Étape 4 : Enregistrer

1. Appuyez sur `Ctrl+S` (ou "Fichier" → "Enregistrer")
2. Nommez le fichier : `.env.local`
3. Enregistrez-le **à la racine du projet** (à côté de `package.json`)

---

## 📍 Méthode 3 : Avec PowerShell (le plus rapide)

### Ouvrez PowerShell dans le dossier du projet

Puis exécutez cette commande :

```powershell
echo 'DATABASE_URL="VOTRE_URL_NEON_ICI"' > .env.local
```

**N'oubliez pas de remplacer `VOTRE_URL_NEON_ICI` par votre vraie URL !**

---

## ✅ Vérification

Après création, votre projet devrait ressembler à ça :

```
Calisthenie-app_Track/
├── .env.local          ← Nouveau fichier !
├── .gitignore
├── package.json
├── prisma/
│   └── schema.prisma
└── src/
```

---

## 🎯 Prochaine étape

Une fois le fichier `.env.local` créé, exécutez :

```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

