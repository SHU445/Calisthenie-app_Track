'use client';

import React, { useEffect } from 'react';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/refonte/Header';
import { Hero } from '@/components/refonte/Hero';
import { StatsRow } from '@/components/refonte/StatsRow';
import { FeatureGrid } from '@/components/refonte/FeatureGrid';
import { WhySection } from '@/components/refonte/WhySection';
import { CTASection } from '@/components/refonte/CTASection';
import { Footer } from '@/components/refonte/Footer';
//import ThemeHoverTest from '@/components/refonte/ThemeHoverTest';
//import ThemeDebug from '@/components/refonte/ThemeDebug';
import {
  BookOpenIcon,
  PlayIcon,
  ChartBarIcon,
  UserGroupIcon,
  FireIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { fetchExercises, exercises } = useExerciseStore();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchExercises(user.id);
    }
  }, [fetchExercises, user?.id, isAuthenticated]);

  // Features data
  const features = [
    {
      icon: BookOpenIcon,
      title: 'Base d\'exercices complète',
      description: 'Plus de 20 exercices de calisthénie détaillés avec instructions et niveaux de difficulté',
      color: 'text-martial-danger-accent'
    },
    {
      icon: PlayIcon,
      title: 'Suivi d\'entraînements',
      description: 'Enregistrez vos séances, suivez vos séries et répétitions avec un système intuitif',
      color: 'text-martial-success'
    },
    {
      icon: ChartBarIcon,
      title: 'Analyse des progrès',
      description: 'Graphiques détaillés pour visualiser votre évolution et battre vos records personnels',
      color: 'text-martial-warning'
    },
    {
      icon: UserGroupIcon,
      title: 'Multi-utilisateurs',
      description: 'Gestion de plusieurs profils avec données personnalisées et sécurisées',
      color: 'text-martial-steel'
    }
  ];

  // Stats data
  const stats = [
    { label: 'Exercices disponibles', value: exercises.length || '20+', icon: FireIcon },
    { label: 'Catégories', value: '7', icon: TrophyIcon },
    { label: 'Rangs de difficulté', value: '7', icon: StarIcon }
  ];

  // Benefits data
  const benefits = [
    'Entraînement au poids du corps',
    'Possibilité de créer des exercices personnalisés',
    'Progression adaptée à tout niveau',
    'Suivi détaillé de vos performances',
    'Interface moderne et intuitive',
    'Données disponibles partout',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-martial-primary-bg">
      <Header />

      <main className="flex-1">
        <Hero />
        <StatsRow stats={stats} />
        <FeatureGrid features={features} />
        <WhySection benefits={benefits} />
        <CTASection />
      </main>

      <Footer />
      
      {/* Composant de test des animations hover - à retirer en production */}
      {/*<ThemeHoverTest />*/}
      
      {/* Composant de debug des thèmes - à retirer en production */}
      {/*<ThemeDebug />*/}
    </div>
  );
}