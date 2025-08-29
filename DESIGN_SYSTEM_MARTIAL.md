# Design System Martial - Calisthénie Tracker

## 🎯 Vue d'ensemble

Ce Design System modernise l'interface de l'application de calisthénie avec une **ambiance martiale** alliant discipline, intensité et ordre, tout en conservant ergonomie et clarté.

### Objectifs Produit
- ✅ Augmenter la motivation des utilisateurs
- ✅ Faciliter la lecture des séances d'entraînement
- ✅ Permettre l'édition rapide de l'emploi du temps
- ✅ Offrir une expérience mobile-first optimisée

---

## 🎨 Palette de Couleurs

### Tokens Principaux

```typescript
// Couleurs primaires
'primary-bg': '#0B0F12',      // near-black (arrière-plan principal)
'surface-1': '#13171A',       // gunmetal (surfaces, cartes)
'steel': '#AEB6BD',           // muted steel (accents, texte secondaire)
'danger-accent': '#9E1B1B',   // deep crimson (alertes, CTA)
'highlight': '#DFD9CB',       // off-white warm (texte principal)

// Variations fonctionnelles
'surface-hover': '#1A1F23',   // surface-1 éclaircie pour hover
'steel-light': '#BCC4CB',     // steel plus clair
'steel-dark': '#9BA3AA',      // steel plus sombre
'danger-light': '#B53E3E',    // danger plus clair pour hover
'danger-dark': '#7A1515',     // danger plus sombre

// États des composants
'success': '#2D5A2D',         // vert militaire pour succès
'warning': '#8B6914',         // jaune olive pour avertissements
'info': '#1F3A5F',            // bleu sombre pour informations
```

### Usage des Couleurs

| Couleur | Usage | Exemple |
|---------|-------|---------|
| `primary-bg` | Arrière-plan principal | `bg-martial-primary-bg` |
| `surface-1` | Cartes, modales, surfaces | `bg-martial-surface-1` |
| `steel` | Texte secondaire, icônes | `text-martial-steel` |
| `danger-accent` | CTA, boutons principaux | `bg-martial-danger-accent` |
| `highlight` | Texte principal | `text-martial-highlight` |

---

## ✍️ Typographie

### Familles de Polices

```css
/* Titres et display */
font-family: 'Bebas Neue', 'Oswald', 'Bebas Neue Condensed', sans-serif;

/* Corps de texte et UI */
font-family: 'Inter', 'Poppins', system-ui, sans-serif;
```

### Échelle Typographique

| Taille | CSS | Usage |
|--------|-----|-------|
| `xs` | `text-xs` (12px) | Labels, métadonnées |
| `sm` | `text-sm` (14px) | Corps de texte secondaire |
| `base` | `text-base` (16px) | Corps de texte principal |
| `lg` | `text-lg` (18px) | Sous-titres |
| `xl` | `text-xl` (20px) | Titres de section |
| `2xl` | `text-2xl` (24px) | Titres de page |
| `3xl` | `text-3xl` (30px) | Titres héros |
| `4xl` | `text-4xl` (36px) | Titres principaux |
| `5xl` | `text-5xl` (48px) | Titres de landing |
| `6xl` | `text-6xl` (60px) | Titres hero |

### Classes Utilitaires

```css
/* Styles spéciaux */
.text-stamped        /* Effet tampon avec ombres */
.text-glow-danger    /* Effet de lueur rouge */
.font-display        /* Police Bebas Neue pour titres */
.font-body          /* Police Inter pour corps */
```

---

## 📐 Espacement & Grille

### Système de Grille 8px

```typescript
spacing: {
  'xs': '4px',     // 0.5 * 8px
  'sm': '8px',     // 1 * 8px (base)
  'md': '16px',    // 2 * 8px
  'lg': '24px',    // 3 * 8px
  'xl': '32px',    // 4 * 8px
  '2xl': '40px',   // 5 * 8px
  '3xl': '48px',   // 6 * 8px
  '4xl': '64px',   // 8 * 8px
  '5xl': '80px',   // 10 * 8px
  '6xl': '96px',   // 12 * 8px
}
```

### Gutters Responsives

| Breakpoint | Gutter |
|------------|--------|
| Mobile | `16px` |
| Tablet | `24px` |
| Desktop | `32px` |

---

## 🧩 Composants Atomiques

### Boutons

```tsx
import { Button } from '@/components/ui';

// Variants disponibles
<Button variant="primary">Action Principale</Button>
<Button variant="secondary">Action Secondaire</Button>
<Button variant="success">Succès</Button>
<Button variant="cta" size="lg" weight="black">CTA HÉROS</Button>
<Button variant="ghost">Fantôme</Button>
<Button variant="emergency">URGENCE</Button>

// Tailles
<Button size="sm">Petit</Button>
<Button size="md">Moyen</Button>
<Button size="lg">Grand</Button>
<Button size="xl">Héros</Button>
<Button size="icon"><Icon /></Button>

// Avec icônes
<Button leftIcon={<PlayIcon />}>Démarrer</Button>
<Button rightIcon={<ArrowRightIcon />}>Suivant</Button>

// États
<Button loading>Chargement...</Button>
<Button disabled>Désactivé</Button>
```

### Cartes

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

// Variants
<Card variant="default">Carte standard</Card>
<Card variant="interactive">Avec hover interactif</Card>
<Card variant="hero" texture="metal">Dashboard héros</Card>
<Card variant="stats">Statistiques</Card>
<Card variant="emergency">Urgence</Card>

// Carte d'exercice spécialisée
<WorkoutCard difficulty="advanced" category="FORCE">
  <CardContent>...</CardContent>
</WorkoutCard>
```

### Inputs

```tsx
import { Input, TimeInput, SearchInput, Textarea } from '@/components/ui';

// Input standard
<Input 
  label="Nom d'utilisateur"
  placeholder="Entrez votre nom"
  leftIcon={<UserIcon />}
/>

// Input tactique
<Input variant="tactical" label="Objectif" />

// Input de temps
<TimeInput label="Heure de début" />

// Recherche
<SearchInput placeholder="Rechercher..." />

// États
<Input state="error" errorMessage="Erreur de validation" />
<Input state="success" />
<Input state="warning" helperText="Attention" />
```

### Badges

```tsx
import { Badge, DifficultyBadge, RankBadge, StatusBadge } from '@/components/ui';

// Badges de base
<Badge variant="rank">RANG</Badge>
<Badge variant="danger">ALERTE</Badge>
<Badge variant="success">SUCCÈS</Badge>

// Badges spécialisés
<DifficultyBadge level="advanced" />
<RankBadge rank="A" />
<StatusBadge status="completed" />

// Avec chevrons
<Badge variant="success" chevronCount={3}>MAÎTRISE</Badge>

// Supprimable
<Badge removable onRemove={() => {}}>Tag</Badge>
```

---

## 🎭 Iconographie & Effets Visuels

### Icônes Style Stencil

```tsx
// Chevrons de difficulté
<div className="martial-chevron martial-chevron-danger" />
<div className="martial-chevron martial-chevron-steel" />
<div className="martial-chevron martial-chevron-warning" />
```

### Textures Métalliques

```css
.texture-metal     /* Texture métallique subtile (≤6% opacity) */
.texture-grain     /* Grain film SVG */
```

### Progress Bar avec Chevrons

```tsx
<div className="martial-progress">
  <div className="martial-progress-bar" style={{ width: '75%' }} />
</div>
```

---

## 🎬 Animations & Micro-interactions

### Animations Martiales

```css
/* Bouton pressé */
.animate-scale-press      /* Scale 0.96 + retour */

/* Timer critique */
.animate-timer-pulse      /* Pulse + lueur quand <10s */

/* Cartes */
.animate-card-flip        /* Flip pour détails exercice */

/* Effets tactiques */
.animate-tactical-sweep   /* Balayage d'apparition */
.animate-drill-fade       /* Apparition drill */
```

### Hover States

```css
/* Cartes interactives */
.martial-card-hover       /* Bordure danger + glow */

/* Boutons */
button:hover { transform: scale(1.05); }
button:active { transform: scale(0.96); }
```

---

## 📱 Composants Spécialisés

### Timer Martial

```tsx
// Timer normal
<div className="martial-timer">02:30</div>

// Timer critique (<10s)
<div className="martial-timer-critical">00:08</div>
```

### Header Mobile Compact

```tsx
<header className="martial-header-mobile">
  <Logo />
  <Title />
  <MenuButton />
</header>
```

### Hero Dashboard

```tsx
<section className="martial-hero-dashboard">
  <CircularProgress percentage={85} />
  <NextWorkoutCard />
  <QuickStartCTA />
</section>
```

---

## 📐 Breakpoints & Responsive

```typescript
breakpoints: {
  sm: '640px',   // Mobile large
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Desktop large
  '2xl': '1536px' // Ultra-wide
}
```

### Classes Utilitaires

```css
.mobile-only     /* Visible uniquement mobile */
.desktop-only    /* Visible uniquement desktop */
```

---

## ♿ Accessibilité

### Contrastes WCAG AA+

| Combinaison | Ratio | Statut |
|-------------|-------|--------|
| `highlight` sur `primary-bg` | 12.5:1 | ✅ AAA |
| `steel` sur `primary-bg` | 6.8:1 | ✅ AA |
| `danger-accent` sur `highlight` | 4.8:1 | ✅ AA |

### Focus States

```css
.martial-focus {
  outline: 3px solid rgba(158, 27, 27, 0.6);
  outline-offset: 2px;
}
```

### Tailles Minimales

- Corps de texte : `14-16px` mobile
- Targets tactiles : `44px` minimum
- Focus visible sur tous les éléments interactifs

---

## 💬 Ton & Microcopy

### Directives de Rédaction

| Principe | Exemple | À éviter |
|----------|---------|----------|
| **Direct** | "Commencer", "Terminer" | "Peut-être commencer" |
| **Commandant** | "Marquer comme terminé" | "Vous pourriez marquer" |
| **Motivant** | "Discipline. Répète." | "C'est bien si vous..." |
| **Précis** | "67 pompes (+12)" | "Beaucoup de pompes" |

### Exemples de Microcopy

```typescript
// Boutons d'action
"COMMENCER LA SÉANCE"
"MARQUER COMME TERMINÉ"
"MODIFIER HORAIRE"

// Messages de statut
"Mission accomplie"
"Objectif atteint"
"Discipline maintenue"

// Erreurs
"Conflit d'horaire détecté"
"Validation requise"
```

---

## 🛠️ Installation & Usage

### 1. Installation des Dépendances

```bash
npm install class-variance-authority clsx tailwind-merge
```

### 2. Configuration Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'Oswald', 'sans-serif'],
        'body': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        martial: {
          'primary-bg': '#0B0F12',
          'surface-1': '#13171A',
          'steel': '#AEB6BD',
          'danger-accent': '#9E1B1B',
          'highlight': '#DFD9CB',
          // ... autres couleurs
        }
      }
    }
  }
}
```

### 3. Import CSS Global

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
```

### 4. Utilisation des Composants

```tsx
// pages/example.tsx
import { Button, Card, DifficultyBadge } from '@/components/ui';

export default function Example() {
  return (
    <div className="bg-martial-primary-bg min-h-screen p-8">
      <Card variant="hero">
        <CardContent>
          <h1 className="font-display text-4xl text-martial-highlight">
            ENTRAÎNEMENT
          </h1>
          <DifficultyBadge level="advanced" />
          <Button variant="cta" size="lg">
            COMMENCER LA SÉANCE
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📊 Composants de Mockups

### Écrans Disponibles

1. **HomeMockup** - Dashboard avec progression quotidienne
2. **WorkoutPlayerMockup** - Lecteur d'entraînement avec timer
3. **LibraryMockup** - Bibliothèque d'exercices avec filtres
4. **ScheduleEditorModal** - Éditeur de planning hebdomadaire
5. **ProfileMockup** - Profil utilisateur avec timeline et badges

### Logos Proposés

1. **ChevronLogo** - Style stencil avec gradients militaires
2. **ActionSilhouetteLogo** - Silhouette d'athlète en contre-jour
3. **MedalLogo** - Médaille minimaliste avec chevrons

```tsx
import { ChevronLogo, ActionSilhouetteLogo, MedalLogo } from '@/components/logos';

<ChevronLogo variant="danger" size={48} />
<ActionSilhouetteLogo variant="steel" size={64} />
<MedalLogo variant="highlight" size={32} />
```

---

## 🎨 Showcase Components

### Design System Showcase

```tsx
import UIShowcase from '@/components/ui/UIShowcase';
import LogoShowcase from '@/components/logos/LogoShowcase';

// Démo complète des composants
<UIShowcase />

// Démo des logos avec contrôles
<LogoShowcase />
```

---

## 📝 Export pour Développeurs

### Fichiers Clés

| Fichier | Description |
|---------|-------------|
| `src/design-system/tokens.ts` | Tokens de couleurs et espacements |
| `src/components/ui/` | Composants atomiques |
| `src/components/logos/` | Logos avec variants |
| `src/app/globals.css` | Styles CSS martiaux |
| `tailwind.config.js` | Configuration Tailwind |

### JSON des Tokens (Export)

```json
{
  "colors": {
    "primary-bg": "#0B0F12",
    "surface-1": "#13171A",
    "steel": "#AEB6BD",
    "danger-accent": "#9E1B1B",
    "highlight": "#DFD9CB"
  },
  "spacing": {
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "borderRadius": {
    "sm": "6px",
    "md": "8px",
    "lg": "12px",
    "2xl": "24px"
  }
}
```

---

## 🚀 Prochaines Étapes

### Phase 1 - Implémentation Core
- [ ] Intégrer les composants dans l'application existante
- [ ] Migrer les écrans principaux vers le nouveau design
- [ ] Tests utilisateurs sur mobile

### Phase 2 - Optimisations
- [ ] Performance des animations
- [ ] Tests d'accessibilité complets
- [ ] Optimisation bundle size

### Phase 3 - Extensions
- [ ] Dark/Light mode toggle
- [ ] Thèmes alternatifs
- [ ] Composants avancés (calendrier, graphiques)

---

## 📞 Support & Maintenance

### Conventions de Nommage

- **Composants** : PascalCase (`Button`, `WorkoutCard`)
- **Variants** : kebab-case (`primary`, `cta`, `emergency`)
- **Classes CSS** : préfixe `martial-` (`martial-btn`, `martial-card`)

### Versioning

- Version actuelle : `1.0.0`
- Breaking changes : version majeure
- Nouveaux composants : version mineure
- Bugfixes : version patch

---

*Design System Martial - Calisthénie Tracker v1.0.0*  
*Développé avec discipline, intensité et ordre. 🎖️*
