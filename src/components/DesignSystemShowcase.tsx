import React, { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';
import { 
  HomeMockup, 
  WorkoutPlayerMockup, 
  LibraryMockup, 
  ScheduleEditorDemo, 
  ProfileMockup,
  UIShowcase,
  LogoShowcase 
} from './mockups';
import {
  HomeIcon,
  PlayIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  UserIcon,
  SwatchIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const DesignSystemShowcase: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'logos' | 'ui' | 'home' | 'player' | 'library' | 'schedule' | 'profile'>('overview');

  const sections = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: SparklesIcon },
    { id: 'logos', label: 'Logos', icon: SwatchIcon },
    { id: 'ui', label: 'Composants UI', icon: SwatchIcon },
    { id: 'home', label: 'Écran Home', icon: HomeIcon },
    { id: 'player', label: 'Workout Player', icon: PlayIcon },
    { id: 'library', label: 'Library', icon: BookOpenIcon },
    { id: 'schedule', label: 'Schedule Editor', icon: CalendarDaysIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'logos':
        return <LogoShowcase />;
      case 'ui':
        return <UIShowcase />;
      case 'home':
        return <HomeMockup />;
      case 'player':
        return <WorkoutPlayerMockup />;
      case 'library':
        return <LibraryMockup />;
      case 'schedule':
        return <ScheduleEditorDemo />;
      case 'profile':
        return <ProfileMockup />;
      default:
        return (
          <div className="p-8 bg-martial-primary-bg min-h-screen">
            <div className="max-w-6xl mx-auto">
              <header className="text-center mb-12">
                <h1 className="text-5xl font-display font-black text-martial-highlight mb-6">
                  DESIGN SYSTEM MARTIAL
                </h1>
                <p className="text-xl text-martial-steel max-w-4xl mx-auto leading-relaxed">
                  Interface modernisée pour application de calisthénie avec ambiance martiale : 
                  discipline, intensité, ordre. Ergonomie préservée, motivation renforcée.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <Card variant="hero" texture="metal">
                  <CardHeader>
                    <CardTitle>🎨 Palette Martiale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-martial-primary-bg rounded border border-martial-steel/30"></div>
                        <span className="text-sm text-martial-steel">Primary BG #0B0F12</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-martial-surface-1 rounded border border-martial-steel/30"></div>
                        <span className="text-sm text-martial-steel">Surface #13171A</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-martial-steel rounded"></div>
                        <span className="text-sm text-martial-steel">Steel #AEB6BD</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-martial-danger-accent rounded"></div>
                        <span className="text-sm text-martial-steel">Danger #9E1B1B</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-martial-highlight rounded border border-martial-steel/30"></div>
                        <span className="text-sm text-martial-steel">Highlight #DFD9CB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="hero" texture="grain">
                  <CardHeader>
                    <CardTitle>✍️ Typographie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="font-display text-2xl font-black text-martial-highlight mb-1">
                          BEBAS NEUE
                        </div>
                        <div className="text-xs text-martial-steel">Titres & Display</div>
                      </div>
                      <div>
                        <div className="font-body text-lg text-martial-highlight mb-1">
                          Inter / Poppins
                        </div>
                        <div className="text-xs text-martial-steel">Corps de texte & UI</div>
                      </div>
                      <div className="text-stamped text-martial-danger-accent text-sm">
                        EFFET TAMPON
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="hero">
                  <CardHeader>
                    <CardTitle>📐 Grille 8px</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-martial-steel">XS</span>
                        <div className="w-1 h-4 bg-martial-steel"></div>
                        <span className="text-xs text-martial-steel">4px</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-martial-steel">SM</span>
                        <div className="w-2 h-4 bg-martial-steel"></div>
                        <span className="text-xs text-martial-steel">8px</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-martial-steel">MD</span>
                        <div className="w-4 h-4 bg-martial-steel"></div>
                        <span className="text-xs text-martial-steel">16px</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-martial-steel">LG</span>
                        <div className="w-6 h-4 bg-martial-steel"></div>
                        <span className="text-xs text-martial-steel">24px</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-martial-steel">XL</span>
                        <div className="w-8 h-4 bg-martial-steel"></div>
                        <span className="text-xs text-martial-steel">32px</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card variant="emergency" className="text-center p-8 mb-8">
                <h2 className="text-2xl font-display font-black text-martial-highlight mb-4 uppercase">
                  "Discipline. Répète."
                </h2>
                <p className="text-martial-steel">
                  Interface alliant esthétique militaire et ergonomie moderne pour maximiser la motivation d'entraînement.
                </p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card variant="stats">
                  <CardHeader>
                    <CardTitle>🛠️ Composants Livrés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-martial-steel">
                      <li>• 3 propositions de logos (chevron, silhouette, médaille)</li>
                      <li>• Design System complet avec tokens</li>
                      <li>• Composants atomiques (Button, Card, Input, Badge)</li>
                      <li>• 5 mockups d'écrans interactifs</li>
                      <li>• Modal Schedule Editor avec drag & drop</li>
                      <li>• Documentation développeur complète</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="stats">
                  <CardHeader>
                    <CardTitle>🎯 Objectifs Atteints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-martial-steel">
                      <li>• ✅ Ambiance martiale préservant l'ergonomie</li>
                      <li>• ✅ Lecture facilitée des séances</li>
                      <li>• ✅ Édition rapide du planning</li>
                      <li>• ✅ Mobile-first avec breakpoints optimisés</li>
                      <li>• ✅ Accessibilité WCAG AA+</li>
                      <li>• ✅ Micro-animations & feedback immédiat</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-martial-primary-bg">
      {/* Navigation */}
      <nav className="martial-navbar sticky top-0 z-50">
        <div className="martial-container h-16 flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-martial-highlight">
            DESIGN SYSTEM SHOWCASE
          </h1>
          
          <div className="hidden md:flex items-center space-x-1">
            {sections.map(section => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-display font-semibold text-sm transition-all ${
                    activeSection === section.id
                      ? 'bg-martial-danger-accent text-martial-highlight'
                      : 'text-martial-steel hover:text-martial-highlight hover:bg-martial-surface-hover'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value as any)}
              className="martial-input text-sm"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default DesignSystemShowcase;
