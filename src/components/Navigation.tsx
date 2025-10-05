'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  PlayIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: '/', label: 'Accueil', icon: HomeIcon },
    { href: '/exercices', label: 'Exercices', icon: BookOpenIcon },
    { href: '/entrainements', label: 'Entraînements', icon: PlayIcon },
    { href: '/progres', label: 'Progrès', icon: ChartBarIcon },
  ];

  const protectedLinks = isAuthenticated ? navLinks : [navLinks[0], navLinks[1]];

  return (
    <nav className="sport-navbar sticky top-0 z-40">
      <div className="sport-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-sport-accent rounded-lg">
              <DocumentMagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-base sm:text-xl font-bold sport-text-gradient hidden xs:block sm:block">
              Calisthénie Tracker
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {protectedLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-sport-accent transition-colors duration-200 text-sm lg:text-base"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Boutons d'authentification */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 lg:h-5 lg:w-5 text-sport-accent" />
                  <span className="text-xs lg:text-sm text-gray-300 max-w-[100px] truncate">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 lg:space-x-2 sport-btn-secondary text-xs lg:text-sm py-2 px-3 lg:px-4"
                >
                  <ArrowRightOnRectangleIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden lg:inline">Déconnexion</span>
                  <span className="lg:hidden">Sortir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Link
                  href="/auth/login"
                  className="sport-btn-secondary text-xs lg:text-sm py-2 px-3 lg:px-4"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="sport-btn-primary text-xs lg:text-sm py-2 px-3 lg:px-4"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg sport-hover"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-sport-secondary border-t border-sport-gray-light animate-fade-in">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
            {protectedLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 py-3 px-3 rounded-lg text-gray-300 hover:text-sport-accent hover:bg-sport-primary/50 transition-all duration-200 touch-target"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-base">{link.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-sport-gray-light pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2 px-3">
                    <UserIcon className="h-5 w-5 text-sport-accent" />
                    <span className="text-sm text-gray-300">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full sport-btn-secondary justify-center touch-target"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full sport-btn-secondary text-center touch-target"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full sport-btn-primary text-center touch-target"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 