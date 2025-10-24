'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getRankColor, getRankName, RANKS } from '@/data/ranks';
import { Header } from './Header';
import { Footer } from './Footer';
import Link from 'next/link';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FireIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// Composant de recherche optimisé
const SearchBar: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
}> = ({ searchTerm, setSearchTerm, resultsCount }) => {
  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-martial-steel" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-martial-surface-1 border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
          placeholder="Rechercher un exercice..."
          aria-label="Rechercher un exercice"
        />
      </div>
      {searchTerm && (
        <p className="text-sm text-martial-steel mt-2 text-center">
          {resultsCount} résultat{resultsCount !== 1 ? 's' : ''} trouvé{resultsCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

// Composant de filtres avancés
const AdvancedFilters: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  selectedRanks: string[];
  selectedMuscles: string[];
  onToggleRank: (rank: string) => void;
  onToggleMuscle: (muscle: string) => void;
  onClearFilters: () => void;
  allMuscles: string[];
  hasActiveFilters: boolean;
  resultsCount: number;
}> = ({
  isOpen,
  onToggle,
  selectedRanks,
  selectedMuscles,
  onToggleRank,
  onToggleMuscle,
  onClearFilters,
  allMuscles,
  hasActiveFilters,
  resultsCount
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg shadow-martial-lg">
        {/* Filter Toggle Button */}
        <div className="w-full flex items-center justify-between p-4 hover:bg-martial-surface-hover transition-colors duration-200 rounded-lg">
          <button
            onClick={onToggle}
            className="flex items-center gap-3 flex-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md"
            aria-expanded={isOpen}
            aria-label="Ouvrir les filtres avancés"
          >
            <FunnelIcon className="h-5 w-5 text-martial-danger-accent" />
            <span className="text-martial-highlight font-medium">Filtres avancés</span>
            {hasActiveFilters && (
              <span className="bg-martial-danger-accent text-martial-highlight text-xs px-2 py-1 rounded-full">
                {(selectedRanks.length + selectedMuscles.length)} actifs
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-martial-steel hover:text-martial-highlight transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-martial-danger-accent"
                title="Effacer tous les filtres"
                aria-label="Effacer tous les filtres"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onToggle}
              className="text-martial-steel hover:text-martial-highlight transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-martial-danger-accent"
              aria-label={isOpen ? "Fermer les filtres" : "Ouvrir les filtres"}
            >
              {isOpen ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Filters Content */}
        {isOpen && (
          <div className="px-4 pb-4 space-y-6 animate-fade-in">
            {/* Rangs Filter */}
            <div>
              <h3 className="text-sm font-medium filter-section-title mb-3">Filtrer par rangs</h3>
              <div className="flex flex-wrap gap-2">
                {RANKS.map((rank) => (
                  <button
                    key={rank.rank}
                    onClick={() => onToggleRank(rank.rank)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg ${
                      selectedRanks.includes(rank.rank)
                        ? 'filter-active'
                        : 'filter-inactive'
                    }`}
                    aria-pressed={selectedRanks.includes(rank.rank)}
                  >
                    <span 
                      className="w-6 h-6 rounded text-martial-highlight text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: rank.color }}
                    >
                      {rank.rank}
                    </span>
                    <span className="text-sm">{rank.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Muscles Filter */}
            <div>
              <h3 className="text-sm font-medium filter-section-title mb-3">Filtrer par muscles</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {allMuscles.map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => onToggleMuscle(muscle)}
                    className={`px-3 py-2 rounded-lg border text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg ${
                      selectedMuscles.includes(muscle)
                        ? 'filter-active'
                        : 'filter-inactive'
                    }`}
                    aria-pressed={selectedMuscles.includes(muscle)}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-martial-steel/20">
              <span className="text-sm text-martial-steel">
                {resultsCount} exercice{resultsCount !== 1 ? 's' : ''} trouvé{resultsCount !== 1 ? 's' : ''}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-sm filter-clear-btn focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-2 py-1"
                >
                  Effacer tous les filtres
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant de carte d'exercice
const ExerciseCard: React.FC<{
  exercise: any;
  user: any;
  onDelete: (id: string) => void;
  onShowDeleteConfirm: (id: string) => void;
}> = ({ exercise, user, onDelete, onShowDeleteConfirm }) => {
  const getRankBadgeStyle = (rank: string) => {
    const color = getRankColor(rank);
    return {
      backgroundColor: color,
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
      padding: '4px 8px',
      borderRadius: '6px',
      minWidth: '32px',
      textAlign: 'center' as const
    };
  };

  return (
    <div className="group martial-card-theme p-4 sm:p-6 animate-zoom-in">
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-martial-highlight mb-2 flex-1 group-hover:text-accent transition-colors duration-200">
          {exercise.nom}
        </h3>
        <span style={getRankBadgeStyle(exercise.difficulte)} className="flex-shrink-0">
          {exercise.difficulte}
        </span>
      </div>
      
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block bg-martial-surface-hover text-martial-danger-accent text-xs px-2 py-1 rounded-full">
          {exercise.categorie}
        </span>
        {exercise.userId ? (
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-400/30">
            Personnalisé
          </span>
        ) : (
          <span className="inline-block bg-martial-steel/20 text-martial-steel text-xs px-2 py-1 rounded-full border border-martial-steel/30">
            Base
          </span>
        )}
      </div>
      
      <p className="text-martial-steel text-sm mb-4 line-clamp-3">
        {exercise.description}
      </p>
      
      <div className="mb-4">
        <p className="text-xs text-martial-steel mb-2">Muscles ciblés :</p>
        <div className="flex flex-wrap gap-1">
          {exercise.muscles.slice(0, 3).map((muscle: string, index: number) => (
            <span
              key={index}
              className="text-xs bg-martial-surface-hover text-martial-steel px-2 py-1 rounded"
            >
              {muscle}
            </span>
          ))}
          {exercise.muscles.length > 3 && (
            <span className="text-xs text-martial-steel">
              +{exercise.muscles.length - 3}
            </span>
          )}
        </div>
      </div>
      
      {/* Boutons d'actions */}
      <div className="flex gap-2">
        {exercise.userId && user && exercise.userId === user.id ? (
          <>
              <Link
                href={`/exercices/modifier/${exercise.id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-martial-surface-hover px-3 py-2 rounded-lg text-sm font-medium border min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg filter-inactive"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Modifier</span>
              </Link>
            <button
              onClick={() => onShowDeleteConfirm(exercise.id)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-martial-steel/20 hover:bg-red-500/20 text-martial-steel hover:text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-martial-steel/30 hover:border-red-400/50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Supprimer</span>
            </button>
          </>
        ) : (
          <div className="flex-1 text-center text-martial-steel text-sm py-2">
            {exercise.userId ? 'Exercice d\'un autre utilisateur' : 'Exercice de base'}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant principal
function ExercicesContent() {
  const { exercises, fetchExercises, isLoading, deleteExercise } = useExerciseStore();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchExercises(user.id);
    }
  }, [fetchExercises, user?.id]);

  useEffect(() => {
    const added = searchParams.get('added');
    const modified = searchParams.get('modified');
    
    if (added === 'true') {
      setSuccessMessage('Exercice ajouté avec succès !');
      if (user?.id) {
        fetchExercises(user.id);
      }
    } else if (modified === 'true') {
      setSuccessMessage('Exercice modifié avec succès !');
      if (user?.id) {
        fetchExercises(user.id);
      }
    }

    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, user?.id, fetchExercises, successMessage]);

  // Extraire tous les muscles uniques des exercices
  const allMuscles = useMemo(() => {
    const musclesSet = new Set<string>();
    exercises.forEach(exercise => {
      exercise.muscles.forEach((muscle: string) => musclesSet.add(muscle));
    });
    return Array.from(musclesSet).sort();
  }, [exercises]);

  // Filtrer les exercices
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = searchTerm === '' || 
        exercise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRank = selectedRanks.length === 0 || selectedRanks.includes(exercise.difficulte);

      const matchesMuscles = selectedMuscles.length === 0 || 
        selectedMuscles.some(muscle => exercise.muscles.includes(muscle));

      return matchesSearch && matchesRank && matchesMuscles;
    });
  }, [exercises, searchTerm, selectedRanks, selectedMuscles]);

  const toggleRank = (rank: string) => {
    setSelectedRanks(prev => 
      prev.includes(rank) 
        ? prev.filter(r => r !== rank)
        : [...prev, rank]
    );
  };

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const clearFilters = () => {
    setSelectedRanks([]);
    setSelectedMuscles([]);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedRanks.length > 0 || selectedMuscles.length > 0 || searchTerm !== '';

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!user || !user.id) {
      console.error('Utilisateur non connecté ou ID manquant');
      alert('Vous devez être connecté pour supprimer un exercice.');
      setShowDeleteConfirm(null);
      return;
    }
    
    try {
      await deleteExercise(exerciseId, user.id);
      setShowDeleteConfirm(null);
      await fetchExercises(user.id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (error instanceof Error) {
        alert(`Erreur: ${error.message}`);
      } else {
        alert('Erreur lors de la suppression de l\'exercice');
      }
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-martial-primary-bg">
      <Header />
      
      {/* Message de succès */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-martial-success text-martial-highlight px-6 py-3 rounded-lg shadow-martial-lg animate-fade-in">
          {successMessage}
        </div>
      )}
      
      <main className="flex-1">
        {/* Header */}
        <section className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="text-center mb-10 sm:mb-12">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-martial-danger-accent rounded-full mx-auto mb-4 sm:mb-6">
                <BookOpenIcon className="h-7 w-7 sm:h-8 sm:w-8 text-martial-highlight" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-martial-highlight mb-3 sm:mb-4">
                Base d'exercices
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-martial-steel max-w-2xl mx-auto">
                Une collection complète d'exercices de calisthénie pour tous les rangs
              </p>
              
              {/* Link to ranks documentation */}
              <div className="mt-8">
                  <Link 
                    href="/rangs" 
                    className="inline-flex items-center gap-2 filter-clear-btn focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-2 py-1"
                  >
                    <InformationCircleIcon className="h-5 w-5" />
                    <span>Comprendre le système de rangs</span>
                  </Link>
              </div>
            </div>

            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              resultsCount={filteredExercises.length}
            />

            <AdvancedFilters
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
              selectedRanks={selectedRanks}
              selectedMuscles={selectedMuscles}
              onToggleRank={toggleRank}
              onToggleMuscle={toggleMuscle}
              onClearFilters={clearFilters}
              allMuscles={allMuscles}
              hasActiveFilters={hasActiveFilters}
              resultsCount={filteredExercises.length}
            />
          </div>
        </section>

        {/* Exercises Grid */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 sm:p-6 animate-pulse">
                    <div className="h-4 bg-martial-surface-hover rounded mb-4"></div>
                    <div className="h-3 bg-martial-surface-hover rounded mb-2"></div>
                    <div className="h-3 bg-martial-surface-hover rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    user={user}
                    onDelete={handleDeleteExercise}
                    onShowDeleteConfirm={setShowDeleteConfirm}
                  />
                ))}
              </div>
            )}

            {filteredExercises.length === 0 && !isLoading && exercises.length > 0 && (
              <div className="text-center py-16">
                <FunnelIcon className="h-16 w-16 text-martial-steel mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-martial-highlight mb-2">
                  Aucun exercice ne correspond aux filtres
                </h3>
                <p className="text-martial-steel mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-martial-surface-1 hover:bg-martial-surface-hover text-martial-highlight border border-martial-steel/30 hover:border-martial-steel/50 font-medium py-3 px-6 rounded-lg transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-steel focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}

            {exercises.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <BookOpenIcon className="h-16 w-16 text-martial-steel mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-martial-highlight mb-2">
                  Aucun exercice trouvé
                </h3>
                <p className="text-martial-steel">
                  La base d'exercices se charge...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bouton flottant pour ajouter un exercice */}
      <Link
        href="/exercices/ajouter"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 martial-btn-theme text-martial-highlight p-3 sm:p-4 rounded-full shadow-glow-danger hover:shadow-glow-danger transition-all duration-200 transform hover:scale-110 z-50 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
        title="Ajouter un exercice"
        aria-label="Ajouter un exercice"
      >
        <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </Link>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-martial-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-martial-surface-1 border border-martial-steel/30 rounded-lg p-5 sm:p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-martial-highlight mb-3 sm:mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm sm:text-base text-martial-steel mb-5 sm:mb-6">
              Êtes-vous sûr de vouloir supprimer cet exercice ? Cette action est irréversible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-martial-steel/30 text-martial-steel rounded-lg hover:bg-martial-surface-hover transition-colors duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-steel focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteExercise(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500/70 hover:bg-red-500/90 text-martial-highlight rounded-lg transition-colors duration-200 border border-red-400/50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Composant de fallback pendant le chargement
function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-martial-primary-bg">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-martial-danger-accent mx-auto mb-4"></div>
          <p className="text-martial-steel">Chargement...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Export principal avec Suspense
export default function ExercicesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingFallback />}>
        <ExercicesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
