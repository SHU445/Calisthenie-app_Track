'use client';

import React from 'react';
import Link from 'next/link';
import {
  HeartIcon,
  DocumentMagnifyingGlassIcon,
  InformationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sport-primary/90 border-t border-sport-gray-light mt-auto">
      <div className="sport-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-sport-accent rounded-lg">
                <DocumentMagnifyingGlassIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold sport-text-gradient">
                Calisthénie Tracker
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre compagnon d'entraînement pour la calisthénie. 
              Suivez vos progrès, découvrez de nouveaux exercices et 
              atteignez vos objectifs fitness.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Créé avec</span>
              <HeartIcon className="h-4 w-4 text-sport-accent" />
              <span>pour la communauté sportive</span>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-sport-accent transition-colors duration-200 text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/exercices" 
                  className="text-gray-400 hover:text-sport-accent transition-colors duration-200 text-sm"
                >
                  Base d'exercices
                </Link>
              </li>
              <li>
                <Link 
                  href="/entrainements" 
                  className="text-gray-400 hover:text-sport-accent transition-colors duration-200 text-sm"
                >
                  Mes entraînements
                </Link>
              </li>
              <li>
                <Link 
                  href="/progres" 
                  className="text-gray-400 hover:text-sport-accent transition-colors duration-200 text-sm"
                >
                  Suivi des progrès
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
              À propos
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <InformationCircleIcon className="h-4 w-4" />
                <span>Application de fitness</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Données stockées localement</span>
              </li>
              <li className="text-gray-400 text-sm">
                Version 1.0.0
              </li>
            </ul>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="border-t border-sport-gray-light mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Calisthénie Tracker. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">
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