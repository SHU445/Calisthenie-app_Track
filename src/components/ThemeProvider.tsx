'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Retirer tous les thèmes
    document.documentElement.classList.remove('theme-dark', 'theme-violet', 'theme-green', 'theme-blue');
    // Appliquer le nouveau thème
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return <>{children}</>;
}

