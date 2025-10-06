# Import des Entraînements depuis CSV

## Résumé

Les entraînements du fichier `Import_csv/calisthenie_app.workouts.csv` ont été importés avec succès dans la base de données Neon pour l'utilisateur `yanismorel` (ID: `cmgc4486y0001uq9wz13jzioc`).

## Détails de l'importation

- **Date d'import** : 6 octobre 2025
- **Fichier source** : `Import_csv/calisthenie_app.workouts.csv`
- **Script utilisé** : `scripts/import-workouts-from-csv.js`
- **Utilisateur cible** : yanismorel (cmgc4486y0001uq9wz13jzioc)
- **Filtre appliqué** : Uniquement les workouts avec `userId = "NaN"`
- **Nombre d'entraînements importés** : 24

## Résultats

### Vue d'ensemble
- ✅ **25 entraînements** au total pour l'utilisateur (24 importés + 1 existant)
- ✅ **278 sets** au total
- ✅ Tous les entraînements sont de type "Force"

### Répartition temporelle
- **Octobre 2025** : 1 entraînement
- **Août 2025** : 5 entraînements
- **Juillet 2025** : 1 entraînement
- **Avril 2025** : 11 entraînements
- **Mars 2025** : 7 entraînements

### Exercices les plus utilisés
1. **Pompes** : 59 sets
2. **Tractions** : 36 sets
3. **Muscle-up** : 33 sets
4. **Pike push-up** : 28 sets
5. **Pseudo pompes** : 26 sets

## Comment ça fonctionne

### Mapping des exercices
Le script a créé automatiquement une correspondance entre :
- Les **anciens IDs MongoDB** des exercices (dans le CSV)
- Les **nouveaux IDs Prisma** des exercices (dans la base de données)

Cette correspondance est basée sur les noms des exercices et garantit que chaque set pointe vers le bon exercice.

### Structure importée
Pour chaque entraînement, le script a importé :
- **Informations de base** : nom, date, type, durée
- **Métadonnées** : ressenti (1-5), calories brûlées
- **Sets** : Pour chaque set :
  - Exercice (mappé depuis l'ancien ID)
  - Répétitions ou durée
  - Poids (optionnel)
  - Temps de repos

## Réimporter les entraînements

⚠️ **Attention** : Le script créera de nouveaux entraînements à chaque exécution. Il ne met pas à jour les existants.

Pour réimporter (si nécessaire) :

```bash
node scripts/import-workouts-from-csv.js
```

### Modifier l'utilisateur cible

Pour importer les workouts pour un autre utilisateur, modifiez la constante dans le script :

```javascript
// Dans scripts/import-workouts-from-csv.js
const TARGET_USER_ID = 'votre-user-id-ici';
```

## Vérifier les données importées

Pour vérifier les entraînements importés :

```bash
node scripts/verify-workouts.js
```

Ce script affichera :
- Le nombre total d'entraînements
- La répartition par type et par mois
- Le nombre total de sets
- Les derniers entraînements
- Les exercices les plus utilisés

## Structure du CSV source

Le fichier CSV des workouts contient :

### Colonnes principales
- `nom` : Nom de l'entraînement
- `date` : Date au format ISO (2025-08-16T10:01)
- `type` : Type d'entraînement (Force, Endurance, etc.)
- `duree` : Durée en minutes
- `description` : Description optionnelle
- `userId` : ID de l'utilisateur original (filtré sur "NaN")
- `ressenti` : Niveau de difficulté ressenti (1-5)
- `caloriesBrulees` : Calories brûlées (optionnel)

### Colonnes des sets
Pour chaque set (jusqu'à 22 sets possibles) :
- `sets[N].exerciceId` : Ancien ID MongoDB de l'exercice
- `sets[N].repetitions` : Nombre de répétitions (ou 0 pour les holds)
- `sets[N].poids` : Poids utilisé (optionnel)
- `sets[N].tempsRepos` : Temps de repos en secondes
- `sets[N].duree` : Durée en secondes (pour les exercices de type "hold")

## Notes importantes

1. **IDs MongoDB vs Prisma** : Les anciens IDs MongoDB du CSV ne sont pas conservés. De nouveaux IDs Prisma sont générés.

2. **Workouts filtrés** : Seuls les workouts avec `userId = "NaN"` ont été importés. Les 3 workouts avec `userId = "demo-user-id"` ont été ignorés.

3. **Mapping automatique** : Le script gère automatiquement la correspondance entre les anciens et nouveaux IDs d'exercices.

4. **Validation** : Les workouts sans nom, date ou type, ou sans sets valides, sont automatiquement ignorés.

5. **Dates** : Les dates sont converties du format ISO string vers des objets Date PostgreSQL.

## En cas de problème

Si un exercice n'est pas trouvé lors de l'importation :
1. Vérifiez que les exercices de base ont bien été importés (`node scripts/verify-base-exercises.js`)
2. Vérifiez la correspondance des IDs dans la fonction `findExerciseIdByOldId()`
3. Ajoutez les mappings manquants si nécessaire

## Prochaines étapes

Les entraînements importés sont maintenant disponibles pour :
- ✅ Visualisation dans l'interface
- ✅ Analyse des progrès
- ✅ Statistiques et graphiques
- ✅ Calcul des records personnels

