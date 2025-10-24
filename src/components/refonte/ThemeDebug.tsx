'use client';

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export const ThemeDebug: React.FC = () => {
  const { theme } = useThemeStore();
  const [cssVars, setCssVars] = useState({
    accent: '',
    accentLight: '',
    accentRgb: ''
  });

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    setCssVars({
      accent: computedStyle.getPropertyValue('--theme-accent').trim(),
      accentLight: computedStyle.getPropertyValue('--theme-accent-light').trim(),
      accentRgb: computedStyle.getPropertyValue('--theme-accent-rgb').trim()
    });
  }, [theme]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 shadow-martial-lg max-w-xs">
      <h3 className="text-sm font-semibold text-martial-highlight mb-3">
        Debug Thème
      </h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-martial-steel">Thème actuel:</span>
          <span className="text-martial-danger-accent font-medium ml-2">{theme}</span>
        </div>
        
        <div>
          <span className="text-martial-steel">--theme-accent:</span>
          <span className="text-martial-highlight ml-2">{cssVars.accent}</span>
        </div>
        
        <div>
          <span className="text-martial-steel">--theme-accent-light:</span>
          <span className="text-martial-highlight ml-2">{cssVars.accentLight}</span>
        </div>
        
        <div>
          <span className="text-martial-steel">--theme-accent-rgb:</span>
          <span className="text-martial-highlight ml-2">{cssVars.accentRgb}</span>
        </div>
      </div>
      
      {/* Test des couleurs */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: cssVars.accent }}
          />
          <span className="text-xs text-martial-steel">Accent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: cssVars.accentLight }}
          />
          <span className="text-xs text-martial-steel">Accent Light</span>
        </div>
      </div>
      
      {/* Test des classes */}
      <div className="mt-4 space-y-2">
        <button className="martial-btn-theme w-full text-xs">
          Test Bouton
        </button>
        <div className="martial-card-theme p-2">
          <span className="text-xs text-martial-highlight">Test Carte</span>
        </div>
        <a href="#" className="martial-link-theme text-xs block">
          Test Lien
        </a>
      </div>
    </div>
  );
};

export default ThemeDebug;
