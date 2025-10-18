# Test de Persistance de Connexion NextAuth.js

## 🎯 Objectif
Vérifier que la persistance de connexion fonctionne correctement avec NextAuth.js, permettant aux utilisateurs de rester connectés même après un rafraîchissement de page ou une fermeture/réouverture du navigateur.

## 🔧 Configuration Actuelle

### Variables d'environnement requises
```env
NEXTAUTH_URL="https://calisthenie-tracker.vercel.app"
NEXTAUTH_SECRET="votre-secret-super-securise-ici"
DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Tables NextAuth créées
- ✅ `accounts` - Comptes OAuth
- ✅ `sessions` - Sessions utilisateur persistées
- ✅ `verification_tokens` - Tokens de vérification

### Configuration de session
- **Durée de vie** : 30 jours
- **Mise à jour** : Toutes les 24 heures
- **Stratégie** : JWT avec persistance en base de données
- **Sécurité** : Cookies sécurisés en production

## 🧪 Tests à Effectuer

### Test 1 : Connexion et Persistance Basique
1. **Démarrer l'application**
   ```bash
   npm run dev
   ```

2. **Accéder à la page de connexion**
   - URL : `http://localhost:3000/auth/login`

3. **Se connecter avec un compte de test**
   - Nom d'utilisateur : `test-nextauth`
   - Mot de passe : `TestPassword123!`

4. **Vérifier la redirection**
   - ✅ Doit être redirigé vers la page d'accueil
   - ✅ L'état de connexion doit être `true`

### Test 2 : Persistance après Rafraîchissement
1. **Rafraîchir la page (F5)**
   - ✅ L'utilisateur doit rester connecté
   - ✅ Aucune redirection vers la page de connexion

2. **Naviguer entre les pages**
   - Aller sur `/exercices`
   - Aller sur `/entrainements`
   - Aller sur `/progres`
   - ✅ L'utilisateur doit rester connecté sur toutes les pages

### Test 3 : Persistance après Fermeture du Navigateur
1. **Fermer complètement le navigateur**
2. **Rouvrir le navigateur**
3. **Aller sur l'application**
   - URL : `http://localhost:3000`
   - ✅ L'utilisateur doit être automatiquement connecté
   - ✅ Aucune redirection vers la page de connexion

### Test 4 : Persistance avec Onglets Multiples
1. **Ouvrir plusieurs onglets de l'application**
2. **Se connecter sur un onglet**
3. **Vérifier les autres onglets**
   - ✅ Tous les onglets doivent refléter l'état de connexion
   - ✅ Synchronisation automatique entre les onglets

### Test 5 : Déconnexion et Nettoyage
1. **Se déconnecter**
   - Cliquer sur le bouton de déconnexion
   - ✅ Redirection vers la page de connexion
   - ✅ État de connexion doit être `false`

2. **Vérifier la persistance après déconnexion**
   - Rafraîchir la page
   - ✅ L'utilisateur doit rester déconnecté
   - ✅ Redirection vers la page de connexion

## 🔍 Vérifications Techniques

### Dans les Outils de Développement
1. **Onglet Application > Cookies**
   - Vérifier la présence du cookie `next-auth.session-token`
   - Vérifier la durée d'expiration (30 jours)

2. **Onglet Network**
   - Vérifier les appels à `/api/auth/session`
   - Vérifier les appels à `/api/auth/csrf`

3. **Console du navigateur**
   - Aucune erreur liée à NextAuth
   - Messages de synchronisation de session

### Dans la Base de Données
1. **Vérifier la table sessions**
   ```sql
   SELECT * FROM sessions WHERE "userId" = 'ID_UTILISATEUR';
   ```

2. **Vérifier la création de sessions**
   - Une nouvelle session doit être créée à chaque connexion
   - L'ancienne session doit être supprimée

## 🐛 Dépannage

### Problème : L'utilisateur est déconnecté après rafraîchissement
**Solutions :**
1. Vérifier que `NEXTAUTH_URL` est correctement configuré
2. Vérifier que `NEXTAUTH_SECRET` est défini
3. Vérifier que les tables NextAuth existent dans la base de données
4. Vérifier les cookies dans les outils de développement

### Problème : Erreur "Invalid session"
**Solutions :**
1. Vérifier la configuration des cookies
2. Vérifier que la base de données est accessible
3. Redémarrer l'application
4. Nettoyer les cookies du navigateur

### Problème : Session non persistée entre onglets
**Solutions :**
1. Vérifier que `SessionProvider` entoure toute l'application
2. Vérifier la synchronisation du store Zustand
3. Vérifier les événements de session NextAuth

## 📊 Résultats Attendus

### ✅ Succès
- L'utilisateur reste connecté après rafraîchissement
- L'utilisateur reste connecté après fermeture/réouverture du navigateur
- La session persiste pendant 30 jours
- La synchronisation fonctionne entre les onglets
- La déconnexion fonctionne correctement

### ❌ Échec
- L'utilisateur est déconnecté après rafraîchissement
- L'utilisateur est déconnecté après fermeture du navigateur
- Erreurs dans la console du navigateur
- Sessions non créées dans la base de données

## 🚀 Déploiement

### Variables d'environnement en production
```env
NEXTAUTH_URL="https://calisthenie-tracker.vercel.app"
NEXTAUTH_SECRET="secret-super-securise-production"
DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Vérifications post-déploiement
1. Tester la connexion sur l'URL de production
2. Vérifier la persistance de session
3. Vérifier les cookies sécurisés (HTTPS)
4. Tester la déconnexion

## 📝 Notes Importantes

- **Sécurité** : Les cookies sont automatiquement sécurisés en production
- **Performance** : Les sessions sont mises en cache côté client
- **Scalabilité** : NextAuth gère automatiquement la synchronisation des sessions
- **Maintenance** : Les sessions expirées sont automatiquement nettoyées

---

**Date de création** : $(date)
**Version** : 1.0.0
**Statut** : ✅ Prêt pour les tests
