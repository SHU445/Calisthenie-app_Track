'use client';

import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { signIn, signOut, useSession } from 'next-auth/react';

interface AuthStore extends AuthState {}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        set({ 
          error: 'Nom d\'utilisateur ou mot de passe incorrect',
          isLoading: false 
        });
        return false;
      }

      if (result?.ok) {
        set({ 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true;
      }

      set({ 
        error: 'Erreur lors de la connexion',
        isLoading: false 
      });
      return false;
    } catch (error) {
      set({ 
        error: 'Erreur lors de la connexion',
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut({ redirect: false });
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Erreur lors de la déconnexion',
        isLoading: false 
      });
    }
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
        // Connecter automatiquement l'utilisateur avec NextAuth
        const result = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (result?.ok) {
          set({ 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        }
      }

      set({ 
        error: data.error || 'Erreur lors de l\'inscription',
        isLoading: false 
      });
      return false;
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
  },

  // Méthode pour synchroniser avec la session NextAuth
  syncWithSession: (session: any) => {
    if (session?.user) {
      set({ 
        user: {
          id: session.user.id,
          username: session.user.username || session.user.name,
          email: session.user.email,
        },
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  }
}));  