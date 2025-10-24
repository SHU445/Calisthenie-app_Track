'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Bars3Icon, 
  XMarkIcon, 
  BookOpenIcon, 
  PlayIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Ne pas afficher le header sur les pages de connexion et d'inscription
  const hideHeader = pathname === '/auth/login' || pathname === '/auth/register';
  
  if (hideHeader) {
    return null;
  }
  
  // Gérer l'affichage du header lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Afficher le header si on scrolle vers le haut
      if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      } 
      // Cacher le header si on scrolle vers le bas et qu'on a scrollé plus de 100px
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
        setIsUserMenuOpen(false); // Fermer le menu utilisateur
        setIsMenuOpen(false); // Fermer le menu mobile
      }
      
      // Toujours afficher le header en haut de page
      if (currentScrollY < 100) {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Fermer le menu utilisateur quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Logo - position absolue en haut à gauche (ne bouge pas lors du scroll) */}
      <Link 
        href="/" 
        className="absolute pointer-events-auto z-50 flex items-center space-x-2 sm:space-x-3 group"
        aria-label="Accueil Calisthénie Tracker"
        style={{ top: '3cm', left: '1.5cm' }}
      >
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-martial-danger-accent rounded-lg group-hover:scale-105 transition-transform duration-200 shadow-martial-lg">
          <DocumentMagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-martial-highlight" />
        </div>
        <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-martial-danger-accent to-martial-steel bg-clip-text text-transparent hidden sm:block">
          Calisthénie Tracker
        </span>
      </Link>

      {/* Menu utilisateur - position fixe en haut à droite (apparaît lors du scroll vers le haut) */}
      <div className={`fixed pointer-events-auto z-50 hidden md:flex items-center transition-all duration-300 ${
        showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`} style={{ top: '3cm', right: '1.5cm' }}>
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center justify-center text-martial-steel hover-theme-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-lg px-4 py-2 min-h-[44px] min-w-[44px] text-2xl font-bold bg-martial-surface-1/90 backdrop-blur-sm shadow-martial-lg border border-martial-steel/20"
                  aria-label="Menu utilisateur"
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="leading-none">≡</span>
                </button>

                {/* Dropdown menu utilisateur */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-martial-surface-1 border border-martial-steel/20 rounded-lg shadow-martial-lg py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-martial-steel/20">
                      <p className="text-sm font-medium text-martial-highlight">{user?.username}</p>
                      <p className="text-xs text-martial-steel">Compte utilisateur</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/exercices"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-colors duration-200"
                      >
                        <BookOpenIcon className="h-4 w-4" />
                        <span>Exercices</span>
                      </Link>
                      <Link
                        href="/entrainements"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-colors duration-200"
                      >
                        <PlayIcon className="h-4 w-4" />
                        <span>Entraînements</span>
                      </Link>
                      <Link
                        href="/progres"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-colors duration-200"
                      >
                        <ChartBarIcon className="h-4 w-4" />
                        <span>Progrès</span>
                      </Link>
                      <Link
                        href="/parametres"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-colors duration-200"
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span>Paramètres</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-martial-steel/20 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-martial-steel hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 w-full text-left"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/exercices"
                  className="text-martial-steel hover-theme-accent transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-3 py-2 flex items-center space-x-2 bg-martial-surface-1/90 backdrop-blur-sm shadow-martial-lg border border-martial-steel/20"
                >
                  <BookOpenIcon className="h-4 w-4" />
                  <span>Exercices</span>
                </Link>
                <Link
                  href="/auth/login"
                  className="text-martial-steel hover-theme-accent transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-3 py-2 bg-martial-surface-1/90 backdrop-blur-sm shadow-martial-lg border border-martial-steel/20"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center bg-martial-surface-1 hover:bg-martial-surface-hover text-martial-highlight border border-martial-steel/30 hover-theme-accent-border font-medium py-2 px-4 rounded-lg transition-theme text-sm focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg min-h-[44px] shadow-martial-lg"
                >
                  Inscription
                </Link>
              </div>
            )}
      </div>

      {/* Menu mobile - bouton en haut à droite */}
      <button
        onClick={toggleMenu}
        className={`md:hidden fixed pointer-events-auto z-50 p-2 rounded-lg hover:bg-martial-surface-hover focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg min-h-[44px] min-w-[44px] bg-martial-surface-1/90 backdrop-blur-sm shadow-martial-lg border border-martial-steel/20 transition-all duration-300 ${
          showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        aria-label="Ouvrir le menu"
        aria-expanded={isMenuOpen}
        style={{ top: '3cm', right: '1.5cm' }}
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6 text-martial-highlight" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-martial-highlight" />
        )}
      </button>

      {/* Menu mobile - panneau déroulant depuis le haut à droite */}
      {isMenuOpen && showHeader && (
        <div className="md:hidden fixed pointer-events-auto z-40 w-72 bg-martial-surface-1 border border-martial-steel/20 rounded-lg shadow-martial-xl animate-fade-in" style={{ top: '5cm', right: '1.5cm' }}>
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-6cm)] overflow-y-auto martial-scrollbar">
            <div>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-3 px-3 rounded-lg text-martial-steel">
                    <UserIcon className="h-5 w-5 text-martial-danger-accent" />
                    <span className="text-base flex-1">{user?.username}</span>
                  </div>
                  
                  {/* Liens de navigation */}
                  <Link
                    href="/exercices"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-3 rounded-lg text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  >
                    <BookOpenIcon className="h-5 w-5" />
                    <span className="text-base">Exercices</span>
                  </Link>
                  
                  <Link
                    href="/entrainements"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-3 rounded-lg text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  >
                    <PlayIcon className="h-5 w-5" />
                    <span className="text-base">Entraînements</span>
                  </Link>
                  
                  <Link
                    href="/progres"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-3 rounded-lg text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                    <span className="text-base">Progrès</span>
                  </Link>
                  
                  <Link
                    href="/parametres"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-3 rounded-lg text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    <span className="text-base">Paramètres</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full bg-martial-surface-hover hover:bg-martial-danger-accent/10 text-martial-highlight border border-martial-steel/30 hover-theme-accent-border font-medium py-3 px-4 rounded-lg transition-theme justify-center min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/exercices"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-3 rounded-lg text-martial-steel hover-theme-accent hover:bg-martial-surface-hover transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  >
                    <BookOpenIcon className="h-5 w-5" />
                    <span className="text-base">Exercices</span>
                  </Link>
                  
                  <div className="border-t border-martial-steel/20 pt-3 mt-3 space-y-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center text-martial-steel hover-theme-accent transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-martial-surface-hover min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center martial-btn-theme font-semibold py-3 px-4 rounded-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                    >
                      Inscription
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
