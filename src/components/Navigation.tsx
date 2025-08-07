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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-sport-accent rounded-lg">
              <DocumentMagnifyingGlassIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold sport-text-gradient">
              Calisthénie Tracker
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {protectedLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-sport-accent transition-colors duration-200"
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Boutons d'authentification */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-sport-accent" />
                  <span className="text-sm text-gray-300">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 sport-btn-secondary text-sm py-2 px-4"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="sport-btn-secondary text-sm py-2 px-4"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="sport-btn-primary text-sm py-2 px-4"
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
        <div className="md:hidden bg-sport-secondary border-t border-sport-gray-light">
          <div className="px-4 py-4 space-y-4">
            {protectedLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 py-2 text-gray-300 hover:text-sport-accent transition-colors duration-200"
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-sport-gray-light pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 py-2">
                    <UserIcon className="h-5 w-5 text-sport-accent" />
                    <span className="text-sm text-gray-300">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full sport-btn-secondary text-sm justify-center"
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
                    className="block w-full sport-btn-secondary text-sm text-center"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full sport-btn-primary text-sm text-center"
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