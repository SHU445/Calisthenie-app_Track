'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        setIsLoading(false);
        return false;
      }

      if (result?.ok) {
        router.push('/');
        return true;
      }

      return false;
    } catch (error) {
      setError('Erreur lors de la connexion');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
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
          router.push('/');
          return true;
        }
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
        setIsLoading(false);
        return false;
      }

      return false;
    } catch (error) {
      setError('Erreur lors de l\'inscription');
      setIsLoading(false);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    isLoading: isLoading || status === 'loading',
    error,
    login,
    logout,
    register,
    clearError,
  };
}