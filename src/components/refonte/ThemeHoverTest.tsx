'use client';

import React from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { 
  HeartIcon, 
  StarIcon, 
  FireIcon, 
  BoltIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
  PlayIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export const ThemeHoverTest: React.FC = () => {
  const { theme } = useThemeStore();

  const testItems = [
    { icon: HeartIcon, name: 'Carte Test 1', color: 'text-red-500' },
    { icon: StarIcon, name: 'Carte Test 2', color: 'text-yellow-500' },
    { icon: FireIcon, name: 'Carte Test 3', color: 'text-orange-500' },
    { icon: BoltIcon, name: 'Carte Test 4', color: 'text-blue-500' },
  ];

  const navigationItems = [
    { icon: BookOpenIcon, name: 'Exercices', href: '/exercices' },
    { icon: PlayIcon, name: 'Entraînements', href: '/entrainements' },
    { icon: ChartBarIcon, name: 'Progrès', href: '/progres' },
    { icon: Cog6ToothIcon, name: 'Paramètres', href: '/parametres' },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 shadow-martial-lg max-w-sm">
      <h3 className="text-sm font-semibold text-martial-highlight mb-3">
        Test Hover Thématique
      </h3>
      
      <div className="text-xs text-martial-steel mb-3">
        Thème actuel: <span className="text-martial-danger-accent font-medium">{theme}</span>
      </div>
      
      {/* Test des cartes */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-medium text-martial-steel">Cartes :</h4>
        {testItems.map((item, index) => (
          <div key={index} className="martial-card-theme p-3">
            <div className="flex items-center space-x-3">
              <div className="martial-icon-theme">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <span className="text-sm text-martial-highlight group-hover:text-accent transition-colors duration-200">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Test de la navigation */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-medium text-martial-steel">Navigation :</h4>
        {navigationItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center space-x-2 text-martial-steel hover-theme-accent transition-theme text-sm py-1 px-2 rounded"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
      
      {/* Test des boutons et liens */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-martial-steel">Actions :</h4>
        <button className="martial-btn-theme w-full text-sm">
          Bouton Test
        </button>
        <a href="#" className="martial-link-theme text-sm block">
          Lien Test
        </a>
      </div>
      
      <div className="mt-3 text-xs text-martial-steel">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-3 w-3 text-green-500" />
          <span>Hover adaptatif activé</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeHoverTest;
