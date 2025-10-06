# Import des Exercices depuis CSV

## Résumé

Les exercices du fichier `Import_csv/calisthenie_app.exercises.csv` ont été importés avec succès dans la base de données Neon.

## Détails de l'importation

- **Date d'import** : 6 octobre 2025
- **Fichier source** : `Import_csv/calisthenie_app.exercises.csv`
- **Script utilisé** : `scripts/import-exercises-from-csv.js`
- **Nombre d'exercices importés** : 40

## Caractéristiques

### Accessibilité
- ✅ Tous les exercices importés sont **accessibles à tous les utilisateurs**
- ✅ Les exercices ont été créés avec `userId = null`, ce qui les marque comme exercices de base
- ✅ Chaque utilisateur verra ces exercices dans sa bibliothèque, en plus de ses exercices personnalisés

### Structure des exercices importés
- Nom de l'exercice
- Catégorie (Haut du corps, Core/Abdos, etc.)
- Difficulté (F, D, C, B, A, S, SS)
- Muscles ciblés (tableau)
- Description
- Instructions (tableau)
- Type de quantification (rep ou hold)

### Répartition par difficulté
- **F (Fondation)** : 2 exercices (Pompes, Rowing inversé)
- **D (Débutant)** : 4 exercices (Tractions, Dips, Elbow lever, L-sit, etc.)
- **C (Confirmé)** : 6 exercices (Pike push-up, Tuck front lever, Handstand, etc.)
- **B (Bronze)** : 9 exercices (Tuck planche, Muscle-up, Handstand push-up, etc.)
- **A (Argent)** : 7 exercices (Straddle planche, Front lever, One-arm pull-up, etc.)
- **S (Or)** : 2 exercices (Full planche, Touch front lever)
- **SS (Platine)** : 4 exercices (Dragon planche, Maltese, Full planche push-up, Croix de Fer)

## Comment ça fonctionne dans l'application

### API
L'API `/api/exercises` récupère automatiquement :
- Les exercices de base (`userId = null`)
- Les exercices personnalisés de l'utilisateur connecté (`userId = userId`)

### Frontend
Le store `exerciseStore` charge les exercices via `fetchExercises(userId)` :
- Si `userId` est fourni → exercices de base + exercices personnalisés
- Si `userId` est vide → exercices de base uniquement

### Utilisateurs
Chaque utilisateur peut :
- ✅ Voir et utiliser tous les 40 exercices de base
- ✅ Créer ses propres exercices personnalisés
- ✅ Modifier et supprimer uniquement ses exercices personnalisés
- ❌ Ne peut PAS modifier ou supprimer les exercices de base

## Réimporter les exercices

Pour réimporter les exercices (par exemple après une mise à jour du CSV) :

```bash
node scripts/import-exercises-from-csv.js
```

Le script :
- Créera les nouveaux exercices
- Mettra à jour les exercices existants (basé sur le nom)
- Ignorera les lignes incomplètes

## Structure du CSV

Le fichier CSV doit avoir ces colonnes :
- `nom` : Nom de l'exercice
- `categorie` : Catégorie de l'exercice
- `difficulte` : Niveau de difficulté
- `description` : Description de l'exercice
- `muscles[0]`, `muscles[1]`, etc. : Muscles ciblés
- `instructions[0]`, `instructions[1]`, etc. : Instructions étape par étape
- `typeQuantification` : "rep" ou "hold"

Les colonnes `_id`, `id` et `userId` du CSV sont ignorées car la base de données génère ses propres identifiants.

