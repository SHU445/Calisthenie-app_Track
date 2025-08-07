'use client';

import { useState, useEffect, useMemo } from 'react';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useAuthStore } from '@/stores/authStore';
import { Exercise, Workout, WorkoutSet, QuantificationType } from '@/types';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  FunnelIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import ProgressCharts from '@/components/ProgressCharts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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

export default function ProgressPage() {
  const { user } = useAuthStore();
  const { exercises, fetchExercises } = useExerciseStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();

  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [averagePeriod, setAveragePeriod] = useState<PeriodOption>('3months');

  useEffect(() => {
    if (user) {
      fetchExercises();
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

    return selectedExerciseIds.map(exerciseId => {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (!exercise) return null;

      // Déterminer le type d'exercice (répétitions ou temps)
      // Utiliser le nouveau champ typeQuantification si disponible, sinon fallback sur l'ancienne logique
      const isTimeBasedExercise = exercise.typeQuantification 
        ? exercise.typeQuantification === 'hold'
        : exercise.nom.toLowerCase().includes('hold') || 
          exercise.nom.toLowerCase().includes('planche') ||
          exercise.nom.toLowerCase().includes('l-sit') ||
          exercise.nom.toLowerCase().includes('handstand') ||
          exercise.categorie === 'Core/Abdos';

      // Collecter toutes les séries pour cet exercice
      const exerciseSets: Array<{ date: string; set: WorkoutSet; workout: Workout }> = [];
      
      filteredWorkouts.forEach(workout => {
        workout.sets
          .filter(set => set.exerciceId === exerciseId)
          .forEach(set => {
            exerciseSets.push({ date: workout.date, set, workout });
          });
      });

      if (exerciseSets.length === 0) return null;

      // Grouper par date et calculer les totaux par jour
      const dailyData = exerciseSets.reduce((acc, { date, set }) => {
        if (!acc[date]) {
          acc[date] = { totalValue: 0, totalSets: 0, maxValue: 0 };
        }
        
        const value = isTimeBasedExercise ? (set.duree || 0) : set.repetitions;
        acc[date].totalValue += value;
        acc[date].totalSets += 1;
        acc[date].maxValue = Math.max(acc[date].maxValue, value);
        
        return acc;
      }, {} as Record<string, { totalValue: number; totalSets: number; maxValue: number }>);

      // Convertir en array et trier par date
      const sortedData = Object.entries(dailyData)
        .map(([date, data]) => ({
          date,
          value: data.maxValue, // Utiliser la meilleure performance du jour
          sets: data.totalSets
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculer les statistiques globales
      const allValues = exerciseSets.map(({ set }) => 
        isTimeBasedExercise ? (set.duree || 0) : set.repetitions
      );
      
      const maxValue = Math.max(...allValues);
      const totalValue = allValues.reduce((sum, val) => sum + val, 0);
      const totalSets = exerciseSets.length;

      // Calculer les moyennes selon la période sélectionnée
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
          periodDate.setFullYear(2000); // Toutes les données
      }

      const periodSets = exerciseSets.filter(({ date }) => 
        new Date(date) >= periodDate
      );

      const periodValues = periodSets.map(({ set }) => 
        isTimeBasedExercise ? (set.duree || 0) : set.repetitions
      );

      const averageValue = periodValues.length > 0 
        ? periodValues.reduce((sum, val) => sum + val, 0) / periodValues.length 
        : 0;

      // Grouper par jour pour calculer la moyenne de séries
      const periodDailyData = periodSets.reduce((acc, { date }) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const averageSets = Object.keys(periodDailyData).length > 0
        ? Object.values(periodDailyData).reduce((sum, val) => sum + val, 0) / Object.keys(periodDailyData).length
        : 0;

      return {
        exerciseId,
        exerciseName: exercise.nom,
        maxValue,
        totalValue,
        totalSets,
        averageValue,
        averageSets,
        type: isTimeBasedExercise ? 'temps' : 'repetitions',
        data: sortedData
      } as ExerciseStats;
    }).filter(Boolean) as ExerciseStats[];
  }, [selectedExerciseIds, exercises, filteredWorkouts, averagePeriod]);

  // Calculer les données de répartition pour les graphiques polar area
  const distributionData = useMemo((): DistributionData | undefined => {
    if (selectedExerciseIds.length <= 1) return undefined;

    // Filtrer les entraînements selon la période de calcul des moyennes
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
        periodDate.setFullYear(2000); // Toutes les données
    }

    const periodWorkouts = filteredWorkouts.filter(workout => 
      new Date(workout.date) >= periodDate
    );

    const labels: string[] = [];
    const values: number[] = [];
    const sets: number[] = [];

    selectedExerciseIds.forEach(exerciseId => {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (!exercise) return;

      // Déterminer le type d'exercice
      const isTimeBasedExercise = exercise.typeQuantification 
        ? exercise.typeQuantification === 'hold'
        : exercise.nom.toLowerCase().includes('hold') || 
          exercise.nom.toLowerCase().includes('planche') ||
          exercise.nom.toLowerCase().includes('l-sit') ||
          exercise.nom.toLowerCase().includes('handstand') ||
          exercise.categorie === 'Core/Abdos';

      // Calculer les totaux pour cet exercice dans la période
      let totalValue = 0;
      let totalSets = 0;

      periodWorkouts.forEach(workout => {
        workout.sets
          .filter(set => set.exerciceId === exerciseId)
          .forEach(set => {
            const value = isTimeBasedExercise ? (set.duree || 0) : set.repetitions;
            totalValue += value;
            totalSets += 1;
          });
      });

      if (totalSets > 0) {
        labels.push(exercise.nom);
        values.push(totalValue);
        sets.push(totalSets);
      }
    });

    return labels.length > 1 ? { labels, values, sets } : undefined;
  }, [selectedExerciseIds, exercises, filteredWorkouts, averagePeriod]);

  const formatValue = (value: number, type: 'repetitions' | 'temps') => {
    if (type === 'temps') {
      return `${Math.round(value)}s`;
    }
    return `${Math.round(value)} rep`;
  };

  const formatPeriod = (period: PeriodOption) => {
    switch (period) {
      case '1week': return '1 semaine';
      case '1month': return '1 mois';
      case '2months': return '2 mois';
      case '3months': return '3 mois';
      case 'all': return 'Toutes les données';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* En-tête de section avec style amélioré */}
          <div className="text-center mb-12 pt-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sport-primary to-sport-accent rounded-full mx-auto mb-6 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Suivi des Progrès
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Analysez vos performances et suivez votre évolution dans vos exercices de calisthénie
            </p>
          </div>

        {/* Widget de filtres amélioré */}
        <div className="bg-gradient-to-r from-sport-accent/20 to-sport-secondary/20 dark:from-sport-dark dark:to-sport-dark-light rounded-xl shadow-lg border border-sport-accent/30 dark:border-sport-gray-light mb-8 overflow-hidden">
          {/* En-tête des filtres */}
          <div className="bg-white/70 dark:bg-sport-secondary/70 backdrop-blur-sm border-b border-sport-accent/30 dark:border-sport-gray-light">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-sport-accent/20 dark:hover:bg-sport-gray-light/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sport-accent/20 dark:bg-sport-accent/50 rounded-lg">
                  <FunnelIcon className="w-5 h-5 text-sport-primary dark:text-sport-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-sport-dark dark:text-white">
                    Filtres de Progression
                  </h2>
                  <p className="text-sm text-sport-gray-light dark:text-sport-gray-lighter">
                    {selectedExerciseIds.length > 0 
                      ? `${selectedExerciseIds.length} exercice(s) sélectionné(s)`
                      : 'Aucun exercice sélectionné'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedExerciseIds.length > 0 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExerciseIds([]);
                      setStartDate('');
                      setEndDate('');
                      setAveragePeriod('3months');
                    }}
                    className="p-1 hover:bg-sport-danger/20 dark:hover:bg-sport-danger/30 rounded-md transition-colors duration-200 cursor-pointer"
                    title="Réinitialiser les filtres"
                  >
                    <XMarkIcon className="w-4 h-4 text-sport-danger" />
                  </div>
                )}
                {isFilterOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-sport-primary dark:text-sport-accent" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-sport-primary dark:text-sport-accent" />
                )}
              </div>
            </button>
          </div>

          {isFilterOpen && (
            <div className="p-6 space-y-6">
              {/* Sélection des exercices améliorée */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-sport-success/20 dark:bg-sport-success/50 rounded-md">
                    <svg className="w-4 h-4 text-sport-success dark:text-sport-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Sélection des Exercices
                  </label>
                  <span className="px-2 py-1 bg-sport-accent/20 dark:bg-sport-accent/50 text-sport-primary dark:text-sport-accent text-xs rounded-full font-medium">
                    {selectedExerciseIds.length}/{exercises.length}
                  </span>
                </div>
                <div className="bg-white dark:bg-sport-secondary rounded-lg border border-sport-gray-light dark:border-sport-gray-light max-h-48 overflow-y-auto shadow-inner">
                  <div className="p-3 space-y-2">
                    {exercises.map(exercise => (
                      <label 
                        key={exercise.id} 
                        className="flex items-center space-x-3 p-2 hover:bg-sport-accent/10 dark:hover:bg-sport-gray-light rounded-md cursor-pointer transition-colors duration-150"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExerciseIds.includes(exercise.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExerciseIds([...selectedExerciseIds, exercise.id]);
                            } else {
                              setSelectedExerciseIds(selectedExerciseIds.filter(id => id !== exercise.id));
                            }
                          }}
                          className="w-4 h-4 text-sport-primary bg-sport-accent/20 border-sport-gray-light rounded focus:ring-sport-primary dark:focus:ring-sport-accent dark:ring-offset-sport-dark focus:ring-2 dark:bg-sport-secondary dark:border-sport-gray-light"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-sport-dark dark:text-white">
                              {exercise.nom}
                            </span>
                            {/* Indicateur du type de graphique */}
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex items-center gap-1 ${
                              (exercise.typeQuantification || 'rep') === 'hold' 
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {(exercise.typeQuantification || 'rep') === 'hold' ? '📊 Barres' : '📈 Courbes'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              exercise.categorie === 'Haut du corps' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              exercise.categorie === 'Core/Abdos' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              exercise.categorie === 'Bas du corps' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {exercise.categorie}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${
                              exercise.difficulte === 'F' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700' :
                              exercise.difficulte === 'D' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700' :
                              exercise.difficulte === 'C' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700' :
                              exercise.difficulte === 'B' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700' :
                              'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700'
                            }`}>
                              Rang {exercise.difficulte}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              (exercise.typeQuantification || 'rep') === 'hold' 
                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {(exercise.typeQuantification || 'rep') === 'hold' ? '⏱️ Hold' : '🔢 Rep'}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sélection des dates améliorée */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                      <CalendarDaysIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Date de Début
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                      <CalendarDaysIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Date de Fin
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Période pour les moyennes améliorée */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                                      <div className="p-1.5 bg-sport-warning/20 dark:bg-sport-warning/50 rounded-md">
                      <ClockIcon className="w-4 h-4 text-sport-warning dark:text-sport-warning" />
                  </div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Période de Calcul des Moyennes
                  </label>
                </div>
                <div className="relative">
                  <select
                    value={averagePeriod}
                    onChange={(e) => setAveragePeriod(e.target.value as PeriodOption)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white appearance-none transition-all duration-200"
                  >
                    <option value="1week">📅 1 semaine</option>
                    <option value="1month">📅 1 mois</option>
                    <option value="2months">📅 2 mois</option>
                    <option value="3months">📅 3 mois</option>
                    <option value="all">📊 Toutes les données</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Aperçu des filtres actifs */}
              {(selectedExerciseIds.length > 0 || startDate || endDate) && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    Filtres Actifs :
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExerciseIds.length > 0 && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                        {selectedExerciseIds.length} exercice(s)
                      </span>
                    )}
                    {startDate && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm rounded-full">
                        Depuis le {new Date(startDate).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    {endDate && (
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-sm rounded-full">
                        Jusqu'au {new Date(endDate).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                      Moyennes: {formatPeriod(averagePeriod)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Affichage des données */}
        {selectedExerciseIds.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Sélectionnez un ou plusieurs exercices pour voir vos progrès.
            </p>
          </div>
        ) : exerciseStats.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune donnée trouvée pour la période sélectionnée.
            </p>
          </div>
        ) : selectedExerciseIds.length === 1 ? (
          /* Affichage pour un seul exercice */
          <div className="space-y-6">
            {exerciseStats.map(stats => (
              <div key={stats.exerciseId}>
                {/* Statistiques principales */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {stats.exerciseName}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatValue(stats.maxValue, stats.type)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Maximum
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatValue(stats.totalValue, stats.type)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.totalSets}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Séries totales
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formatValue(stats.averageValue, stats.type)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Moyenne ({formatPeriod(averagePeriod)})
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {Math.round(stats.averageSets * 10) / 10}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Séries/jour ({formatPeriod(averagePeriod)})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphiques */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <ProgressCharts 
                    exerciseStats={[stats]} 
                    singleExercise={true}
                    distributionData={distributionData}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Affichage pour plusieurs exercices */
          <div className="space-y-8">
            {/* Statistiques par exercice */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exerciseStats.map(stats => (
                <div key={stats.exerciseId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {stats.exerciseName}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Maximum:</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {formatValue(stats.maxValue, stats.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatValue(stats.totalValue, stats.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Séries:</span>
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {stats.totalSets}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Moyenne:</span>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {formatValue(stats.averageValue, stats.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Séries/jour:</span>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {Math.round(stats.averageSets * 10) / 10}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphiques */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <ProgressCharts 
                exerciseStats={exerciseStats} 
                singleExercise={false}
                distributionData={distributionData}
              />
            </div>
          </div>
        )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}