'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { 
  PlayIcon, 
  BookOpenIcon, 
  ArrowRightIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className={`relative pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 sm:pb-20 md:pb-24 lg:pb-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-martial-danger-accent to-martial-steel bg-clip-text text-transparent">
              Maîtrise ton corps.
            </span>
            <br />
            <span className="text-martial-highlight">
              Suis ta progression.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-martial-steel mb-6 sm:mb-8 leading-relaxed animate-fade-in-up">
            L'application intuitive pour planifier, enregistrer et analyser tes séances de calisthénie.
          </p>
          
          {/* CTAs */}
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up">
              <div className="flex items-center space-x-2 text-martial-success text-sm sm:text-base">
                <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Connecté : <strong>{user?.username}</strong></span>
              </div>
              <Link
                href="/entrainements"
                className="inline-flex items-center justify-center space-x-2 martial-btn-theme font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                aria-label="Commencer un entraînement"
              >
                <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Commencer l'entraînement</span>
                <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up max-w-md mx-auto sm:max-w-none">
              {/* Primary CTA - Dominant */}
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center space-x-2 martial-btn-theme font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                aria-label="Commencer gratuitement"
              >
                <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Commencer gratuitement</span>
                <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
              
              {/* Secondary CTA - Discret */}
              <Link
                href="/exercices"
                className="inline-flex items-center justify-center space-x-2 bg-martial-surface-1 hover:bg-martial-surface-hover text-martial-highlight border border-martial-steel/30 hover:border-martial-steel/50 font-medium py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-all duration-200 w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-steel focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                aria-label="Explorer les exercices"
              >
                <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Explorer les exercices</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
