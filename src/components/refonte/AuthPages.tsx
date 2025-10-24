'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from './Header';
import { Footer } from './Footer';
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Composant de formulaire de connexion
const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    const success = await login(formData.username, formData.password);
    
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-martial-primary-bg">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-8 shadow-martial-lg">
            {/* Logo et titre */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-martial-danger-accent rounded-full mx-auto mb-4">
                <DocumentMagnifyingGlassIcon className="h-8 w-8 text-martial-highlight" />
              </div>
              <h1 className="text-2xl font-bold text-martial-highlight mb-2">
                Connexion
              </h1>
              <p className="text-martial-steel">
                Connectez-vous à votre compte Calisthénie Tracker
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom d'utilisateur */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-martial-danger-accent mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-martial-steel" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
                    placeholder="Votre nom d'utilisateur"
                    required
                    aria-label="Nom d'utilisateur"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-martial-danger-accent mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-martial-steel" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
                    placeholder="Votre mot de passe"
                    required
                    aria-label="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-martial-steel hover:text-martial-highlight transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
                className="w-full bg-martial-danger-accent hover:bg-martial-danger-light disabled:bg-martial-steel/20 disabled:text-martial-steel text-martial-highlight font-semibold py-3 px-6 rounded-lg transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-martial-highlight"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Se connecter</span>
                  </div>
                )}
              </button>
            </form>

            {/* Lien vers inscription */}
            <div className="mt-6 text-center">
              <p className="text-martial-steel text-sm">
                Pas encore de compte ?{' '}
                <Link
                  href="/auth/register"
                  className="text-martial-danger-accent hover:text-martial-danger-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-1 py-0.5"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Composant de formulaire d'inscription
const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login?registered=true');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-martial-primary-bg">
        <Header />
        
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-4">
            <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-8 shadow-martial-lg text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-martial-success rounded-full mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-martial-highlight" />
              </div>
              <h1 className="text-2xl font-bold text-martial-highlight mb-2">
                Inscription réussie !
              </h1>
              <p className="text-martial-steel mb-6">
                Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-martial-danger-accent mx-auto"></div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-martial-primary-bg">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-8 shadow-martial-lg">
            {/* Logo et titre */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-martial-danger-accent rounded-full mx-auto mb-4">
                <DocumentMagnifyingGlassIcon className="h-8 w-8 text-martial-highlight" />
              </div>
              <h1 className="text-2xl font-bold text-martial-highlight mb-2">
                Inscription
              </h1>
              <p className="text-martial-steel">
                Créez votre compte Calisthénie Tracker
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom d'utilisateur */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-martial-danger-accent mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-martial-steel" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
                    placeholder="Choisissez un nom d'utilisateur"
                    required
                    aria-label="Nom d'utilisateur"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-martial-danger-accent mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
                  placeholder="votre@email.com"
                  required
                  aria-label="Adresse email"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-martial-danger-accent mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-martial-steel" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
                    placeholder="Minimum 6 caractères"
                    required
                    aria-label="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-martial-steel hover:text-martial-highlight transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-martial-danger-accent mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-martial-steel" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
                    placeholder="Confirmez votre mot de passe"
                    required
                    aria-label="Confirmer le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-martial-steel hover:text-martial-highlight transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md"
                    aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={isLoading || !formData.username.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()}
                className="w-full bg-martial-danger-accent hover:bg-martial-danger-light disabled:bg-martial-steel/20 disabled:text-martial-steel text-martial-highlight font-semibold py-3 px-6 rounded-lg transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-martial-highlight"></div>
                    <span>Création du compte...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>Créer mon compte</span>
                  </div>
                )}
              </button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-6 text-center">
              <p className="text-martial-steel text-sm">
                Déjà un compte ?{' '}
                <Link
                  href="/auth/login"
                  className="text-martial-danger-accent hover:text-martial-danger-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-1 py-0.5"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { LoginForm, RegisterForm };
