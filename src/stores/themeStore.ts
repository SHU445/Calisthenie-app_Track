import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'dark' | 'violet' | 'green' | 'blue';

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme: ThemeType) => {
        set({ theme });
        // Appliquer le thème au document
        if (typeof window !== 'undefined') {
          const html = document.documentElement;
          // Retirer tous les thèmes
          html.classList.remove('theme-dark', 'theme-violet', 'theme-green', 'theme-blue');
          // Ajouter le nouveau thème
          html.classList.add(`theme-${theme}`);
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

