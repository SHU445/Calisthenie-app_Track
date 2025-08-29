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
      
      <main className="flex-1">
        {/* Header */}
        <section className="sport-section pt-20 pb-12 relative overflow-hidden">
          {/* Gradient de fond */}
          <div className="absolute inset-0 bg-gradient-to-br from-sport-primary via-sport-secondary to-sport-primary opacity-20"></div>
          
          <div className="sport-container relative">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-sport-accent rounded-full mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-sport-accent bg-clip-text text-transparent">
                ANALYSE DE PROGRESSION
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Analysez vos performances et suivez votre évolution dans vos exercices de calisthénie
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="sport-container">
            <div className="max-w-6xl mx-auto">

              {/* Panneau de filtres */}
              <div className="sport-card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Filtres d'analyse</h2>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center gap-2 bg-sport-accent hover:bg-sport-accent-light text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FunnelIcon className="h-4 w-4" />
                    <span>{isFilterOpen ? 'Masquer les filtres' : 'Afficher les filtres'}</span>
                  </button>
                </div>

                {isFilterOpen && (
                  <div className="space-y-6">
                    {/* Ligne principale avec 3 champs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Date de début
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="sport-input w-full"
                          placeholder="jj/mm/aaaa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="sport-input w-full"
                          placeholder="jj/mm/aaaa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Exercice à analyser
                        </label>
                        <div className="relative">
                          <div className="sport-input w-full text-left flex items-center justify-between cursor-default">
                            <span className="text-gray-400">
                              {selectedExerciseIds.length > 0 
                                ? `${selectedExerciseIds.length} exercice(s) sélectionné(s)`
                                : 'Exercices sélectionnés'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bouton masquer/afficher la sélection d'exercices */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setIsExerciseGridOpen(!isExerciseGridOpen)}
                        className="text-white text-sm font-medium hover:text-sport-accent transition-colors underline"
                      >
                        {isExerciseGridOpen ? 'Masquer la sélection d\'exercices' : 'Sélectionner des exercices'}
                      </button>
                      {selectedExerciseIds.length > 0 && (
                        <button
                          onClick={() => setSelectedExerciseIds([])}
                          className="text-sm text-gray-400 hover:text-red-400"
                        >
                          Tout désélectionner
                        </button>
                      )}
                    </div>

                    {/* Section d'exercices */}
                    {isExerciseGridOpen && (
                      <div>
                        {/* Grille d'exercices */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {exercises.map(exercise => (
                            <button
                              key={exercise.id}
                              onClick={() => {
                                if (selectedExerciseIds.includes(exercise.id)) {
                                  setSelectedExerciseIds(selectedExerciseIds.filter(id => id !== exercise.id));
                                } else {
                                  setSelectedExerciseIds([...selectedExerciseIds, exercise.id]);
                                }
                              }}
                              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                selectedExerciseIds.includes(exercise.id)
                                  ? 'bg-sport-accent text-white border-2 border-sport-accent'
                                  : 'bg-sport-gray-light/20 text-gray-300 border-2 border-transparent hover:bg-sport-gray-light/30 hover:text-white'
                              }`}
                            >
                              {exercise.nom}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Période pour les moyennes */}
                    <div>
                      <label className="block text-sm font-medium text-sport-accent mb-2">
                        Période de calcul des moyennes
                      </label>
                      <select
                        value={averagePeriod}
                        onChange={(e) => setAveragePeriod(e.target.value as PeriodOption)}
                        className="sport-input w-full"
                      >
                        <option value="1week">1 semaine</option>
                        <option value="1month">1 mois</option>
                        <option value="2months">2 mois</option>
                        <option value="3months">3 mois</option>
                        <option value="all">Toutes les données</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Affichage des données */}
              {selectedExerciseIds.length === 0 ? (
                <div className="sport-card p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-sport-gray-light/20 rounded-full mx-auto mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun exercice sélectionné</h3>
                  <p className="text-gray-400">
                    Sélectionnez un ou plusieurs exercices pour voir vos progrès.
                  </p>
                </div>
              ) : exerciseStats.length === 0 ? (
                <div className="sport-card p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-sport-gray-light/20 rounded-full mx-auto mb-4">
                    <CalendarDaysIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucune donnée trouvée</h3>
                  <p className="text-gray-400">
                    Aucune donnée trouvée pour la période sélectionnée.
                  </p>
                </div>
              ) : selectedExerciseIds.length === 1 ? (
                /* Affichage pour un seul exercice */
                <div className="space-y-6">
                  {exerciseStats.map(stats => (
                    <div key={stats.exerciseId}>
                      {/* Statistiques principales */}
                      <div className="sport-card p-6 mb-6">
                        <h3 className="text-2xl font-semibold text-white mb-4">
                          {stats.exerciseName}
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-sport-accent">
                              {formatValue(stats.maxValue, stats.type)}
                            </div>
                            <div className="text-sm text-gray-400">
                              Maximum
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {formatValue(stats.totalValue, stats.type)}
                            </div>
                            <div className="text-sm text-gray-400">
                              Total
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">
                              {stats.totalSets}
                            </div>
                            <div className="text-sm text-gray-400">
                              Séries totales
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">
                              {formatValue(stats.averageValue, stats.type)}
                            </div>
                            <div className="text-sm text-gray-400">
                              Moyenne ({formatPeriod(averagePeriod)})
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">
                              {Math.round(stats.averageSets * 10) / 10}
                            </div>
                            <div className="text-sm text-gray-400">
                              Séries/jour ({formatPeriod(averagePeriod)})
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Graphiques */}
                      <div className="sport-card p-6">
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
                      <div key={stats.exerciseId} className="sport-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {stats.exerciseName}
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Maximum:</span>
                            <span className="text-sm font-semibold text-sport-accent">
                              {formatValue(stats.maxValue, stats.type)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Total:</span>
                            <span className="text-sm font-semibold text-green-400">
                              {formatValue(stats.totalValue, stats.type)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Séries:</span>
                            <span className="text-sm font-semibold text-purple-400">
                              {stats.totalSets}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Moyenne:</span>
                            <span className="text-sm font-semibold text-orange-400">
                              {formatValue(stats.averageValue, stats.type)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Séries/jour:</span>
                            <span className="text-sm font-semibold text-red-400">
                              {Math.round(stats.averageSets * 10) / 10}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Graphiques */}
                  <div className="sport-card p-6">
                    <ProgressCharts 
                      exerciseStats={exerciseStats} 
                      singleExercise={false}
                      distributionData={distributionData}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}