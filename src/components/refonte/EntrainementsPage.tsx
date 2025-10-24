'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { WorkoutType } from '@/types';
import { Header } from './Header';
import { Footer } from './Footer';
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
  DocumentArrowDownIcon,
  XMarkIcon
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

// Composant de filtres optimisé
const WorkoutFilters: React.FC<{
  dateFilter: string;
  setDateFilter: (date: string) => void;
  typeFilter: WorkoutType | '';
  setTypeFilter: (type: WorkoutType | '') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}> = ({ dateFilter, setDateFilter, typeFilter, setTypeFilter, onClearFilters, hasActiveFilters }) => {
  return (
    <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-6 mb-8 shadow-martial-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 filter-section-title" />
          <h3 className="text-lg font-semibold text-martial-highlight">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="filter-clear-btn focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md px-2 py-1"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium filter-section-title mb-2">
            Date
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium filter-section-title mb-2">
            Type d'entraînement
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as WorkoutType | '')}
            className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
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
  );
};

// Composant de statistiques
const WorkoutStats: React.FC<{
  stats: {
    totalWorkouts: number;
    totalTime: number;
    averageTime: number;
    weeklyAverage: number;
  };
}> = ({ stats }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}min`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
      <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 sm:p-6 text-center hover-theme-accent-border transition-theme">
        <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-martial-danger-accent mx-auto mb-1.5 sm:mb-2" />
        <div className="text-xl sm:text-2xl font-bold text-martial-highlight">{stats.totalWorkouts}</div>
        <div className="text-xs sm:text-sm text-martial-steel">Séances totales</div>
      </div>
      <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 sm:p-6 text-center hover-theme-accent-border transition-theme">
        <CalendarDaysIcon className="h-6 w-6 sm:h-8 sm:w-8 text-martial-danger-accent mx-auto mb-1.5 sm:mb-2" />
        <div className="text-xl sm:text-2xl font-bold text-martial-highlight">{stats.weeklyAverage}</div>
        <div className="text-xs sm:text-sm text-martial-steel">Séances / semaine</div>
      </div>
      <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 sm:p-6 text-center hover-theme-accent-border transition-theme">
        <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-martial-danger-accent mx-auto mb-1.5 sm:mb-2" />
        <div className="text-xl sm:text-2xl font-bold text-martial-highlight">{formatDuration(stats.totalTime)}</div>
        <div className="text-xs sm:text-sm text-martial-steel">Temps total</div>
      </div>
      <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-4 sm:p-6 text-center hover-theme-accent-border transition-theme">
        <FireIcon className="h-6 w-6 sm:h-8 sm:w-8 text-martial-danger-accent mx-auto mb-1.5 sm:mb-2" />
        <div className="text-xl sm:text-2xl font-bold text-martial-highlight">{stats.averageTime}min</div>
        <div className="text-xs sm:text-sm text-martial-steel">Durée moyenne</div>
      </div>
    </div>
  );
};

// Composant de carte d'entraînement
const WorkoutCard: React.FC<{
  workout: any;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}> = ({ workout, onDelete, onExport }) => {
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
    const uniqueExercises = new Set(workout.sets.map((set: any) => set.exerciceId));
    const exerciseCount = uniqueExercises.size;
    
    if (isMobile) {
      return `${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}`;
    }
    
    const totalSets = workout.sets.length;
    const totalReps = workout.sets.reduce((sum: number, set: any) => sum + (set.repetitions || 0), 0);
    
    return `${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''} • ${totalSets} série${totalSets > 1 ? 's' : ''} • ${totalReps} rép.`;
  };

  return (
    <div className="group martial-card-theme p-6 animate-zoom-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 mb-4 lg:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <Link
                href={`/entrainements/${workout.id}`}
                className="text-xl font-semibold text-martial-highlight hover-theme-accent transition-theme focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md"
              >
                {workout.nom}
              </Link>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-martial-steel">
                <span>{formatDate(workout.date)}</span>
                <span className="inline-block bg-martial-surface-hover text-martial-danger-accent px-2 py-1 rounded-full text-xs">
                  {workout.type}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {formatDuration(workout.duree)}
                </span>
              </div>
            </div>
            <div className="text-sm text-martial-steel">
              <span className="block sm:hidden">
                {getWorkoutSummary(workout, true)}
              </span>
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
            className="inline-flex items-center justify-center w-10 h-10 bg-martial-danger-accent/20 hover:bg-martial-danger-accent/40 text-martial-danger-accent hover:text-martial-highlight rounded-lg transition-theme border border-martial-danger-accent/30 hover-theme-accent-border focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
            title="Voir"
            aria-label="Voir l'entraînement"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onExport(workout.id)}
            className="inline-flex items-center justify-center w-10 h-10 bg-martial-success/20 hover:bg-martial-success/40 text-martial-success hover:text-martial-highlight rounded-lg transition-all duration-200 border border-martial-success/30 hover:border-martial-success/50 focus:outline-none focus:ring-2 focus:ring-martial-success focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
            title="Exporter"
            aria-label="Exporter l'entraînement"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
          </button>
          <Link
            href={`/entrainements/modifier/${workout.id}`}
            className="inline-flex items-center justify-center w-10 h-10 bg-martial-surface-hover hover:bg-martial-danger-accent/20 text-martial-danger-accent hover:text-martial-highlight rounded-lg transition-theme border border-martial-danger-accent/20 hover-theme-accent-border focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
            title="Modifier"
            aria-label="Modifier l'entraînement"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onDelete(workout.id)}
            className="inline-flex items-center justify-center w-10 h-10 bg-martial-steel/20 hover:bg-red-500/20 text-martial-steel hover:text-red-300 rounded-lg transition-all duration-200 border border-martial-steel/30 hover:border-red-400/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
            title="Supprimer"
            aria-label="Supprimer l'entraînement"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
export default function EntrainementsPage() {
  const { user } = useAuth();
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

  const clearFilters = () => {
    setDateFilter('');
    setTypeFilter('');
  };

  const hasActiveFilters = dateFilter !== '' || typeFilter !== '';

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-martial-primary-bg">
        <Header />
        
        <main className="flex-1">
          {/* Header */}
          <section className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
                <div className="mb-4 sm:mb-6 lg:mb-0">
                  <div className="flex items-center justify-center lg:justify-start w-14 h-14 sm:w-16 sm:h-16 bg-martial-danger-accent rounded-full mb-4 sm:mb-6">
                    <CalendarDaysIcon className="h-7 w-7 sm:h-8 sm:w-8 text-martial-highlight" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-martial-highlight mb-3 sm:mb-4 text-center lg:text-left">
                    Historique des séances
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-martial-steel text-center lg:text-left">
                    Suivez vos entraînements et analysez vos progrès
                  </p>
                </div>
                
                {/* Bouton Nouvelle séance */}
                <Link
                  href="/entrainements/ajouter"
                  className="inline-flex items-center justify-center gap-2 martial-btn-theme px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold transform hover:scale-105 self-center lg:self-start w-full sm:w-auto min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                >
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Nouvelle séance</span>
                </Link>
              </div>

              <WorkoutFilters
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />

              <WorkoutStats stats={stats} />
            </div>
          </section>

          {/* Liste des séances */}
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-6 animate-pulse">
                      <div className="h-4 bg-martial-surface-hover rounded mb-4"></div>
                      <div className="h-3 bg-martial-surface-hover rounded mb-2"></div>
                      <div className="h-3 bg-martial-surface-hover rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {filteredWorkouts.map((workout, index) => (
                    <WorkoutCard
                      key={`${workout.id}-${index}`}
                      workout={workout}
                      onDelete={setShowDeleteConfirm}
                      onExport={setShowExport}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <CalendarDaysIcon className="h-16 w-16 text-martial-steel mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-martial-highlight mb-2">
                    Aucune séance trouvée
                  </h3>
                  <p className="text-martial-steel mb-6">
                    Commencez par créer votre première séance d'entraînement
                  </p>
                  <Link
                    href="/entrainements/ajouter"
                    className="inline-flex items-center justify-center martial-btn-theme font-semibold py-3 px-6 rounded-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Créer une séance
                  </Link>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-martial-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-martial-surface-1 border border-martial-steel/30 rounded-lg p-5 sm:p-6 max-w-md w-full mx-4 animate-fade-in">
              <h3 className="text-base sm:text-lg font-semibold text-martial-highlight mb-3 sm:mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-sm sm:text-base text-martial-steel mb-5 sm:mb-6">
                Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-martial-steel/30 text-martial-steel rounded-lg hover:bg-martial-surface-hover transition-colors duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-steel focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteWorkout(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-500/70 hover:bg-red-500/90 text-martial-highlight rounded-lg transition-colors duration-200 border border-red-400/50 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
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
              exercises={[]}
              personalRecords={[]}
              onClose={() => setShowExport(null)}
            />
          ) : null;
        })()}

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
