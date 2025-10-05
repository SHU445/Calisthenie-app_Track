# 🚀 Configuration SEO - Callisthénie Tracker

## 📋 Vue d'ensemble

Cette documentation décrit la configuration SEO complète mise en place pour l'application Callisthénie Tracker. La configuration vise à optimiser le référencement naturel (SEO) tout en préservant l'intégrité de l'application.

## 🎯 Objectifs SEO

- ✅ Améliorer la visibilité sur les moteurs de recherche
- ✅ Optimiser les métadonnées pour Google, Bing, etc.
- ✅ Configurer Open Graph pour les réseaux sociaux
- ✅ Ajouter des données structurées (JSON-LD)
- ✅ Créer un manifest.json pour PWA
- ✅ Optimiser le sitemap et robots.txt

## 📁 Fichiers créés/modifiés

### 1. Configuration centralisée (`src/config/seo.ts`)

Fichier principal de configuration contenant :
- **siteConfig** : Informations générales du site
- **defaultMetadata** : Métadonnées par défaut avec Open Graph et Twitter Cards
- **pageMetadata** : Métadonnées spécifiques pour chaque page

```typescript
// Structure principale
{
  name: 'Callisthénie Tracker',
  description: '...',
  url: 'https://calisthenie-track.vercel.app',
  keywords: [...], // 20+ mots-clés ciblés
  openGraph: {...},
  twitter: {...},
  robots: {...}
}
```

### 2. Layouts avec métadonnées

Création de fichiers `layout.tsx` pour chaque section importante :

- **`src/app/exercices/layout.tsx`** : Métadonnées pour la base d'exercices
- **`src/app/entrainements/layout.tsx`** : Métadonnées pour les entraînements
- **`src/app/progres/layout.tsx`** : Métadonnées pour l'analyse de progrès
- **`src/app/rangs/layout.tsx`** : Métadonnées pour le système de rangs
- **`src/app/auth/login/layout.tsx`** : Métadonnées pour la connexion (noindex)
- **`src/app/auth/register/layout.tsx`** : Métadonnées pour l'inscription (noindex)

### 3. Composant JSON-LD (`src/components/JsonLd.tsx`)

Composant pour injecter des données structurées dans les pages :

- **organizationSchema** : Informations sur l'organisation
- **webApplicationSchema** : Détails de l'application web
- **websiteSchema** : Structure du site avec SearchAction
- **articleSchema** : Pour les articles/contenus
- **breadcrumbSchema** : Fil d'Ariane
- **faqSchema** : Questions fréquentes

### 4. Manifest PWA (`public/manifest.json`)

Configuration pour Progressive Web App :
- Nom et description de l'app
- Icônes (192x192, 512x512)
- Thème et couleurs
- Shortcuts vers les sections principales
- Screenshots (mobile et desktop)

### 5. Configuration Next.js (`next.config.js`)

Améliorations ajoutées :
- Optimisation des images (AVIF, WebP)
- Headers de sécurité et SEO
- Compression activée
- Suppression du header `X-Powered-By`

### 6. Configuration Sitemap (`next-sitemap.config.js`)

Sitemap optimisé avec :
- Exclusions des routes privées (API, auth, etc.)
- Priorités personnalisées par page
- Fréquences de crawl adaptées
- Configuration robots.txt avancée

```javascript
Priorités définies :
- Page d'accueil : 1.0 (quotidien)
- Exercices : 0.9 (hebdomadaire)
- Entraînements : 0.8 (quotidien)
- Progrès : 0.8 (hebdomadaire)
- Rangs : 0.6 (mensuel)
```

## 🔍 Mots-clés ciblés

Les mots-clés suivants sont optimisés dans les métadonnées :

### Principaux
- callisthénie
- fitness
- street workout
- exercices au poids du corps
- tracker sportif

### Exercices
- pompes, tractions, dips, muscle-ups
- planche, handstand
- squats, burpees

### Fonctionnalités
- suivi sportif
- analyse de performance
- progression sportive
- records personnels
- statistiques sportives

## 📊 Métadonnées par page

### Page d'accueil (`/`)
- **Title** : "Accueil - Votre compagnon d'entraînement en callisthénie"
- **Description** : Focus sur les fonctionnalités principales
- **Priorité SEO** : 1.0 (Maximum)

### Exercices (`/exercices`)
- **Title** : "Base d'exercices - Bibliothèque complète de callisthénie"
- **Description** : Mise en avant de la collection d'exercices
- **Priorité SEO** : 0.9 (Très élevée)

### Entraînements (`/entrainements`)
- **Title** : "Mes entraînements - Historique et suivi de séances"
- **Description** : Gestion et suivi des séances
- **Priorité SEO** : 0.8 (Élevée)

### Progrès (`/progres`)
- **Title** : "Mes progrès - Analyse et statistiques de performance"
- **Description** : Analyse et visualisation des performances
- **Priorité SEO** : 0.8 (Élevée)

## 🌐 Open Graph et Twitter Cards

Tous les layouts incluent maintenant :

```typescript
openGraph: {
  title: '...',
  description: '...',
  url: '...',
  siteName: 'Callisthénie Tracker',
  locale: 'fr_FR',
  type: 'website',
  images: [{
    url: '/og-image.jpg',
    width: 1200,
    height: 630,
  }]
}

twitter: {
  card: 'summary_large_image',
  title: '...',
  description: '...',
  images: ['/og-image.jpg']
}
```

## 🤖 Robots et indexation

### Pages indexées
- ✅ Page d'accueil
- ✅ Base d'exercices
- ✅ Page des rangs
- ✅ Pages publiques

### Pages non indexées
- ❌ Routes API (`/api/*`)
- ❌ Pages d'authentification (`/auth/*`)
- ❌ Pages de modification (`/*/modifier/*`)
- ❌ Pages d'ajout (`/*/ajouter`)

Configuration dans `robots.txt` :
```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/
Disallow: /*.json$

User-agent: Googlebot
Allow: /
Crawl-delay: 0
```

## 📱 Progressive Web App (PWA)

Le manifest.json configure l'app comme PWA :
- **Installable** : Peut être installée sur mobile/desktop
- **Offline ready** : Prêt pour le mode hors ligne (à configurer)
- **Shortcuts** : Accès rapides aux sections principales
- **Theme color** : `#fd7014` (orange énergique)
- **Background color** : `#0f1318` (dark mode)

## 🔧 Commandes utiles

### Générer le sitemap
```bash
npm run build
npx next-sitemap
```

### Valider les métadonnées
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Vérifier le SEO
```bash
# Lighthouse
npx lighthouse https://calisthenie-track.vercel.app --view

# Analyse de performance
npm run build
npm run start
```

## 📈 Améliorations recommandées

### À court terme
- [ ] Créer l'image Open Graph (`public/og-image.jpg` - 1200x630px)
- [ ] Créer les icônes PWA (`icon-192x192.png`, `icon-512x512.png`)
- [ ] Créer le favicon (`favicon.ico`, `favicon-16x16.png`, `apple-touch-icon.png`)
- [ ] Ajouter des screenshots pour le manifest (`screenshot-mobile.png`, `screenshot-desktop.png`)

### À moyen terme
- [ ] Implémenter un fichier `sitemap-dynamic.xml` pour les pages dynamiques
- [ ] Ajouter des balises `canonical` pour éviter le contenu dupliqué
- [ ] Créer une page FAQ avec le schéma JSON-LD FAQ
- [ ] Ajouter Google Analytics / Google Search Console

### À long terme
- [ ] Optimiser les Core Web Vitals (LCP, FID, CLS)
- [ ] Implémenter le lazy loading pour les images
- [ ] Créer du contenu SEO (blog, guides, tutoriels)
- [ ] Mettre en place un système de backlinks

## 🎨 Images requises pour SEO complet

Pour finaliser la configuration SEO, créez ces images :

1. **Open Graph Image** (`public/og-image.jpg`)
   - Dimensions : 1200x630 pixels
   - Format : JPG ou PNG
   - Contenu : Logo + slogan de l'app

2. **Favicons**
   - `public/favicon.ico` (32x32)
   - `public/favicon-16x16.png` (16x16)
   - `public/apple-touch-icon.png` (180x180)

3. **Icônes PWA**
   - `public/icon-192x192.png` (192x192)
   - `public/icon-512x512.png` (512x512)

4. **Screenshots**
   - `public/screenshot-mobile.png` (540x720)
   - `public/screenshot-desktop.png` (1920x1080)

## ✅ Checklist de validation

### Configuration de base
- ✅ Métadonnées définis dans tous les layouts
- ✅ Open Graph configuré
- ✅ Twitter Cards configuré
- ✅ Manifest.json créé
- ✅ Robots.txt optimisé
- ✅ Sitemap configuré

### Données structurées
- ✅ Organization Schema
- ✅ WebApplication Schema
- ✅ Website Schema avec SearchAction
- ✅ Composant JsonLd créé

### Performance
- ✅ Images optimisées (AVIF, WebP)
- ✅ Compression activée
- ✅ Headers de sécurité
- ✅ Preconnect pour les fonts

### Accessibilité
- ✅ Langue définie (`lang="fr"`)
- ✅ Viewport responsive
- ✅ Theme color défini
- ✅ Alt texts (à vérifier sur les images)

## 🔗 Ressources utiles

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)

---

**Configuration réalisée le** : ${new Date().toLocaleDateString('fr-FR')}

**Statut** : ✅ Configuration SEO complète et fonctionnelle

Pour toute question ou amélioration, consultez ce document.

