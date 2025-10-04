'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuthStore } from '@/stores/authStore';
import { getRankColor, getRankName, RANKS } from '@/data/ranks';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
  TrashIcon
} from '@heroicons/react/24/outline';

// Composant qui utilise useSearchParams
function ExercicesContent() {
  const { exercises, fetchExercises, isLoading, deleteExercise } = useExerciseStore();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Passer l'userId pour obtenir les exercices de base + exercices personnalisés
    fetchExercises(user?.id);
  }, [fetchExercises, user?.id]);

  useEffect(() => {
    // Vérifier les paramètres de succès
    const added = searchParams.get('added');
    const modified = searchParams.get('modified');
    
    if (added === 'true') {
      setSuccessMessage('Exercice ajouté avec succès !');
      // Recharger la liste des exercices
      if (user?.id) {
        fetchExercises(user.id);
      }
    } else if (modified === 'true') {
      setSuccessMessage('Exercice modifié avec succès !');
      // Recharger la liste des exercices
      if (user?.id) {
        fetchExercises(user.id);
      }
    }

    // Supprimer le message après 3 secondes
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
      exercise.muscles.forEach(muscle => musclesSet.add(muscle));
    });
    return Array.from(musclesSet).sort();
  }, [exercises]);

  // Filtrer les exercices
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      // Filtre par terme de recherche
      const matchesSearch = searchTerm === '' || 
        exercise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre par rangs
      const matchesRank = selectedRanks.length === 0 || selectedRanks.includes(exercise.difficulte);

      // Filtre par muscles
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
      // Recharger la liste des exercices après suppression
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Message de succès */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
      
      <main className="flex-1">
        {/* Header */}
        <section className="sport-section pt-16 sm:pt-20 pb-10 sm:pb-12">
          <div className="sport-container">
            <div className="text-center mb-10 sm:mb-12">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-sport-accent rounded-full mx-auto mb-4 sm:mb-6">
                <BookOpenIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">
                Base d'exercices
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
                Une collection complète d'exercices de calisthénie pour tous les rangs
              </p>
              
              {/* Link to ranks documentation */}
              <div className="mt-8">
                <Link 
                  href="/rangs" 
                  className="inline-flex items-center gap-2 text-sport-accent hover:text-sport-accent-light transition-colors"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                  <span>Comprendre le système de rangs</span>
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="sport-input pl-10 w-full"
                  placeholder="Rechercher un exercice..."
                />
              </div>
            </div>

            {/* Filters Banner */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="sport-card">
                {/* Filter Toggle Button */}
                <div className="w-full flex items-center justify-between p-4 hover:bg-sport-gray-light/10 transition-colors rounded-lg">
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="flex items-center gap-3 flex-1"
                  >
                    <FunnelIcon className="h-5 w-5 text-sport-accent" />
                    <span className="text-white font-medium">Filtres avancés</span>
                    {hasActiveFilters && (
                      <span className="bg-sport-accent text-white text-xs px-2 py-1 rounded-full">
                        {(selectedRanks.length + selectedMuscles.length)} actifs
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        title="Effacer tous les filtres"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                      {filtersOpen ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Filters Content */}
                {filtersOpen && (
                  <div className="px-4 pb-4 space-y-6 animate-fade-in">
                    {/* Rangs Filter */}
                    <div>
                      <h3 className="text-sm font-medium text-sport-accent mb-3">Filtrer par rangs</h3>
                      <div className="flex flex-wrap gap-2">
                        {RANKS.map((rank) => (
                          <button
                            key={rank.rank}
                            onClick={() => toggleRank(rank.rank)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                              selectedRanks.includes(rank.rank)
                                ? 'border-sport-accent bg-sport-accent/20 text-white'
                                : 'border-sport-gray-light/30 text-gray-300 hover:border-sport-accent/50 hover:text-white'
                            }`}
                          >
                            <span 
                              className="w-6 h-6 rounded text-white text-xs font-bold flex items-center justify-center"
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
                      <h3 className="text-sm font-medium text-sport-accent mb-3">Filtrer par muscles</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {allMuscles.map((muscle) => (
                          <button
                            key={muscle}
                            onClick={() => toggleMuscle(muscle)}
                            className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                              selectedMuscles.includes(muscle)
                                ? 'border-sport-accent bg-sport-accent/20 text-white'
                                : 'border-sport-gray-light/30 text-gray-300 hover:border-sport-accent/50 hover:text-white'
                            }`}
                          >
                            {muscle}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between pt-4 border-t border-sport-gray-light/20">
                      <span className="text-sm text-gray-400">
                        {filteredExercises.length} exercice{filteredExercises.length !== 1 ? 's' : ''} trouvé{filteredExercises.length !== 1 ? 's' : ''}
                      </span>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-sport-accent hover:text-sport-accent-light transition-colors"
                        >
                          Effacer tous les filtres
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Exercises Grid */}
        <section className="pb-16">
          <div className="sport-container">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="sport-card p-4 sm:p-6 animate-pulse">
                    <div className="h-4 bg-sport-gray-light rounded mb-4"></div>
                    <div className="h-3 bg-sport-gray-light rounded mb-2"></div>
                    <div className="h-3 bg-sport-gray-light rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredExercises.map((exercise) => (
                  <div key={exercise.id} className="sport-card-hover p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 flex-1">
                        {exercise.nom}
                      </h3>
                      <span style={getRankBadgeStyle(exercise.difficulte)} className="flex-shrink-0">
                        {exercise.difficulte}
                      </span>
                    </div>
                    
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-block bg-sport-secondary text-sport-accent text-xs px-2 py-1 rounded-full">
                        {exercise.categorie}
                      </span>
                      {/* Badge pour indiquer le type d'exercice */}
                      {exercise.userId ? (
                        <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-400/30">
                          Personnalisé
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-500/20 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-400/30">
                          Base
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {exercise.description}
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Muscles ciblés :</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscles.slice(0, 3).map((muscle, index) => (
                          <span
                            key={index}
                            className="text-xs bg-sport-gray-light text-gray-300 px-2 py-1 rounded"
                          >
                            {muscle}
                          </span>
                        ))}
                        {exercise.muscles.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{exercise.muscles.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Boutons d'actions */}
                    <div className="flex gap-2">
                      {/* Afficher les boutons uniquement pour les exercices personnalisés */}
                      {exercise.userId && user && exercise.userId === user.id ? (
                        <>
                          <Link
                            href={`/exercices/modifier/${exercise.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-sport-secondary hover:bg-sport-secondary/80 text-sport-accent hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-sport-accent/20"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span>Modifier</span>
                          </Link>
                          <button
                            onClick={() => setShowDeleteConfirm(exercise.id)}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-600/50 hover:bg-red-500/70 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-500/30 hover:border-red-400/50"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span>Supprimer</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 text-center text-gray-400 text-sm py-2">
                          {exercise.userId ? 'Exercice d\'un autre utilisateur' : 'Exercice de base'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredExercises.length === 0 && !isLoading && exercises.length > 0 && (
              <div className="text-center py-16">
                <FunnelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucun exercice ne correspond aux filtres
                </h3>
                <p className="text-gray-400 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={clearFilters}
                  className="sport-btn-secondary"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}

            {exercises.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucun exercice trouvé
                </h3>
                <p className="text-gray-400">
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-sport-accent hover:bg-sport-accent-light text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50 touch-target"
        title="Ajouter un exercice"
      >
        <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </Link>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-sport-gray-dark border border-sport-gray-light/30 rounded-lg p-5 sm:p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-5 sm:mb-6">
              Êtes-vous sûr de vouloir supprimer cet exercice ? Cette action est irréversible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-sport-gray-light/30 text-gray-300 rounded-lg hover:bg-sport-gray-light/10 transition-colors touch-target text-sm sm:text-base"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteExercise(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500/70 hover:bg-red-500/90 text-white rounded-lg transition-colors border border-red-400/50 touch-target text-sm sm:text-base"
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sport-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Export principal avec Suspense
export default function ExercicesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExercicesContent />
    </Suspense>
  );
} 