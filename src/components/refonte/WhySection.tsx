'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircleIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface WhySectionProps {
  benefits: string[];
  className?: string;
}

export const WhySection: React.FC<WhySectionProps> = ({ benefits, className = '' }) => {
  return (
    <section className={`py-12 sm:py-16 md:py-20 bg-martial-surface-1/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-martial-highlight mb-4 sm:mb-6">
              Pourquoi choisir la calisthénie ?
            </h2>
            <p className="text-martial-steel text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
              La calisthénie est l'art de s'entraîner avec son propre poids. 
              C'est accessible, efficace et permet de développer une force fonctionnelle 
              exceptionnelle.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start sm:items-center space-x-3">
                  <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-martial-success flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-sm sm:text-base text-martial-steel">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* CTA Card */}
          <div className="lg:text-center mt-6 lg:mt-0">
            <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-6 sm:p-8 shadow-martial-lg">
              <div className="text-center">
                <TrophyIcon className="h-16 w-16 sm:h-20 sm:w-20 text-martial-warning mx-auto mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl font-bold text-martial-highlight mb-3 sm:mb-4">
                  Prêt à commencer ?
                </h3>
                <p className="text-sm sm:text-base text-martial-steel mb-4 sm:mb-6">
                  Rejoignez des milliers de pratiquants qui transforment leur corps 
                  avec la calisthénie.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center space-x-2 bg-martial-danger-accent hover:bg-martial-danger-light text-martial-highlight font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-lg transition-all duration-200 w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  aria-label="Créer mon compte"
                >
                  <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Créer mon compte</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
