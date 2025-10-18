'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const { user, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  // Synchroniser l'état NextAuth avec le store Zustand
  useEffect(() => {
    if (status === 'loading') {
      useAuthStore.setState({ isLoading: true });
    } else if (status === 'authenticated' && session?.user) {
      useAuthStore.setState({
        user: {
          id: session.user.id ?? '',
          username: session.user.username ?? '',
          email: session.user.email ?? undefined,
          password: '', // Add a default or empty password to satisfy the type requirement
          dateCreation: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            units: 'metric',
            language: 'fr'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } else if (status === 'unauthenticated') {
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, [session, status]);

  const login = async (username: string, password: string) => {
    clearError();
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      useAuthStore.setState({
        error: 'Nom d\'utilisateur ou mot de passe incorrect',
        isLoading: false
      });
      return false;
    }

    return result?.ok || false;
  };

  const logout = async () => {
    await signOut({ redirect: false });
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      error: null
    });
  };

  const register = async (username: string, email: string, password: string) => {
    clearError();
    useAuthStore.setState({ isLoading: true });

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
        // Connecter automatiquement l'utilisateur après l'inscription
        const loginResult = await signIn('credentials', {
          username,
          password,
          redirect: false,
        });

        if (loginResult?.ok) {
          useAuthStore.setState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        }
      }

      useAuthStore.setState({
        error: data.error || 'Erreur lors de l\'inscription',
        isLoading: false
      });
      return false;
    } catch (error) {
      useAuthStore.setState({
        error: 'Erreur lors de l\'inscription',
        isLoading: false
      });
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || status === 'loading',
    error,
    login,
    logout,
    register,
    clearError
  };
}
