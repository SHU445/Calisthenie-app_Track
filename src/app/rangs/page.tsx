'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { RANKS } from '@/data/ranks';
import Link from 'next/link';
import {
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ArrowLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';

function RangsPageContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <section className="sport-section pt-20 pb-12">
          <div className="sport-container">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center w-16 h-16 bg-sport-accent rounded-full mx-auto mb-6">
                <TrophyIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Système de Rangs
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprenez le système de classification des exercices de callisthénie par rang de difficulté
              </p>
            </div>

            {/* Back to exercises */}
            <div className="mb-8">
              <Link 
                href="/exercices" 
                className="inline-flex items-center gap-2 text-sport-accent hover:text-sport-accent-light transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Retour aux exercices</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="pb-8">
          <div className="sport-container">
            <div className="sport-card p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                À propos du système de rangs
              </h2>
              <p className="text-gray-300 mb-4">
                Le système de rangs classe les exercices de callisthénie selon leur difficulté et le temps 
                nécessaire pour les maîtriser. Chaque rang représente une étape dans votre progression, 
                du niveau de base (F) jusqu'au niveau élite (SS).
              </p>
              <p className="text-gray-300">
                Ce système vous aide à planifier votre entraînement et à suivre votre progression de manière structurée.
              </p>
            </div>
          </div>
        </section>

        {/* Ranks Grid */}
        <section className="pb-16">
          <div className="sport-container">
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              {RANKS.map((rank) => (
                <div key={rank.rank} className="sport-card-hover p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-2xl"
                      style={{ backgroundColor: rank.color }}
                    >
                      {rank.rank}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Rang {rank.rank}
                      </h3>
                      <p className="text-sport-accent font-medium">
                        {rank.name}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="h-5 w-5 text-sport-accent" />
                      <span className="text-sm font-medium text-sport-accent">
                        Temps de maîtrise :
                      </span>
                    </div>
                    <p className="text-white font-medium">
                      {rank.timeframe}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {rank.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FireIcon className="h-5 w-5 text-sport-accent" />
                      <span className="text-sm font-medium text-sport-accent">
                        Compétences principales :
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rank.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-sport-gray-light text-gray-300 px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Progression Tips */}
        <section className="pb-16">
          <div className="sport-container">
            <div className="sport-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <StarIcon className="h-8 w-8 text-sport-accent" />
                <h2 className="text-2xl font-bold text-white">
                  Conseils pour progresser
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    📈 Progression graduelle
                  </h3>
                  <p className="text-gray-300">
                    Maîtrisez complètement un rang sur la progression d'un mouvement avant de passer au suivant. 
                    La précipitation peut conduire à des blessures.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    🎯 Consistance
                  </h3>
                  <p className="text-gray-300">
                    L'entraînement régulier est plus important que l'intensité. 
                    Visez 3-4 séances par semaine minimum.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    🧘 Patience
                  </h3>
                  <p className="text-gray-300">
                    Les rangs supérieurs demandent des années de pratique. 
                    Célébrez chaque petite progression.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    🏥 Récupération
                  </h3>
                  <p className="text-gray-300">
                    Le repos fait partie de l'entraînement. Écoutez votre corps 
                    et accordez-vous des jours de récupération.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function RangsPage() {
  return (
    <ProtectedRoute>
      <RangsPageContent />
    </ProtectedRoute>
  );
} 