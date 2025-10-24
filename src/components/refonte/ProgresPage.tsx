'use client';

import { useState, useEffect, useMemo } from 'react';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Exercise, Workout, WorkoutSet, QuantificationType } from '@/types';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  FunnelIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  XMarkIcon,
  ChartBarIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import ProgressCharts from '@/components/ProgressCharts';
import { Header } from './Header';
import { Footer } from './Footer';

type PeriodOption = '1week' | '1month' | '2months' | '3months' | 'all';

interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  maxValue: number;
  totalValue: number;
  totalSets: number;
  averageValue: number;
  averageSets: number;
  type: 'repetitions' | 'temps';
  data: { date: string; value: number; sets: number }[];
}

interface DistributionData {
  labels: string[];
  values: number[];
  sets: number[];
}

// Composant de filtres optimisé
const ProgressFilters: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  averagePeriod: PeriodOption;
  setAveragePeriod: (period: PeriodOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}> = ({
  isOpen,
  onToggle,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  averagePeriod,
  setAveragePeriod,
  onClearFilters,
  hasActiveFilters
}) => {
  const periodOptions = [
    { value: '1week', label: '1 semaine' },
    { value: '1month', label: '1 mois' },
    { value: '2months', label: '2 mois' },
    { value: '3months', label: '3 mois' },
    { value: 'all', label: 'Tout' }
  ];

  return (
    <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg shadow-martial-lg mb-8">
      <div className="w-full flex items-center justify-between p-4 hover:bg-martial-surface-hover transition-colors duration-200 rounded-lg">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md"
          aria-expanded={isOpen}
          aria-label="Ouvrir les filtres"
        >
          <FunnelIcon className="h-5 w-5 filter-section-title" />
          <span className="text-martial-highlight font-medium">Filtres de progression</span>
          {hasActiveFilters && (
            <span className="filter-active text-xs px-2 py-1 rounded-full">
              Filtres actifs
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="filter-clear-btn p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-martial-danger-accent"
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

      {isOpen && (
        <div className="px-4 pb-4 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium filter-section-title mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium filter-section-title mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight placeholder-martial-steel rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium filter-section-title mb-2">
              Période de calcul des moyennes
            </label>
            <select
              value={averagePeriod}
              onChange={(e) => setAveragePeriod(e.target.value as PeriodOption)}
              className="bg-martial-surface-hover border border-martial-steel/30 text-martial-highlight rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:border-martial-danger-accent/50 transition-all duration-200 w-full min-h-[44px]"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant de sélection d'exercices
const ExerciseSelector: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  exercises: Exercise[];
  selectedExerciseIds: string[];
  onToggleExercise: (id: string) => void;
  onClearSelection: () => void;
}> = ({
  isOpen,
  onToggle,
  exercises,
  selectedExerciseIds,
  onToggleExercise,
  onClearSelection
}) => {
  return (
    <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg shadow-martial-lg mb-8">
      <div className="w-full flex items-center justify-between p-4 hover:bg-martial-surface-hover transition-colors duration-200 rounded-lg">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg rounded-md"
          aria-expanded={isOpen}
          aria-label="Ouvrir la sélection d'exercices"
        >
          <ChartBarIcon className="h-5 w-5 text-martial-danger-accent" />
          <span className="text-martial-highlight font-medium">Sélectionner les exercices</span>
          {selectedExerciseIds.length > 0 && (
            <span className="bg-martial-danger-accent text-martial-highlight text-xs px-2 py-1 rounded-full">
              {selectedExerciseIds.length} sélectionné{selectedExerciseIds.length > 1 ? 's' : ''}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          {selectedExerciseIds.length > 0 && (
            <button
              onClick={onClearSelection}
              className="text-martial-steel hover-theme-accent transition-theme p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-martial-danger-accent"
              title="Effacer la sélection"
              aria-label="Effacer la sélection"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onToggle}
            className="text-martial-steel hover:text-martial-highlight transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-martial-danger-accent"
            aria-label={isOpen ? "Fermer la sélection" : "Ouvrir la sélection"}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => onToggleExercise(exercise.id)}
                className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg ${
                  selectedExerciseIds.includes(exercise.id)
                    ? 'border-martial-danger-accent bg-martial-danger-accent/20 text-martial-highlight'
                    : 'border-martial-steel/30 text-martial-steel hover-theme-accent-border hover:text-martial-highlight'
                }`}
                aria-pressed={selectedExerciseIds.includes(exercise.id)}
              >
                {exercise.nom}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant principal
function ProgressPageContent() {
  const { user } = useAuth();
  const { exercises, fetchExercises } = useExerciseStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();

  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExerciseGridOpen, setIsExerciseGridOpen] = useState(false);
  const [averagePeriod, setAveragePeriod] = useState<PeriodOption>('3months');

  useEffect(() => {
    if (user) {
      fetchExercises(user.id);
      fetchWorkouts(user.id);
    }
  }, [user, fetchExercises, fetchWorkouts]);

  // Filtrer les entraînements par période
  const filteredWorkouts = useMemo(() => {
    let filtered = workouts;

    if (startDate) {
      filtered = filtered.filter(workout => workout.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(workout => workout.date <= endDate);
    }

    return filtered;
  }, [workouts, startDate, endDate]);

  // Calculer les statistiques pour les exercices sélectionnés
  const exerciseStats = useMemo(() => {
    if (selectedExerciseIds.length === 0) return [];

    const now = new Date();
    const periodDate = new Date();
    
    switch (averagePeriod) {
      case '1week':
        periodDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        periodDate.setMonth(now.getMonth() - 1);
        break;
      case '2months':
        periodDate.setMonth(now.getMonth() - 2);
        break;
      case '3months':
        periodDate.setMonth(now.getMonth() - 3);
        break;
      default:
        periodDate.setFullYear(2000);
    }

    const periodWorkouts = filteredWorkouts.filter(workout => 
      new Date(workout.date) >= periodDate
    );

    return selectedExerciseIds.map(exerciseId => {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (!exercise) return null;

      const exerciseSets: Array<WorkoutSet & { date: string }> = [];
      periodWorkouts.forEach(workout => {
        workout.sets.forEach(set => {
          if (set.exerciceId === exerciseId) {
            exerciseSets.push({ ...set, date: workout.date });
          }
        });
      });

      if (exerciseSets.length === 0) return null;

      const isTimeBased = exercise.typeQuantification === 'hold';
      const values = exerciseSets.map(set => isTimeBased ? (set.duree || 0) : (set.repetitions || 0));
      const numberOfSets = exerciseSets.length;

      const maxValue = Math.max(...values);
      const totalValue = values.reduce((sum, val) => sum + val, 0);
      const totalSets = numberOfSets;
      const averageValue = totalValue / values.length;
      const averageSets = 1; // Chaque WorkoutSet est une série

      const data = exerciseSets.map((set) => ({
        date: set.date,
        value: isTimeBased ? (set.duree || 0) : (set.repetitions || 0),
        sets: 1
      }));

      return {
        exerciseId,
        exerciseName: exercise.nom,
        maxValue,
        totalValue,
        totalSets,
        averageValue,
        averageSets,
        type: isTimeBased ? 'temps' as const : 'repetitions' as const,
        data
      };
    }).filter(Boolean) as ExerciseStats[];
  }, [selectedExerciseIds, filteredWorkouts, exercises, averagePeriod]);

  const toggleExercise = (exerciseId: string) => {
    setSelectedExerciseIds(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const clearExerciseSelection = () => {
    setSelectedExerciseIds([]);
  };

  const hasActiveFilters = startDate !== '' || endDate !== '';

  return (
    <div className="min-h-screen flex flex-col bg-martial-primary-bg">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-martial-primary-bg via-martial-surface-1 to-martial-primary-bg opacity-20"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative">
            <div className="max-w-6xl mx-auto text-center px-4">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-martial-danger-accent rounded-full mx-auto mb-4 sm:mb-6">
                <ChartBarIcon className="h-7 w-7 sm:h-8 sm:w-8 text-martial-highlight" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-martial-highlight mb-3 sm:mb-4 bg-gradient-to-r from-martial-highlight to-martial-danger-accent bg-clip-text text-transparent">
                Analyse de progression
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-martial-steel max-w-2xl mx-auto">
                Analysez vos performances et suivez votre évolution dans vos exercices de calisthénie
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <ProgressFilters
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              averagePeriod={averagePeriod}
              setAveragePeriod={setAveragePeriod}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <ExerciseSelector
              isOpen={isExerciseGridOpen}
              onToggle={() => setIsExerciseGridOpen(!isExerciseGridOpen)}
              exercises={exercises}
              selectedExerciseIds={selectedExerciseIds}
              onToggleExercise={toggleExercise}
              onClearSelection={clearExerciseSelection}
            />

            {selectedExerciseIds.length > 0 && exerciseStats.length > 0 && (
              <div className="bg-martial-surface-1 border border-martial-steel/20 rounded-lg p-6 shadow-martial-lg">
                <ProgressCharts 
                  exerciseStats={exerciseStats}
                  singleExercise={selectedExerciseIds.length === 1}
                />
              </div>
            )}

            {selectedExerciseIds.length === 0 && (
              <div className="text-center py-16">
                <ChartBarIcon className="h-16 w-16 text-martial-steel mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-martial-highlight mb-2">
                  Sélectionnez des exercices
                </h3>
                <p className="text-martial-steel mb-6">
                  Choisissez les exercices dont vous souhaitez analyser la progression
                </p>
                <button
                  onClick={() => setIsExerciseGridOpen(true)}
                  className="inline-flex items-center justify-center martial-btn-theme font-semibold py-3 px-6 rounded-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-martial-danger-accent focus:ring-offset-2 focus:ring-offset-martial-primary-bg"
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Sélectionner des exercices
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ProgresPage() {
  return (
    <ProtectedRoute>
      <ProgressPageContent />
    </ProtectedRoute>
  );
}
