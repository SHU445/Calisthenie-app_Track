'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { PlayIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface CTASectionProps {
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ className = '' }) => {
  const { isAuthenticated } = useAuth();

  return (
    <section className={`py-16 sm:py-20 md:py-24 bg-gradient-to-br from-martial-primary-bg via-martial-surface-1 to-martial-surface-hover ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-martial-highlight mb-4 sm:mb-6">
          Commencez votre entraînement aujourd'hui
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-martial-steel mb-6 sm:mb-8 max-w-2xl mx-auto">
          Chaque expert était autrefois un débutant. 
          Commencez dès maintenant votre parcours vers la maîtrise de votre corps.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          {!isAuthenticated ? (
            <>
              {/* Primary CTA */}
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center space-x-2 martial-btn-theme font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                aria-label="Inscription gratuite"
              >
                <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Inscription gratuite</span>
                <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
              
              {/* Secondary CTA */}
              <Link
                href="/exercices"
                className="inline-flex items-center justify-center space-x-2 bg-martial-surface-1 hover:bg-martial-surface-hover text-martial-highlight border border-martial-steel/30 hover:border-martial-steel/50 font-medium py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-all duration-200 w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-steel focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                aria-label="Découvrir les exercices"
              >
                <BookOpenIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Découvrir les exercices</span>
              </Link>
            </>
          ) : (
            <Link
              href="/entrainements"
              className="inline-flex items-center justify-center space-x-2 bg-martial-danger-accent hover:bg-martial-danger-light text-martial-highlight font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl shadow-glow-danger hover:shadow-glow-danger transition-all duration-200 w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
              aria-label="Commencer un entraînement"
            >
              <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Commencer un entraînement</span>
              <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
