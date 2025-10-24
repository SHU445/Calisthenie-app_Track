'use client';

import React from 'react';
import { useThemeStore } from '@/stores/themeStore';

export const ThemeTest: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { id: 'dark', name: 'Mode Sombre', color: '#9E1B1B' },
    { id: 'violet', name: 'Mode Violet', color: '#8B5CF6' },
    { id: 'green', name: 'Mode Vert', color: '#10B981' },
    { id: 'blue', name: 'Mode Bleu', color: '#3B82F6' }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 shadow-martial-lg">
      <h3 className="text-sm font-semibold text-martial-highlight mb-3">Test Thèmes</h3>
      <div className="space-y-2">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id as any)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
              theme === themeOption.id
                ? 'bg-martial-danger-accent text-martial-highlight'
                : 'text-martial-steel hover:text-martial-highlight hover:bg-martial-surface-hover'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: themeOption.color }}
              />
              <span>{themeOption.name}</span>
              {theme === themeOption.id && (
                <span className="ml-auto text-xs">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Test des couleurs du thème actuel */}
      <div className="mt-4 pt-3 border-t border-martial-steel/20">
        <p className="text-xs text-martial-steel mb-2">Couleurs actuelles :</p>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-martial-danger-accent rounded"></div>
            <span className="text-xs text-martial-steel">Accent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-martial-highlight rounded"></div>
            <span className="text-xs text-martial-steel">Highlight</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-martial-steel rounded"></div>
            <span className="text-xs text-martial-steel">Steel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;
