# Configuration Vercel pour MongoDB Atlas

## Variables d'environnement à configurer

Lors du déploiement sur Vercel, vous devez configurer les variables d'environnement suivantes :

### Dans le dashboard Vercel :
1. Allez dans votre projet Vercel
2. Sélectionnez **Settings** > **Environment Variables**
3. Ajoutez ces variables :

| Variable | Valeur |
|----------|--------|
| `MONGODB_URI` | `mongodb+srv://yanismorel382008:EEMo4ypOoL55Abos@cluster0.v4lkvuy.mongodb.net/` |
| `MONGODB_DB_NAME` | `calisthenie_app` |
| `NODE_ENV` | `production` |

## Optimisations implémentées

### 1. Configuration MongoDB optimisée
- **Pool de connexions** : Limité à 10 connexions simultanées
- **Timeouts optimisés** : 5s pour la sélection du serveur, 45s pour les sockets
- **Retry automatique** : Activé pour les opérations d'écriture
- **Write Concern** : Configuré pour la majorité des nœuds

### 2. Configuration Vercel
- **Durée maximale des fonctions** : 10 secondes
- **Headers CORS** : Configurés pour les appels API
- **Cache désactivé** : Pour les données en temps réel

### 3. Fonctionnalités temps réel
- ✅ **GET/POST Workouts** : Lecture/écriture d'entraînements
- ✅ **GET/POST Exercises** : Gestion des exercices
- ✅ **Connexions optimisées** : Pour les fonctions serverless Vercel

## Commandes de déploiement

```bash
# Installer les dépendances
npm install

# Build de production
npm run build

# Déployer sur Vercel
vercel --prod
```

## Test de connexion

Une fois déployé, testez les endpoints :
- `GET /api/workouts` : Liste des entraînements
- `POST /api/workouts` : Créer un entraînement
- `GET /api/exercises` : Liste des exercices
- `POST /api/exercises` : Créer un exercice

## Surveillance

Les logs MongoDB Atlas et Vercel vous permettront de surveiller :
- ✅ Temps de réponse des requêtes
- ✅ Nombre de connexions actives
- ✅ Erreurs de connexion
- ✅ Performance des fonctions serverless
