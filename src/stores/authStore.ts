import { create } from 'zustand';
import { AuthState, User } from '@/types';

interface AuthStore extends AuthState {}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true;
      } else {
        set({ 
          error: data.error || 'Erreur lors de la connexion',
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: 'Erreur lors de la connexion',
        isLoading: false 
      });
      return false;
    }
  },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      register: async (username: string, email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Connecter automatiquement l'utilisateur
            set({ 
              user: data.user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          } else {
            set({ 
              error: data.error || 'Erreur lors de l\'inscription',
              isLoading: false 
            });
            return false;
          }
        } catch (error) {
          set({ 
            error: 'Erreur lors de l\'inscription',
            isLoading: false 
          });
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }
));  