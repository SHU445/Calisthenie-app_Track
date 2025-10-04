'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  BookOpenIcon,
  PlayIcon,
  ChartBarIcon,
  UserGroupIcon,
  FireIcon,
  TrophyIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const { fetchExercises, exercises } = useExerciseStore();

  useEffect(() => {
    // Passer l'userId pour obtenir les exercices de base + exercices personnalisés
    fetchExercises(user?.id);
  }, [fetchExercises, user?.id]);

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Base d\'exercices complète',
      description: 'Plus de 20 exercices de calisthénie détaillés avec instructions et niveaux de difficulté',
      color: 'text-sport-accent'
    },
    {
      icon: PlayIcon,
      title: 'Suivi d\'entraînements',
      description: 'Enregistrez vos séances, suivez vos séries et répétitions avec un système intuitif',
      color: 'text-sport-success'
    },
    {
      icon: ChartBarIcon,
      title: 'Analyse des progrès',
      description: 'Graphiques détaillés pour visualiser votre évolution et battre vos records personnels',
      color: 'text-sport-gold'
    },
    {
      icon: UserGroupIcon,
      title: 'Multi-utilisateurs',
      description: 'Gestion de plusieurs profils avec données personnalisées et sécurisées',
      color: 'text-sport-silver'
    }
  ];

  const stats = [
    { label: 'Exercices disponibles', value: exercises.length, icon: FireIcon },
    { label: 'Catégories', value: '7', icon: TrophyIcon },
    { label: 'Rangs de difficulté', value: '7', icon: StarIcon }
  ];

  const benefits = [
    'Entraînement au poids du corps uniquement',
    'Progression adaptée à votre niveau',
    'Suivi détaillé de vos performances',
    'Interface moderne et intuitive',
    'Données stockées sur mongo',
    'Accès gratuit à toutes les fonctionnalités'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Section Hero */}
        <section className="sport-section pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="sport-container">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in-up">
                <span className="sport-text-gradient">Calisthénie</span>
                <br />
                <span className="text-white">Tracker</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed animate-fade-in-up">
                Le compagnon d'entraînement pour la calisthénie.
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Suivez vos progrès, dépassez vos limites.
              </p>
              
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up">
                  <div className="flex items-center space-x-2 text-sport-success text-sm sm:text-base">
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Connecté : <strong>{user?.username}</strong></span>
                  </div>
                  <Link
                    href="/entrainements"
                    className="sport-btn-primary inline-flex items-center space-x-2 w-full sm:w-auto justify-center"
                  >
                    <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Commencer l'entraînement</span>
                    <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up max-w-md mx-auto sm:max-w-none">
                  <Link
                    href="/auth/register"
                    className="sport-btn-primary inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Commencer gratuitement</span>
                    <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                  <Link
                    href="/exercices"
                    className="sport-btn-secondary inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Explorer les exercices</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section Stats */}
        <section className="py-16 bg-sport-secondary/50">
          <div className="sport-container">
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="text-center animate-slide-in-right">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-sport-accent rounded-full mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section className="sport-section">
          <div className="sport-container">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Ce dont vous avez besoin :
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                Une suite complète d'outils pour optimiser vos entraînements de calisthénie
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="sport-card-hover p-4 sm:p-6 md:p-8 animate-zoom-in">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`p-2 sm:p-3 rounded-lg bg-sport-secondary ${feature.color} flex-shrink-0`}>
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section Avantages */}
        <section className="py-12 sm:py-16 bg-sport-secondary/30">
          <div className="sport-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                  Pourquoi choisir la calisthénie ?
                </h2>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                  La calisthénie est l'art de s'entraîner avec son propre poids. 
                  C'est accessible, efficace et permet de développer une force fonctionnelle 
                  exceptionnelle.
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start sm:items-center space-x-3">
                      <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-sport-success flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:text-center mt-6 lg:mt-0">
                <div className="sport-card p-6 sm:p-8 border-gradient">
                  <div className="text-center">
                    <TrophyIcon className="h-16 w-16 sm:h-20 sm:w-20 text-sport-gold mx-auto mb-4 sm:mb-6" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      Prêt à commencer ?
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                      Rejoignez des milliers de pratiquants qui ont transformé leur corps 
                      avec la calisthénie.
                    </p>
                    {!isAuthenticated && (
                      <Link
                        href="/auth/register"
                        className="sport-btn-primary inline-flex items-center space-x-2 w-full sm:w-auto justify-center"
                      >
                        <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Créer mon compte</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA */}
        <section className="sport-section bg-sport-gradient">
          <div className="sport-container text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
              Commencez votre transformation aujourd'hui
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Chaque expert était autrefois un débutant. 
              Commencez dès maintenant votre parcours vers la maîtrise de votre corps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto px-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/register"
                    className="sport-btn bg-sport-accent text-white hover:bg-sport-accent/90 font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto text-center"
                  >
                    Inscription gratuite
                  </Link>
                  <Link
                    href="/exercices"
                    className="sport-btn-secondary py-3 px-6 sm:py-4 sm:px-8 w-full sm:w-auto text-center"
                  >
                    Découvrir les exercices
                  </Link>
                </>
              ) : (
                <Link
                  href="/entrainements"
                  className="sport-btn bg-sport-accent text-white hover:bg-sport-accent/90 font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto text-center"
                >
                  Commencer un entraînement
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 