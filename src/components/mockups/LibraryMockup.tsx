import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  SearchInput,
  DifficultyBadge,
  CategoryBadge,
  Badge 
} from '../ui';
import { ChevronLogo } from '../logos';
import {
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  ClockIcon,
  FireIcon,
  UserGroupIcon,
  HeartIcon,
  EyeIcon,
  BookmarkIcon,
  ChevronDownIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const LibraryMockup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    level: [] as string[],
    muscle: [] as string[],
    equipment: [] as string[],
    duration: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteExercises, setFavoriteExercises] = useState<string[]>(['1', '3']);
  const [previewExercise, setPreviewExercise] = useState<string | null>(null);

  // Données d'exercices simulées
  const exercises = [
    {
      id: '1',
      name: 'POMPES EXPLOSIVES',
      description: 'Push-ups avec décollage des mains pour développer la puissance explosive du haut du corps',
      difficulty: 'advanced' as const,
      duration: '15 min',
      calories: 180,
      muscle: ['Pectoraux', 'Triceps', 'Épaules'],
      equipment: 'Aucun',
      category: 'Force',
      rating: 4.8,
      completions: 1247,
      thumbnail: '/api/placeholder/300/200',
      instructions: [
        'Position pompe classique',
        'Descente contrôlée 3 secondes',
        'Poussée explosive avec décollage',
        'Réception en douceur'
      ]
    },
    {
      id: '2',
      name: 'MOUNTAIN CLIMBERS',
      description: 'Cardio intense en position planche pour le core et la condition physique',
      difficulty: 'intermediate' as const,
      duration: '10 min',
      calories: 120,
      muscle: ['Core', 'Épaules', 'Jambes'],
      equipment: 'Aucun',
      category: 'Cardio',
      rating: 4.6,
      completions: 2156,
      thumbnail: '/api/placeholder/300/200',
      instructions: [
        'Position planche haute',
        'Alternance rapide des genoux',
        'Garder le dos droit',
        'Respiration régulière'
      ]
    },
    {
      id: '3',
      name: 'SQUATS PISTOL',
      description: 'Squat sur une jambe pour force et équilibre exceptionnels',
      difficulty: 'expert' as const,
      duration: '20 min',
      calories: 200,
      muscle: ['Quadriceps', 'Fessiers', 'Core'],
      equipment: 'Aucun',
      category: 'Force',
      rating: 4.9,
      completions: 432,
      thumbnail: '/api/placeholder/300/200',
      instructions: [
        'Équilibre sur une jambe',
        'Descente lente et contrôlée',
        'Remontée explosive',
        'Maîtrise de l\'équilibre'
      ]
    },
    {
      id: '4',
      name: 'PLANCHE STATIQUE',
      description: 'Renforcement du core en position isométrique',
      difficulty: 'beginner' as const,
      duration: '8 min',
      calories: 80,
      muscle: ['Core', 'Épaules'],
      equipment: 'Aucun',
      category: 'Core',
      rating: 4.4,
      completions: 3421,
      thumbnail: '/api/placeholder/300/200',
      instructions: [
        'Position coudes au sol',
        'Corps aligné',
        'Contraction continue du core',
        'Respiration contrôlée'
      ]
    },
    {
      id: '5',
      name: 'BURPEES TACTIQUES',
      description: 'Burpees militaires avec variations pour condition physique extrême',
      difficulty: 'expert' as const,
      duration: '18 min',
      calories: 320,
      muscle: ['Corps entier'],
      equipment: 'Aucun',
      category: 'Cardio',
      rating: 4.7,
      completions: 864,
      thumbnail: '/api/placeholder/300/200',
      instructions: [
        'Squat + position pompe',
        'Pompe explosive',
        'Saut groupé',
        'Enchaînement rapide'
      ]
    },
    {
      id: '6',
      name: 'DIPS PARALLÈLES',
      description: 'Renforcement des triceps et pectoraux inférieurs',
      difficulty: 'intermediate' as const,
      duration: '12 min',
      calories: 150,
      muscle: ['Triceps', 'Pectoraux'],
      equipment: 'Barres parallèles',
      category: 'Force',
      rating: 4.5,
      completions: 1876,
      thumbnail: '/api/placeholder/300/200',
      instructions: [
        'Suspension bras tendus',
        'Descente contrôlée',
        'Remontée puissante',
        'Amplitude complète'
      ]
    }
  ];

  const filterOptions = {
    level: ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'],
    muscle: ['Pectoraux', 'Triceps', 'Épaules', 'Core', 'Jambes', 'Quadriceps', 'Fessiers', 'Corps entier'],
    equipment: ['Aucun', 'Barres parallèles', 'Barre de traction', 'Kettlebell'],
    duration: ['< 10 min', '10-15 min', '15-20 min', '> 20 min']
  };

  // Fonctions utilitaires
  const toggleFavorite = (exerciseId: string) => {
    setFavoriteExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      level: [],
      muscle: [],
      equipment: [],
      duration: []
    });
  };

  // Filtrage des exercices
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedFilters.level.length === 0 || 
                        selectedFilters.level.some(level => {
                          const levelMap = { 'Débutant': 'beginner', 'Intermédiaire': 'intermediate', 'Avancé': 'advanced', 'Expert': 'expert' };
                          return levelMap[level as keyof typeof levelMap] === exercise.difficulty;
                        });
    
    const matchesMuscle = selectedFilters.muscle.length === 0 ||
                         selectedFilters.muscle.some(muscle => exercise.muscle.includes(muscle));
    
    return matchesSearch && matchesLevel && matchesMuscle;
  });

  const PreviewModal = ({ exercise }: { exercise: typeof exercises[0] }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-martial-overlay backdrop-blur-martial">
      <Card variant="hero" className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{exercise.name}</CardTitle>
              <CardDescription>{exercise.category}</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setPreviewExercise(null)}
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <DifficultyBadge level={exercise.difficulty} />
            <Badge variant="category">{exercise.category}</Badge>
          </div>
          
          <p className="text-martial-steel">{exercise.description}</p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <ClockIcon className="w-5 h-5 text-martial-steel mx-auto mb-1" />
              <div className="text-sm font-bold text-martial-highlight">{exercise.duration}</div>
            </div>
            <div>
              <FireIcon className="w-5 h-5 text-martial-steel mx-auto mb-1" />
              <div className="text-sm font-bold text-martial-highlight">{exercise.calories} cal</div>
            </div>
            <div>
              <UserGroupIcon className="w-5 h-5 text-martial-steel mx-auto mb-1" />
              <div className="text-sm font-bold text-martial-highlight">{exercise.completions}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-martial-highlight mb-2">Instructions</h4>
            <ol className="space-y-1">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-martial-steel flex items-start">
                  <span className="font-bold text-martial-danger-accent mr-2">{index + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-martial-highlight mb-2">Muscles ciblés</h4>
            <div className="flex flex-wrap gap-2">
              {exercise.muscle.map((muscle, index) => (
                <CategoryBadge key={index}>{muscle}</CategoryBadge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="cta" size="lg" fullWidth>
            <PlayIcon className="w-5 h-5 mr-2" />
            COMMENCER CET EXERCICE
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-martial-primary-bg text-martial-highlight">
      {/* Header */}
      <header className="martial-navbar sticky top-0 z-40">
        <div className="martial-container h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChevronLogo size={32} variant="danger" />
            <h1 className="font-display font-bold text-xl text-martial-highlight">
              BIBLIOTHÈQUE D'EXERCICES
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={showFilters ? "primary" : "ghost"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              FILTRES
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="martial-container py-8 space-y-8">
        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput 
              placeholder="Rechercher par nom, muscle, catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-martial-steel">
              {filteredExercises.length} exercice{filteredExercises.length > 1 ? 's' : ''}
            </span>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              {viewMode === 'grid' ? 'LISTE' : 'GRILLE'}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card variant="stats" className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filtres de Recherche</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Tout effacer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(filterOptions).map(([category, options]) => (
                  <div key={category}>
                    <h4 className="font-display font-semibold text-martial-highlight mb-3 uppercase tracking-wide">
                      {category === 'level' ? 'Niveau' : 
                       category === 'muscle' ? 'Muscles' :
                       category === 'equipment' ? 'Équipement' : 'Durée'}
                    </h4>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters[category as keyof typeof selectedFilters].includes(option)}
                            onChange={() => toggleFilter(category as keyof typeof selectedFilters, option)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 border-2 border-martial-steel/50 rounded-sm flex items-center justify-center transition-colors ${
                            selectedFilters[category as keyof typeof selectedFilters].includes(option)
                              ? 'bg-martial-danger-accent border-martial-danger-accent'
                              : 'hover:border-martial-steel'
                          }`}>
                            {selectedFilters[category as keyof typeof selectedFilters].includes(option) && (
                              <CheckIcon className="w-3 h-3 text-martial-highlight" />
                            )}
                          </div>
                          <span className="text-sm text-martial-steel hover:text-martial-highlight">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters */}
        {Object.values(selectedFilters).some(filters => filters.length > 0) && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-martial-steel">Filtres actifs:</span>
            {Object.entries(selectedFilters).map(([category, filters]) =>
              filters.map((filter) => (
                <Badge
                  key={`${category}-${filter}`}
                  variant="rank"
                  removable
                  onRemove={() => toggleFilter(category as keyof typeof selectedFilters, filter)}
                >
                  {filter}
                </Badge>
              ))
            )}
          </div>
        )}

        {/* Exercise Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id}
              variant="exercise"
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onMouseEnter={() => viewMode === 'grid' && setPreviewExercise(exercise.id)}
              onMouseLeave={() => setPreviewExercise(null)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="group-hover:text-martial-danger-accent transition-colors">
                      {exercise.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {exercise.description}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(exercise.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {favoriteExercises.includes(exercise.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-martial-danger-accent" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewExercise(exercise.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <DifficultyBadge level={exercise.difficulty} />
                  <CategoryBadge>{exercise.category}</CategoryBadge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <ClockIcon className="w-4 h-4 text-martial-steel mx-auto mb-1" />
                    <div className="text-xs font-bold text-martial-highlight">{exercise.duration}</div>
                  </div>
                  <div>
                    <FireIcon className="w-4 h-4 text-martial-steel mx-auto mb-1" />
                    <div className="text-xs font-bold text-martial-highlight">{exercise.calories}</div>
                  </div>
                  <div>
                    <UserGroupIcon className="w-4 h-4 text-martial-steel mx-auto mb-1" />
                    <div className="text-xs font-bold text-martial-highlight">{exercise.completions}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {exercise.muscle.slice(0, 3).map((muscle, index) => (
                    <span key={index} className="text-xs text-martial-steel bg-martial-surface-hover px-2 py-1 rounded">
                      {muscle}
                    </span>
                  ))}
                  {exercise.muscle.length > 3 && (
                    <span className="text-xs text-martial-steel bg-martial-surface-hover px-2 py-1 rounded">
                      +{exercise.muscle.length - 3}
                    </span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1">
                    <span className="text-martial-warning text-sm">★</span>
                    <span className="text-sm font-bold text-martial-highlight">{exercise.rating}</span>
                  </div>
                  
                  <Button variant="primary" size="sm">
                    <PlayIcon className="w-4 h-4 mr-1" />
                    DÉMARRER
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <Card variant="hero" className="text-center py-12">
            <CardContent>
              <BookmarkIcon className="w-16 h-16 text-martial-steel mx-auto mb-4" />
              <CardTitle className="mb-2">Aucun exercice trouvé</CardTitle>
              <CardDescription className="mb-6">
                Essayez de modifier vos critères de recherche ou vos filtres
              </CardDescription>
              <Button variant="secondary" onClick={clearAllFilters}>
                EFFACER LES FILTRES
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Preview Modal */}
      {previewExercise && (
        <PreviewModal 
          exercise={exercises.find(ex => ex.id === previewExercise)!} 
        />
      )}
    </div>
  );
};

export default LibraryMockup;
