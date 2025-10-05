/**
 * Configuration SEO centralisée pour l'application Callisthénie Tracker
 */

import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Callisthénie Tracker',
  description: 'Application web de suivi d\'entraînements de callisthénie avec thème sportif moderne. Suivez vos progrès, analysez vos performances et dépassez vos limites.',
  url: 'https://calisthenie-track.vercel.app',
  ogImage: 'https://calisthenie-track.vercel.app/og-image.jpg',
  links: {
    github: 'https://github.com/votre-repo/calisthenie-tracker',
  },
  keywords: [
    'callisthénie',
    'fitness',
    'musculation',
    'street workout',
    'sport',
    'entraînement',
    'tracker',
    'suivi sportif',
    'exercices au poids du corps',
    'pompes',
    'tractions',
    'dips',
    'muscle-ups',
    'planche',
    'handstand',
    'progression sportive',
    'analyse de performance',
    'records personnels',
    'statistiques sportives',
  ],
  creator: 'Callisthénie Tracker Team',
  authors: [
    {
      name: 'Callisthénie Tracker',
      url: 'https://calisthenie-track.vercel.app',
    },
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@calisthenie_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

/**
 * Métadonnées pour les pages spécifiques
 */
export const pageMetadata = {
  home: {
    title: 'Accueil - Votre compagnon d\'entraînement en callisthénie',
    description: 'Suivez vos entraînements de callisthénie, analysez vos progrès et dépassez vos limites. Plus de 20 exercices détaillés, suivi de performances et graphiques de progression.',
    keywords: ['callisthénie', 'tracker', 'entraînement', 'sport', 'fitness', 'exercices au poids du corps', 'street workout'],
  },
  exercises: {
    title: 'Base d\'exercices - Bibliothèque complète de callisthénie',
    description: 'Découvrez notre collection complète d\'exercices de callisthénie : pompes, tractions, dips, muscle-ups et plus. Instructions détaillées, niveaux de difficulté et muscles ciblés.',
    keywords: ['exercices callisthénie', 'pompes', 'tractions', 'dips', 'muscle-ups', 'planche', 'handstand', 'exercices poids du corps'],
  },
  workouts: {
    title: 'Mes entraînements - Historique et suivi de séances',
    description: 'Gérez vos séances d\'entraînement, suivez vos séries et répétitions. Historique complet avec statistiques détaillées et analyse de performances.',
    keywords: ['entraînements callisthénie', 'suivi séances', 'historique sport', 'séries répétitions', 'gestion entraînement'],
  },
  progress: {
    title: 'Mes progrès - Analyse et statistiques de performance',
    description: 'Analysez vos performances avec des graphiques détaillés. Suivez vos records personnels, visualisez votre évolution et optimisez votre progression.',
    keywords: ['progrès callisthénie', 'statistiques sport', 'analyse performance', 'graphiques progression', 'records personnels'],
  },
  ranks: {
    title: 'Système de rangs - Niveaux de difficulté des exercices',
    description: 'Comprendre le système de rangs de D à SSS pour les exercices de callisthénie. Progressez à votre rythme du débutant à l\'expert.',
    keywords: ['rangs callisthénie', 'niveaux difficulté', 'progression sportive', 'débutant à expert'],
  },
  auth: {
    login: {
      title: 'Connexion - Accéder à votre compte',
      description: 'Connectez-vous à votre compte Callisthénie Tracker pour accéder à vos entraînements et suivre vos progrès.',
      keywords: ['connexion', 'login', 'compte'],
    },
    register: {
      title: 'Inscription - Créer un compte gratuit',
      description: 'Créez votre compte gratuit et commencez à suivre vos entraînements de callisthénie dès aujourd\'hui.',
      keywords: ['inscription', 'créer compte', 'gratuit'],
    },
  },
};

