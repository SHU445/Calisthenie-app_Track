'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useAuthStore } from '@/stores/authStore';
import { WorkoutType } from '@/types';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import WorkoutExport from '@/components/WorkoutExport';
import {
  CalendarDaysIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const workoutTypes: WorkoutType[] = [
  'Force',
  'Endurance', 
  'Flexibilité',
  'Cardio',
  'HIIT',
  'Circuit Training',
  'Récupération'
];

export default function EntrainementsPage() {
  const { user } = useAuthStore();
  const { workouts, fetchWorkouts, deleteWorkout, isLoading } = useWorkoutStore();
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<WorkoutType | ''>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showExport, setShowExport] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchWorkouts(user.id);
    }
  }, [user?.id, fetchWorkouts]);

  // Filtrer les entraînements
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesDate = !dateFilter || workout.date.startsWith(dateFilter);
      const matchesType = !typeFilter || workout.type === typeFilter;
      return matchesDate && matchesType;
    });
  }, [workouts, dateFilter, typeFilter]);

  // Statistiques
  const stats = useMemo(() => {
    const totalWorkouts = filteredWorkouts.length;
    const totalTime = filteredWorkouts.reduce((sum, w) => sum + w.duree, 0);
    const averageTime = totalWorkouts > 0 ? Math.round(totalTime / totalWorkouts) : 0;
    
    // Calcul de la moyenne hebdomadaire (sur les 30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentWorkouts = filteredWorkouts.filter(w => new Date(w.date) >= thirtyDaysAgo);
    const weeklyAverage = Math.round((recentWorkouts.length / 30) * 7 * 10) / 10;

    return {
      totalWorkouts,
      totalTime,
      averageTime,
      weeklyAverage
    };
  }, [filteredWorkouts]);

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await deleteWorkout(workoutId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getWorkoutSummary = (workout: any, isMobile: boolean = false) => {
    // Compter le nombre d'exercices uniques
    const uniqueExercises = new Set(workout.sets.map((set: any) => set.exerciceId));
    const exerciseCount = uniqueExercises.size;
    
    // Pour mobile, afficher seulement le nombre d'exercices
    if (isMobile) {
      return `${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}`;
    }
    
    // Pour desktop, afficher toutes les informations
    const totalSets = workout.sets.length;
    const totalReps = workout.sets.reduce((sum: number, set: any) => sum + (set.repetitions || 0), 0);
    
    return `${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''} • ${totalSets} série${totalSets > 1 ? 's' : ''} • ${totalReps} rép.`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <section className="sport-section pt-16 sm:pt-20 pb-10 sm:pb-12">
          <div className="sport-container">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
              <div className="mb-4 sm:mb-6 lg:mb-0">
                <div className="flex items-center justify-center lg:justify-start w-14 h-14 sm:w-16 sm:h-16 bg-sport-accent rounded-full mb-4 sm:mb-6">
                  <CalendarDaysIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 text-center lg:text-left">
                  Historique des séances
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 text-center lg:text-left">
                  Suivez vos entraînements et analysez vos progrès
                </p>
              </div>
              
              {/* Bouton Nouvelle séance */}
              <Link
                href="/entrainements/ajouter"
                className="inline-flex items-center justify-center gap-2 bg-sport-accent hover:bg-sport-accent-light text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg self-center lg:self-start w-full sm:w-auto touch-target text-sm sm:text-base"
              >
                <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Nouvelle séance</span>
              </Link>
            </div>

            {/* Filtres */}
            <div className="sport-card p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FunnelIcon className="h-5 w-5 text-sport-accent" />
                <h3 className="text-lg font-semibold text-white">Filtres</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sport-accent mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="sport-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sport-accent mb-2">
                    Type d'entraînement
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as WorkoutType | '')}
                    className="sport-input w-full"
                  >
                    <option value="">Tous les types</option>
                    {workoutTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Zone de résumé */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <div className="sport-card p-4 sm:p-6 text-center">
                <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-sport-accent mx-auto mb-1.5 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalWorkouts}</div>
                <div className="text-xs sm:text-sm text-gray-400">Séances totales</div>
              </div>
              <div className="sport-card p-4 sm:p-6 text-center">
                <CalendarDaysIcon className="h-6 w-6 sm:h-8 sm:w-8 text-sport-accent mx-auto mb-1.5 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.weeklyAverage}</div>
                <div className="text-xs sm:text-sm text-gray-400">Séances / semaine</div>
              </div>
              <div className="sport-card p-4 sm:p-6 text-center">
                <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-sport-accent mx-auto mb-1.5 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">{formatDuration(stats.totalTime)}</div>
                <div className="text-xs sm:text-sm text-gray-400">Temps total</div>
              </div>
              <div className="sport-card p-4 sm:p-6 text-center">
                <FireIcon className="h-6 w-6 sm:h-8 sm:w-8 text-sport-accent mx-auto mb-1.5 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.averageTime}min</div>
                <div className="text-xs sm:text-sm text-gray-400">Durée moyenne</div>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des séances */}
        <section className="pb-16">
          <div className="sport-container">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="sport-card p-6 animate-pulse">
                    <div className="h-4 bg-sport-gray-light rounded mb-4"></div>
                    <div className="h-3 bg-sport-gray-light rounded mb-2"></div>
                    <div className="h-3 bg-sport-gray-light rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredWorkouts.length > 0 ? (
              <div className="space-y-4">
                {filteredWorkouts.map((workout, index) => (
                  <div key={`${workout.id}-${index}`} className="sport-card-hover p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <Link
                              href={`/entrainements/${workout.id}`}
                              className="text-xl font-semibold text-white hover:text-sport-accent transition-colors"
                            >
                              {workout.nom}
                            </Link>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                              <span>{formatDate(workout.date)}</span>
                              <span className="inline-block bg-sport-secondary text-sport-accent px-2 py-1 rounded-full text-xs">
                                {workout.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {formatDuration(workout.duree)}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {/* Version mobile - seulement exercices */}
                            <span className="block sm:hidden">
                              {getWorkoutSummary(workout, true)}
                            </span>
                            {/* Version desktop - toutes les infos */}
                            <span className="hidden sm:block">
                              {getWorkoutSummary(workout, false)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/entrainements/${workout.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 bg-sport-accent/20 hover:bg-sport-accent/40 text-sport-accent hover:text-white rounded-lg transition-colors border border-sport-accent/30"
                          title="Voir"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => setShowExport(workout.id)}
                          className="inline-flex items-center justify-center w-10 h-10 bg-green-600/20 hover:bg-green-600/40 text-green-400 hover:text-white rounded-lg transition-colors border border-green-500/30 hover:border-green-400/50"
                          title="Exporter"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                        <Link
                          href={`/entrainements/modifier/${workout.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 bg-sport-secondary hover:bg-sport-secondary/80 text-sport-accent hover:text-white rounded-lg transition-colors border border-sport-accent/20"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm(workout.id)}
                          className="inline-flex items-center justify-center w-10 h-10 bg-gray-600/50 hover:bg-red-500/70 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-500/30 hover:border-red-400/50"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucune séance trouvée
                </h3>
                <p className="text-gray-400 mb-6">
                  Commencez par créer votre première séance d'entraînement
                </p>
                <Link
                  href="/entrainements/ajouter"
                  className="sport-btn-primary"
                >
                  Créer une séance
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-sport-gray-dark border border-sport-gray-light/30 rounded-lg p-5 sm:p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-5 sm:mb-6">
              Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-sport-gray-light/30 text-gray-300 rounded-lg hover:bg-sport-gray-light/10 transition-colors touch-target text-sm sm:text-base"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteWorkout(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500/70 hover:bg-red-500/90 text-white rounded-lg transition-colors border border-red-400/50 touch-target text-sm sm:text-base"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'export */}
      {showExport && (() => {
        const workout = workouts.find(w => w.id === showExport);
        return workout ? (
          <WorkoutExport
            workout={workout}
            exercises={[]} // Les exercices seront chargés dans le composant
            personalRecords={[]} // Les records seront chargés dans le composant
            onClose={() => setShowExport(null)}
          />
        ) : null;
      })()}

      <Footer />
    </div>
  );
} 