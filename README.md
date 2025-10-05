# 🏋️ Callisthénie Tracker

Une application web moderne de suivi d'entraînements de callisthénie avec un thème sportif élégant.

## 🌟 Fonctionnalités

### 🔐 Authentification
- **Multi-utilisateurs** avec inscription et connexion
- **Stockage sécurisé** des données utilisateur
- **Validation complète** des formulaires
- **Compte de démonstration** disponible

### 📚 Base d'exercices
- **Plus de 20 exercices** de callisthénie détaillés
- **Instructions étape par étape** pour chaque exercice
- **Catégorisation** par groupe musculaire
- **Niveaux de difficulté** : Débutant, Intermédiaire, Avancé, Expert
- **Recherche et filtrage** avancés

### 🏃 Suivi d'entraînements
- **Enregistrement de séances** complètes
- **Gestion des séries et répétitions**
- **Différents types d'entraînement** (Force, Endurance, HIIT, etc.)
- **Historique détaillé** de vos sessions

### 📊 Analyse des progrès
- **Records personnels** automatiquement suivis
- **Graphiques de progression** interactifs
- **Statistiques détaillées** sur vos performances
- **Visualisation des tendances** à long terme

## 🎨 Design et UX

- **Thème sportif moderne** avec palette de couleurs énergique
- **Interface responsive** optimisée mobile et desktop
- **Animations fluides** et interactions intuitives
- **Typographie sport** avec polices Roboto et Oswald
- **Composants modulaires** avec Tailwind CSS

## 🛠️ Technologies utilisées

- **Framework** : Next.js 15 avec TypeScript
- **Styling** : Tailwind CSS avec thème personnalisé
- **État global** : Zustand pour la gestion d'état
- **Icônes** : Heroicons
- **Graphiques** : Chart.js et react-chartjs-2
- **Stockage** : localStorage pour la persistance des données
- **API** : Next.js API Routes pour les exercices

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd calisthenie-app-tracker
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application en développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

### Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre l'application en mode production
- `npm run lint` - Lance l'analyse du code avec ESLint

## 🎯 Structure de l'application

### Pages principales

- **/** - Page d'accueil avec présentation des fonctionnalités
- **/auth/login** - Connexion utilisateur
- **/auth/register** - Inscription nouveau compte
- **/exercices** - Base de données d'exercices
- **/entrainements** - Gestion des séances d'entraînement
- **/progres** - Suivi des progrès et statistiques

### Architecture technique

```
src/
├── app/                 # Pages Next.js App Router
│   ├── api/            # API Routes
│   ├── auth/           # Pages d'authentification
│   ├── exercices/      # Page des exercices
│   ├── entrainements/  # Page des entraînements
│   ├── progres/        # Page des progrès
│   ├── globals.css     # Styles globaux
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Page d'accueil
├── components/         # Composants réutilisables
├── data/              # Données JSON (exercices)
├── lib/               # Utilitaires et helpers
├── stores/            # Stores Zustand
└── types/             # Types TypeScript
```

## 🏃‍♂️ Guide d'utilisation

### Première utilisation

1. **Créer un compte** sur `/auth/register`
2. **Explorer les exercices** pour découvrir la base de données
3. **Commencer un entraînement** en sélectionnant des exercices
4. **Suivre vos progrès** avec les graphiques et statistiques

### Compte de démonstration

Pour tester rapidement l'application :
- **Nom d'utilisateur** : `demo`
- **Mot de passe** : `demo123`

### Fonctionnalités avancées

- **Filtrage d'exercices** par catégorie et difficulté
- **Création d'entraînements personnalisés**
- **Suivi automatique des records personnels**
- **Analyse de progression** à long terme

## 📊 Types d'exercices inclus

### Catégories disponibles
- **Haut du corps** : Pompes, Tractions, Dips
- **Bas du corps** : Squats, Fentes, Pistol Squats
- **Core/Abdos** : Planche, L-Sit, Abdominaux
- **Cardio** : Burpees, Mountain Climbers, Jumping Jacks
- **Full Body** : Entraînements complets
- **Flexibilité** : Exercices d'étirement
- **Équilibre** : Travail de stabilité

### Niveaux de progression
- **🟢 Débutant** : Exercices accessibles pour commencer
- **🟡 Intermédiaire** : Progression vers plus de complexité
- **🟠 Avancé** : Défis pour sportifs expérimentés
- **🔴 Expert** : Mouvements très techniques

## 🔧 Personnalisation

### Thème sportif

Le thème peut être personnalisé dans `tailwind.config.js` :

```javascript
colors: {
  sport: {
    primary: '#1a365d',    // Bleu marine
    accent: '#fd7014',     // Orange énergique
    success: '#38a169',    // Vert victoire
    // ... autres couleurs
  }
}
```

### Ajout d'exercices

Les exercices sont stockés dans `src/data/liste_exercices.json` et peuvent être modifiés via l'API ou directement dans le fichier.

## 📱 Responsive Design

L'application est entièrement responsive avec des points de rupture optimisés :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px  
- **Desktop** : > 1024px

## 🚀 Déploiement

### Vercel (recommandé)
```bash
npm run build
# Déployer sur Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commiter les changes (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🏆 Fonctionnalités futures

- [ ] Mode sombre/clair
- [ ] Export des données d'entraînement
- [ ] Programmes d'entraînement prédéfinis  
- [ ] Intégration avec appareils fitness
- [ ] Mode compétition entre utilisateurs
- [ ] Application mobile native

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation dans le code
- Vérifier les stores Zustand pour la logique métier

---

**Transformez votre corps avec la callisthénie ! 💪** 
test