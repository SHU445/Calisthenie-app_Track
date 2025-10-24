'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { RANKS } from '@/data/ranks';
import Link from 'next/link';
import {
  TrophyIcon,
  ClockIcon,
  FireIcon,
  ArrowLeftIcon,
  StarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Composant de carte de rang
const RankCard: React.FC<{
  rank: any;
  index: number;
}> = ({ rank, index }) => {
  return (
    <div className="group martial-card-theme p-6 animate-zoom-in">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-martial-highlight font-bold text-lg"
          style={{ backgroundColor: rank.color }}
        >
          {rank.rank}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-martial-highlight group-hover:text-accent transition-colors duration-200">
            {rank.name}
          </h3>
          <p className="text-martial-steel text-sm">
            Rang {rank.rank} - {rank.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-martial-steel">
          <ClockIcon className="h-4 w-4" />
          <span className="text-sm">Difficulté: {rank.difficulty}</span>
        </div>
        
        {rank.requirements && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-martial-danger-accent">Prérequis :</h4>
            <ul className="space-y-1">
              {rank.requirements.map((req: string, reqIndex: number) => (
                <li key={reqIndex} className="flex items-start gap-2 text-sm text-martial-steel">
                  <ChevronRightIcon className="h-3 w-3 mt-1 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {rank.exercises && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-martial-danger-accent">Exercices typiques :</h4>
            <div className="flex flex-wrap gap-1">
              {rank.exercises.slice(0, 3).map((exercise: string, exIndex: number) => (
                <span 
                  key={exIndex}
                  className="text-xs bg-martial-surface-hover text-martial-steel px-2 py-1 rounded"
                >
                  {exercise}
                </span>
              ))}
              {rank.exercises.length > 3 && (
                <span className="text-xs text-martial-steel">
                  +{rank.exercises.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant de progression
const ProgressionGuide: React.FC = () => {
  return (
    <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-6 shadow-martial-lg">
      <div className="flex items-center gap-3 mb-4">
        <FireIcon className="h-6 w-6 text-martial-danger-accent" />
        <h3 className="text-lg font-semibold text-martial-highlight">Guide de progression</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-martial-danger-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-martial-highlight text-xs font-bold">1</span>
          </div>
          <div>
            <h4 className="text-martial-highlight font-medium mb-1">Commencez par le rang 1</h4>
            <p className="text-martial-steel text-sm">
              Maîtrisez les exercices de base avant de passer au niveau suivant
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-martial-danger-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-martial-highlight text-xs font-bold">2</span>
          </div>
          <div>
            <h4 className="text-martial-highlight font-medium mb-1">Progressez graduellement</h4>
            <p className="text-martial-steel text-sm">
              Ne passez au rang suivant que lorsque vous maîtrisez parfaitement le rang actuel
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-martial-danger-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-martial-highlight text-xs font-bold">3</span>
          </div>
          <div>
            <h4 className="text-martial-highlight font-medium mb-1">Consistance et patience</h4>
            <p className="text-martial-steel text-sm">
              La progression en calisthénie demande du temps et de la régularité
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
function RangsPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-martial-primary-bg">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center w-16 h-16 bg-martial-danger-accent rounded-full mx-auto mb-6">
                <TrophyIcon className="h-8 w-8 text-martial-highlight" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-martial-highlight mb-4">
                Système de Rangs
              </h1>
              <p className="text-xl text-martial-steel max-w-3xl mx-auto">
                Comprenez le système de classification des exercices de calisthénie par rang de difficulté
              </p>
            </div>

            {/* Back to exercises */}
            <div className="mb-8">
              <Link 
                href="/exercices" 
                className="inline-flex items-center gap-2 filter-clear-btn focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-2 py-1"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Retour aux exercices</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Ranks Grid */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {RANKS.map((rank, index) => (
                <RankCard
                  key={rank.rank}
                  rank={rank}
                  index={index}
                />
              ))}
            </div>

            {/* Progression Guide */}
            <div className="max-w-4xl mx-auto">
              <ProgressionGuide />
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
