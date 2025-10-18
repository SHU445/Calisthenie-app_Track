# Migration vers NextAuth.js

## Vue d'ensemble

Cette migration remplace le système d'authentification personnalisé par NextAuth.js pour ajouter la persistance de connexion et améliorer la sécurité.

## Changements apportés

### 1. Configuration NextAuth.js

- **Nouveau fichier**: `src/lib/auth.ts` - Configuration NextAuth.js avec provider Credentials
- **Nouveau fichier**: `src/app/api/auth/[...nextauth]/route.ts` - API route NextAuth.js
- **Nouveau fichier**: `src/types/next-auth.d.ts` - Types TypeScript étendus pour NextAuth.js
- **Nouveau fichier**: `src/components/NextAuthProvider.tsx` - Provider React pour NextAuth.js

### 2. Hook d'authentification

- **Nouveau fichier**: `src/hooks/useAuth.ts` - Hook personnalisé qui encapsule NextAuth.js
- **Supprimé**: `src/stores/authStore.ts` - Store Zustand remplacé par NextAuth.js

### 3. Sécurité améliorée

- **Hachage des mots de passe**: Utilisation de bcryptjs avec un salt de 12
- **Sessions JWT**: Sessions sécurisées avec JWT (30 jours de validité)
- **Adaptateur Prisma**: Intégration complète avec la base de données

### 4. Persistance de connexion

- **Sessions persistantes**: Les utilisateurs restent connectés après le rafraîchissement
- **Gestion automatique**: NextAuth.js gère automatiquement les tokens et sessions
- **Sécurité**: Tokens sécurisés avec rotation automatique

## Configuration requise

### Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Configuration NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-nextauth-ici-changez-cette-valeur"
```

### Génération du secret NextAuth

Pour générer un secret sécurisé :

```bash
openssl rand -base64 32
```

## Fonctionnalités

### Authentification

- **Connexion**: `/auth/login` - Page de connexion avec NextAuth.js
- **Inscription**: `/auth/register` - Page d'inscription avec hachage des mots de passe
- **Déconnexion**: Gestion automatique via NextAuth.js

### Persistance

- **Sessions JWT**: Stockées dans les cookies sécurisés
- **Durée**: 30 jours par défaut
- **Renouvellement**: Automatique lors de l'utilisation

### Sécurité

- **Mots de passe**: Hachés avec bcryptjs (salt 12)
- **Tokens**: JWT sécurisés avec rotation
- **Validation**: Validation côté serveur et client

## Migration des données

### Utilisateurs existants

Les utilisateurs existants doivent :
1. Se reconnecter avec leurs identifiants actuels
2. Leurs mots de passe seront automatiquement re-hachés lors de la prochaine connexion

### Base de données

Les tables NextAuth sont déjà présentes dans le schéma Prisma :
- `Account` - Comptes OAuth (si ajoutés plus tard)
- `Session` - Sessions utilisateur
- `VerificationToken` - Tokens de vérification

## Test de la migration

### Script de test

Exécutez le script de test pour vérifier la configuration :

```bash
node scripts/test-nextauth.js
```

### Test manuel

1. Démarrez le serveur : `npm run dev`
2. Allez sur `http://localhost:3000/auth/login`
3. Testez la connexion avec un compte existant
4. Rafraîchissez la page - vous devriez rester connecté
5. Fermez et rouvrez le navigateur - vous devriez rester connecté

## Avantages

### Pour les utilisateurs

- **Persistance**: Plus besoin de se reconnecter à chaque rafraîchissement
- **Sécurité**: Mots de passe hachés et sessions sécurisées
- **Performance**: Gestion optimisée des sessions

### Pour les développeurs

- **Maintenance**: Moins de code personnalisé à maintenir
- **Sécurité**: NextAuth.js gère les aspects sécuritaires
- **Extensibilité**: Facile d'ajouter des providers OAuth
- **Standards**: Suit les meilleures pratiques de sécurité

## Dépannage

### Erreurs communes

1. **"NEXTAUTH_SECRET is not defined"**
   - Vérifiez que la variable d'environnement est définie
   - Redémarrez le serveur après modification

2. **"Database connection failed"**
   - Vérifiez la configuration DATABASE_URL
   - Exécutez `npx prisma generate`

3. **"Invalid credentials"**
   - Vérifiez que l'utilisateur existe
   - Vérifiez le hachage des mots de passe

### Logs de débogage

Activez les logs NextAuth.js en ajoutant :

```env
NEXTAUTH_DEBUG=true
```

## Support

Pour toute question ou problème :
1. Vérifiez les logs du serveur
2. Consultez la documentation NextAuth.js
3. Testez avec le script de validation
