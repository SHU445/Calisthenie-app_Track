'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentMagnifyingGlassIcon, InformationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-martial-surface-1/90 border-t border-martial-steel/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Branding */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-martial-danger-accent rounded-lg">
                <DocumentMagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-martial-highlight" />
              </div>
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-martial-danger-accent to-martial-steel bg-clip-text text-transparent">
                Calisthénie Tracker
              </span>
            </div>
            <p className="text-martial-steel text-xs sm:text-sm leading-relaxed">
              Compagnon d'entraînement pour la calisthénie. 
              Suivez vos progrès, découvrez de nouveaux exercices et 
              atteignez vos objectifs.
            </p>
            <div className="flex items-center space-x-1 text-xs sm:text-sm text-martial-steel">
              <span>Créé pour la communauté sportive</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-martial-highlight text-xs sm:text-sm uppercase tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-martial-steel hover-theme-accent transition-theme text-xs sm:text-sm inline-block py-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/exercices" 
                  className="text-martial-steel hover-theme-accent transition-theme text-xs sm:text-sm inline-block py-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded"
                >
                  Base d'exercices
                </Link>
              </li>
              <li>
                <Link 
                  href="/entrainements" 
                  className="text-martial-steel hover-theme-accent transition-theme text-xs sm:text-sm inline-block py-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded"
                >
                  Mes entraînements
                </Link>
              </li>
              <li>
                <Link 
                  href="/progres" 
                  className="text-martial-steel hover-theme-accent transition-theme text-xs sm:text-sm inline-block py-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded"
                >
                  Suivi des progrès
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-martial-highlight text-xs sm:text-sm uppercase tracking-wide">
              À propos
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li className="flex items-center space-x-2 text-martial-steel text-xs sm:text-sm py-1">
                <InformationCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Application de sport | Callisthenics | Street Workout</span>
              </li>
              <li className="flex items-center space-x-2 text-martial-steel text-xs sm:text-sm py-1">
                <ShieldCheckIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Données stockées sur Néon</span>
              </li>
              <li className="text-martial-steel text-xs sm:text-sm py-1">
                Version 1.0.0
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-martial-steel/20 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            <div className="text-martial-steel text-xs sm:text-sm">
              © {currentYear} Calisthénie Tracker.
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <span className="text-martial-steel text-xs sm:text-sm">
                Construit avec Next.js & Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
