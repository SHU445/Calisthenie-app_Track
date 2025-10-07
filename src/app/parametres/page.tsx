'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import {
  UserCircleIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  KeyIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { 
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/24/solid';

export default function ParametresPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Redirection si non connecté
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-12">
      {/* En-tête avec gradient de fond */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sport-accent/20 via-sport-primary to-sport-secondary"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sport-accent/10 via-transparent to-transparent"></div>
        
        <div className="sport-container relative py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.back()}
                className="p-3 rounded-xl sport-hover bg-sport-secondary/80 backdrop-blur-sm border border-sport-gray-light/30 transition-all duration-300 hover:scale-105 hover:bg-sport-accent/20"
                aria-label="Retour"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold sport-text-gradient mb-2 animate-fade-in">
                  Paramètres
                </h1>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-sport-accent" />
                  Personnalisez votre expérience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sport-container -mt-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Section Compte */}
          <div className="sport-card group hover:shadow-2xl hover:shadow-sport-accent/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sport-accent/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-sport-accent/20 to-sport-accent/5 rounded-xl">
                  <UserCircleIconSolid className="h-7 w-7 text-sport-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mon Compte</h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <ShieldCheckIcon className="h-3 w-3" />
                    Informations sécurisées
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="group/item">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2">
                    <UserCircleIcon className="h-4 w-4" />
                    Nom d'utilisateur
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-sport-primary/50 to-sport-secondary/30 rounded-xl border border-sport-gray-light/20 hover:border-sport-accent/40 transition-all duration-300 group-hover/item:scale-[1.02]">
                    <div className="p-2 bg-sport-accent/10 rounded-lg">
                      <UserCircleIcon className="h-5 w-5 text-sport-accent" />
                    </div>
                    <span className="text-gray-100 font-medium">{user.username}</span>
                    <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-auto" />
                  </div>
                </div>

                <div className="group/item">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    Adresse email
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-sport-primary/50 to-sport-secondary/30 rounded-xl border border-sport-gray-light/20 hover:border-sport-accent/40 transition-all duration-300 group-hover/item:scale-[1.02]">
                    <div className="p-2 bg-sport-accent/10 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-sport-accent" />
                    </div>
                    <span className="text-gray-100 font-medium">{user.email}</span>
                  </div>
                </div>

                <div className="group/item">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2">
                    <KeyIcon className="h-4 w-4" />
                    Mot de passe
                  </label>
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-sport-primary/50 to-sport-secondary/30 rounded-xl w-full border border-sport-gray-light/20 hover:border-sport-accent/40 transition-all duration-300 group-hover/item:scale-[1.02]"
                  >
                    <div className="p-2 bg-sport-accent/10 rounded-lg">
                      <KeyIcon className="h-5 w-5 text-sport-accent" />
                    </div>
                    <span className="text-gray-100 font-medium">••••••••</span>
                    <span className="ml-auto text-sm font-semibold text-sport-accent bg-sport-accent/10 px-3 py-1 rounded-full">
                      {isChangingPassword ? 'Annuler' : 'Modifier'}
                    </span>
                  </button>

                  {isChangingPassword && (
                    <div className="mt-4 p-5 bg-sport-secondary/50 rounded-xl border border-sport-accent/20 space-y-4 animate-fade-in backdrop-blur-sm">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          className="sport-input w-full bg-sport-primary/80"
                          placeholder="Minimum 8 caractères"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          className="sport-input w-full bg-sport-primary/80"
                          placeholder="Confirmez votre nouveau mot de passe"
                        />
                      </div>
                      <button className="sport-btn-primary w-full py-3 font-semibold hover:scale-[1.02] transition-transform">
                        <KeyIcon className="h-4 w-4 inline mr-2" />
                        Enregistrer le nouveau mot de passe
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Thème */}
          <div className="sport-card group hover:shadow-2xl hover:shadow-sport-accent/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sport-accent/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-sport-accent/20 to-sport-accent/5 rounded-xl">
                  <SparklesIcon className="h-7 w-7 text-sport-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Apparence</h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <SparklesIcon className="h-3 w-3" />
                    Personnalisez votre interface
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <label className="block text-sm font-semibold text-gray-300 mb-4">
                  Sélectionnez votre thème préféré
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Thème Rouge (Dark) */}
                  <button
                    onClick={() => setTheme('dark')}
                    className={`group/theme p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      theme === 'dark'
                        ? 'border-sport-accent bg-gradient-to-br from-sport-accent/20 to-sport-accent/5 shadow-lg shadow-sport-accent/20 scale-105'
                        : 'border-sport-gray-light/30 bg-sport-primary/30 hover:border-sport-accent/50 hover:scale-105'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-900/10 opacity-0 group-hover/theme:opacity-100 transition-opacity"></div>
                    
                    <div className="relative flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        theme === 'dark' 
                          ? 'bg-[#9E1B1B]/20 scale-110' 
                          : 'bg-sport-secondary/50 group-hover/theme:bg-[#9E1B1B]/10'
                      }`}>
                        <div className="h-10 w-10 rounded-full bg-[#9E1B1B]"></div>
                      </div>
                      <div className="text-center">
                        <span className="font-bold text-lg block">Rouge</span>
                        <span className="text-xs text-gray-400 block mt-1">Thème par défaut</span>
                      </div>
                      {theme === 'dark' && (
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="bg-[#9E1B1B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <CheckBadgeIcon className="h-4 w-4" />
                            Actif
                          </div>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Thème Violet */}
                  <button
                    onClick={() => setTheme('violet')}
                    className={`group/theme p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      theme === 'violet'
                        ? 'border-[#8B5CF6] bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 shadow-lg shadow-[#8B5CF6]/20 scale-105'
                        : 'border-sport-gray-light/30 bg-sport-primary/30 hover:border-[#8B5CF6]/50 hover:scale-105'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-600/10 opacity-0 group-hover/theme:opacity-100 transition-opacity"></div>
                    
                    <div className="relative flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        theme === 'violet' 
                          ? 'bg-[#8B5CF6]/20 scale-110' 
                          : 'bg-sport-secondary/50 group-hover/theme:bg-[#8B5CF6]/10'
                      }`}>
                        <div className="h-10 w-10 rounded-full bg-[#8B5CF6]"></div>
                      </div>
                      <div className="text-center">
                        <span className="font-bold text-lg block">Violet</span>
                        <span className="text-xs text-gray-400 block mt-1">Mystique</span>
                      </div>
                      {theme === 'violet' && (
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="bg-[#8B5CF6] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <CheckBadgeIcon className="h-4 w-4" />
                            Actif
                          </div>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Thème Vert */}
                  <button
                    onClick={() => setTheme('green')}
                    className={`group/theme p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      theme === 'green'
                        ? 'border-[#10B981] bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 shadow-lg shadow-[#10B981]/20 scale-105'
                        : 'border-sport-gray-light/30 bg-sport-primary/30 hover:border-[#10B981]/50 hover:scale-105'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover/theme:opacity-100 transition-opacity"></div>
                    
                    <div className="relative flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        theme === 'green' 
                          ? 'bg-[#10B981]/20 scale-110' 
                          : 'bg-sport-secondary/50 group-hover/theme:bg-[#10B981]/10'
                      }`}>
                        <div className="h-10 w-10 rounded-full bg-[#10B981]"></div>
                      </div>
                      <div className="text-center">
                        <span className="font-bold text-lg block">Vert</span>
                        <span className="text-xs text-gray-400 block mt-1">Naturel</span>
                      </div>
                      {theme === 'green' && (
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="bg-[#10B981] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <CheckBadgeIcon className="h-4 w-4" />
                            Actif
                          </div>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Thème Bleu */}
                  <button
                    onClick={() => setTheme('blue')}
                    className={`group/theme p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      theme === 'blue'
                        ? 'border-[#3B82F6] bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5 shadow-lg shadow-[#3B82F6]/20 scale-105'
                        : 'border-sport-gray-light/30 bg-sport-primary/30 hover:border-[#3B82F6]/50 hover:scale-105'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover/theme:opacity-100 transition-opacity"></div>
                    
                    <div className="relative flex flex-col items-center gap-4">
                      <div className={`p-4 rounded-2xl transition-all duration-300 ${
                        theme === 'blue' 
                          ? 'bg-[#3B82F6]/20 scale-110' 
                          : 'bg-sport-secondary/50 group-hover/theme:bg-[#3B82F6]/10'
                      }`}>
                        <div className="h-10 w-10 rounded-full bg-[#3B82F6]"></div>
                      </div>
                      <div className="text-center">
                        <span className="font-bold text-lg block">Bleu</span>
                        <span className="text-xs text-gray-400 block mt-1">Énergique</span>
                      </div>
                      {theme === 'blue' && (
                        <div className="absolute -top-2 -right-2 animate-bounce">
                          <div className="bg-[#3B82F6] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <CheckBadgeIcon className="h-4 w-4" />
                            Actif
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-sport-accent/10 to-transparent rounded-xl border-l-4 border-sport-accent">
                  <p className="text-sm text-gray-300 flex items-start gap-2">
                    <SparklesIcon className="h-5 w-5 text-sport-accent flex-shrink-0 mt-0.5" />
                    <span>
                      {theme === 'dark' && 'Thème rouge classique avec ambiance martiale et sombre'}
                      {theme === 'violet' && 'Thème violet mystique conservant l\'aspect sombre et métallique'}
                      {theme === 'green' && 'Thème vert naturel avec l\'élégance du design métallique'}
                      {theme === 'blue' && 'Thème bleu énergique allié à la sophistication martiale'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Informations */}
          <div className="sport-card group hover:shadow-2xl hover:shadow-sport-accent/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sport-accent/20 to-sport-accent/5 rounded-xl">
                <ShieldCheckIcon className="h-7 w-7 text-sport-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Informations</h2>
                <p className="text-xs text-gray-400">Détails de votre compte</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-sport-primary/50 to-sport-secondary/30 rounded-xl border border-sport-gray-light/20 hover:border-sport-accent/40 transition-all">
                <p className="text-xs text-gray-400 mb-1">Version de l'application</p>
                <p className="text-lg font-bold text-sport-accent">v1.0.0</p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-sport-primary/50 to-sport-secondary/30 rounded-xl border border-sport-gray-light/20 hover:border-sport-accent/40 transition-all">
                <p className="text-xs text-gray-400 mb-1">Membre depuis</p>
                <p className="text-lg font-bold text-sport-accent">
                  {new Date(user.dateCreation || Date.now()).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

