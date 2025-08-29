'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  calculateExerciseDensity, 
  calculateWorkoutDensity, 
  formatDensity, 
  formatWorkoutDensity,
  calculateExerciseIntensity,
  calculateWorkoutIntensity,
  formatIntensity,
  getIntensityColor
} from '@/lib/utils';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CalendarDaysIcon,
  FireIcon,
  InformationCircleIcon,
  PlusIcon,
  ChartBarIcon,
  StarIcon,
  TrophyIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

interface ExerciseGroup {
  exerciceId: string;
  nom: string;
  sets: Array<{
    id: string;
    repetitions: number;
    poids?: number;
    duree?: number;
    tempsRepos: number;
    notes?: string;
  }>;
  totalSets: number;
  totalReps: number;
  totalTime: number;
  totalWeight: number;
  avgRest: number;
  maxWeight: number;
  exercise?: any;
  isTimeBasedExercise: boolean;
  density: number;
  densityFormatted: {
    perSecond: string;
    perMinute: string;
    unit: string;
  };
  intensity: number;
  intensityFormatted: string;
  intensityInfo: {
    color: string;
    label: string;
  };
}

export default function DetailSeancePage() {
  const params = useParams();
  const router = useRouter();
  const workoutId = params.id as string;
  const { user } = useAuthStore();
  const { workouts, fetchWorkouts, deleteWorkout, isLoading } = useWorkoutStore();
  const { exercises, fetchExercises } = useExerciseStore();
  const { personalRecords, fetchPersonalRecords } = useProgressStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const workout = workouts.find(w => w.id === workoutId);

  useEffect(() => {
    if (user?.id && workouts.length === 0) {
      fetchWorkouts(user.id);
    }
    if (exercises.length === 0) {
      fetchExercises(user?.id);
    }
    if (user?.id && personalRecords.length === 0) {
      fetchPersonalRecords(user.id);
    }
  }, [user?.id, workouts.length, exercises.length, personalRecords.length, fetchWorkouts, fetchExercises, fetchPersonalRecords]);

  const handleDeleteWorkout = async () => {
    try {
      await deleteWorkout(workoutId);
      router.push('/entrainements');
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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatExerciseTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}min`;
    }
    return `${minutes}min ${remainingSeconds}s`;
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.nom || 'Exercice inconnu';
  };

  const getExerciseInfo = (exerciseId: string) => {
    return exercises.find(ex => ex.id === exerciseId);
  };

  const getWorkoutStats = () => {
    if (!workout) return { 
      totalSets: 0, 
      totalReps: 0, 
      totalHoldTime: 0,
      totalWeight: 0, 
      avgIntensity: 0, 
      uniqueExercises: 0,
      workoutDensity: 0,
      workoutDensityFormatted: { perSecond: '0.000 unités/s', perMinute: '≈ 0 unités/min' },
      workoutIntensity: 0,
      workoutIntensityFormatted: '0%',
      workoutIntensityInfo: { color: 'text-gray-400', label: 'Non défini' },
      hasWeights: false
    };
    
    const totalSets = workout.sets.length;
    const totalReps = workout.sets.reduce((sum, set) => sum + (set.repetitions || 0), 0);
    const totalHoldTime = workout.sets.reduce((sum, set) => sum + (set.duree || 0), 0);
    const totalWeight = workout.sets.reduce((sum, set) => sum + ((set.poids || 0) * (set.repetitions || 0)), 0);
    const uniqueExercises = new Set(workout.sets.map(set => set.exerciceId)).size;
    const avgIntensity = totalSets > 0 ? Math.round((totalWeight / totalSets) * 10) / 10 : 0;
    
    // Vérifier s'il y a des charges renseignées
    const hasWeights = workout.sets.some(set => set.poids && set.poids > 0);
    
    // Calculer la densité totale de la séance
    const workoutDensity = calculateWorkoutDensity(workout.sets, exercises);
    const workoutDensityFormatted = formatWorkoutDensity(workoutDensity);
    
    // Calculer l'intensité totale de la séance
    const workoutIntensity = calculateWorkoutIntensity(workout.sets, exercises, personalRecords);
    const workoutIntensityFormatted = formatIntensity(workoutIntensity);
    const workoutIntensityInfo = getIntensityColor(workoutIntensity);
    
    return { 
      totalSets, 
      totalReps, 
      totalHoldTime,
      totalWeight, 
      avgIntensity, 
      uniqueExercises,
      workoutDensity,
      workoutDensityFormatted,
      workoutIntensity,
      workoutIntensityFormatted,
      workoutIntensityInfo,
      hasWeights
    };
  };

  const getGroupedExercises = (): ExerciseGroup[] => {
    if (!workout) return [];

    const groups = workout.sets.reduce((acc, set) => {
      if (!acc[set.exerciceId]) {
        acc[set.exerciceId] = [];
      }
      acc[set.exerciceId].push(set);
      return acc;
    }, {} as Record<string, typeof workout.sets>);

    return Object.entries(groups).map(([exerciceId, sets]) => {
      const exercise = getExerciseInfo(exerciceId);
      const isTimeBasedExercise = sets.some(set => set.duree && set.repetitions === 0);
      const totalReps = sets.reduce((sum, set) => sum + (set.repetitions || 0), 0);
      const totalTime = sets.reduce((sum, set) => sum + (set.duree || 0), 0);
      const totalWeight = sets.reduce((sum, set) => sum + ((set.poids || 0) * (set.repetitions || 0)), 0);
      const avgRest = sets.reduce((sum, set) => sum + (set.tempsRepos || 0), 0) / sets.length;
      const maxWeight = Math.max(...sets.map(set => set.poids || 0));

      // Calculer la densité de l'exercice
      let density = 0;
      let densityFormatted = {
        perSecond: '0.000 rép/s',
        perMinute: '≈ 0 rép/min',
        unit: 'rép'
      };

      // Calculer l'intensité de l'exercice
      let intensity = 0;
      let intensityFormatted = '0%';
      let intensityInfo = {
        color: 'text-gray-400',
        label: 'Non défini'
      };

      if (exercise) {
        density = calculateExerciseDensity(sets, exercise);
        densityFormatted = formatDensity(density, exercise.typeQuantification);
        
        intensity = calculateExerciseIntensity(sets, exercise, personalRecords);
        intensityFormatted = formatIntensity(intensity);
        intensityInfo = getIntensityColor(intensity);
      }

      return {
        exerciceId,
        nom: getExerciseName(exerciceId),
        sets: sets.map(set => ({
          id: set.id,
          repetitions: set.repetitions,
          poids: set.poids,
          duree: set.duree,
          tempsRepos: set.tempsRepos,
          notes: set.notes
        })),
        totalSets: sets.length,
        totalReps,
        totalTime,
        totalWeight,
        avgRest: Math.round(avgRest),
        maxWeight,
        exercise,
        isTimeBasedExercise,
        density,
        densityFormatted,
        intensity,
        intensityFormatted,
        intensityInfo
      };
    });
  };

  const getDifficultyColor = (rank: string) => {
    const colors = {
      'F': 'text-gray-400',
      'D': 'text-green-400',
      'C': 'text-blue-400',
      'B': 'text-purple-400',
      'A': 'text-orange-400',
      'S': 'text-yellow-400',
      'SS': 'text-red-400'
    };
    return colors[rank as keyof typeof colors] || 'text-gray-400';
  };

  const getIntensityLevel = (ressenti: number) => {
    if (ressenti <= 2) return { label: 'Facile', color: 'text-green-400', icon: '😌' };
    if (ressenti === 3) return { label: 'Modéré', color: 'text-yellow-400', icon: '😐' };
    if (ressenti === 4) return { label: 'Difficile', color: 'text-orange-400', icon: '😤' };
    return { label: 'Très difficile', color: 'text-red-400', icon: '🥵' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sport-accent mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement de la séance...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Séance non trouvée
            </h3>
            <p className="text-gray-400 mb-6">
              Cette séance n'existe pas ou a été supprimée
            </p>
            <Link href="/entrainements" className="sport-btn-primary">
              Retour aux entraînements
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = getWorkoutStats();
  const groupedExercises = getGroupedExercises();
  const intensityInfo = getIntensityLevel(workout.ressenti);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Header amélioré */}
        <section className="sport-section pt-20 pb-12 relative overflow-hidden">
          {/* Gradient de fond */}
          <div className="absolute inset-0 bg-gradient-to-br from-sport-primary via-sport-secondary to-sport-primary opacity-20"></div>
          
          <div className="sport-container relative">
            <div className="max-w-6xl mx-auto">
              {/* Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <Link 
                  href="/entrainements" 
                  className="inline-flex items-center gap-2 text-sport-accent hover:text-sport-accent-light transition-colors mb-4 sm:mb-0"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Retour à l'historique</span>
                </Link>
                
                <div className="flex items-center gap-2">
                  <Link
                    href={`/entrainements/modifier/${workout.id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Modifier</span>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>

              {/* Titre et badge de type */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="bg-sport-accent text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {workout.type}
                  </span>
                  <span className={`${intensityInfo.color} text-2xl`}>
                    {intensityInfo.icon}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-sport-accent bg-clip-text text-transparent">
                  {workout.nom}
                </h1>
                <p className="text-xl text-gray-300 mb-2">
                  {formatDate(workout.date)} à {formatTime(workout.date)}
                </p>
                <div className={`text-lg ${intensityInfo.color} font-semibold`}>
                  Ressenti : {intensityInfo.label} ({workout.ressenti}/5)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques principales améliorées */}
        <section className="pb-8">
          <div className="sport-container">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                <div className="sport-card p-6 text-center group hover:scale-105 transition-transform">
                  <TrophyIcon className="h-8 w-8 text-sport-accent mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{stats.uniqueExercises}</div>
                  <div className="text-sm text-gray-400">Exercices</div>
                </div>
                <div className="sport-card p-6 text-center group hover:scale-105 transition-transform">
                  <ChartBarIcon className="h-8 w-8 text-sport-accent mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{stats.totalSets}</div>
                  <div className="text-sm text-gray-400">Séries</div>
                </div>
                <div className="sport-card p-6 text-center group hover:scale-105 transition-transform">
                  <BoltIcon className="h-8 w-8 text-sport-accent mx-auto mb-2" />
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">{stats.totalReps}</div>
                    <div className="text-xs text-gray-400">répétitions</div>
                    {stats.totalHoldTime > 0 && (
                      <>
                        <div className="text-2xl font-bold text-sport-accent">{formatExerciseTime(stats.totalHoldTime)}</div>
                        <div className="text-xs text-gray-400">temps total</div>
                      </>
                    )}
                  </div>
                </div>
                <div className="sport-card p-6 text-center group hover:scale-105 transition-transform">
                  <ClockIcon className="h-8 w-8 text-sport-accent mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{formatDuration(workout.duree)}</div>
                  <div className="text-sm text-gray-400">Durée</div>
                </div>
                <div className="sport-card p-6 text-center group hover:scale-105 transition-transform">
                  <StarIcon className="h-8 w-8 text-sport-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{Math.round(stats.workoutDensity * 60)}</div>
                  <div className="text-sm text-gray-400">unités/min</div>
                  <div className="text-xs text-gray-500">Densité</div>
                </div>
                <div className="sport-card p-6 text-center group hover:scale-105 transition-transform">
                  <BoltIcon className="h-8 w-8 text-sport-accent mx-auto mb-2" />
                  <div className={`text-2xl font-bold ${stats.workoutIntensityInfo.color}`}>
                    {stats.workoutIntensityFormatted}
                  </div>
                  <div className="text-xs text-gray-400">{stats.workoutIntensityInfo.label}</div>
                  <div className="text-xs text-gray-500">Intensité</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notes générales */}
        {workout.description && (
          <section className="pb-8">
            <div className="sport-container">
              <div className="max-w-6xl mx-auto">
                <div className="sport-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <InformationCircleIcon className="h-6 w-6 text-sport-accent" />
                    Notes de la séance
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{workout.description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Exercices regroupés */}
        <section className="pb-16">
          <div className="sport-container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Exercices réalisés</h2>
                <div className="flex items-center gap-4">
                  <div className="flex bg-sport-gray-light/20 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'cards' 
                          ? 'bg-sport-accent text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Cartes
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'table' 
                          ? 'bg-sport-accent text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Tableau
                    </button>
                  </div>
                  <Link
                    href={`/entrainements/modifier/${workout.id}`}
                    className="inline-flex items-center gap-2 bg-sport-accent hover:bg-sport-accent-light text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Modifier</span>
                  </Link>
                </div>
              </div>

              {groupedExercises.length > 0 ? (
                viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {groupedExercises.map((group) => (
                      <div key={group.exerciceId} className="sport-card p-6 hover:border-sport-accent/50 transition-all group">
                        {/* En-tête de l'exercice */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <button
                              onClick={() => setSelectedExercise(group.exerciceId)}
                              className="text-xl font-bold text-white hover:text-sport-accent transition-colors text-left group-hover:text-sport-accent"
                            >
                              {group.nom}
                            </button>
                            {group.exercise && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="bg-sport-secondary text-sport-accent text-xs px-2 py-1 rounded-full">
                                  {group.exercise.categorie}
                                </span>
                                <span className={`text-xs font-bold ${getDifficultyColor(group.exercise.difficulte)}`}>
                                  Rang {group.exercise.difficulte}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-sport-accent">{group.totalSets}</div>
                            <div className="text-xs text-gray-400">séries</div>
                          </div>
                        </div>

                        {/* Statistiques de l'exercice */}
                        <div className={`grid grid-cols-2 gap-4 mb-4 p-4 bg-sport-gray-light/10 rounded-lg ${stats.hasWeights ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
                          <div className="text-center">
                            {group.isTimeBasedExercise ? (
                              <>
                                <div className="text-lg font-bold text-white">{formatExerciseTime(group.totalTime)}</div>
                                <div className="text-xs text-gray-400">temps total</div>
                              </>
                            ) : (
                              <>
                                <div className="text-lg font-bold text-white">{group.totalReps}</div>
                                <div className="text-xs text-gray-400">répétitions</div>
                              </>
                            )}
                          </div>
                          {stats.hasWeights && (
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">{group.maxWeight || 0}kg</div>
                              <div className="text-xs text-gray-400">charge max</div>
                            </div>
                          )}
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">{Math.floor(group.avgRest / 60)}:{(group.avgRest % 60).toString().padStart(2, '0')}</div>
                            <div className="text-xs text-gray-400">repos moy.</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-sport-accent">{Math.round(group.density * 60)}</div>
                            <div className="text-xs text-gray-400">{group.densityFormatted.unit}/min</div>
                            <div className="text-xs text-gray-500">densité</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${group.intensityInfo.color}`}>
                              {group.intensityFormatted}
                            </div>
                            <div className="text-xs text-gray-400">{group.intensityInfo.label}</div>
                            <div className="text-xs text-gray-500">intensité</div>
                          </div>
                        </div>

                        {/* Détail des séries */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-sport-accent mb-2">Détail des séries :</h4>
                          {group.sets.map((set, index) => (
                            <div key={set.id} className="flex items-center justify-between py-2 px-3 bg-sport-gray-light/5 rounded text-sm">
                              <span className="text-gray-400">Série {index + 1}</span>
                              <div className="flex items-center gap-4 text-gray-300">
                                {group.isTimeBasedExercise ? (
                                  <span>{formatExerciseTime(set.duree || 0)}</span>
                                ) : (
                                  <span>{set.repetitions} rép.</span>
                                )}
                                {stats.hasWeights && set.poids && <span>{set.poids}kg</span>}
                                <span>{Math.floor(set.tempsRepos / 60)}:{(set.tempsRepos % 60).toString().padStart(2, '0')}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Notes de l'exercice */}
                        {group.sets.some(set => set.notes) && (
                          <div className="mt-4 pt-4 border-t border-sport-gray-light/20">
                            <h4 className="text-sm font-semibold text-sport-accent mb-2">Notes :</h4>
                            {group.sets.filter(set => set.notes).map((set, index) => (
                              <p key={index} className="text-sm text-gray-300 italic">• {set.notes}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Vue tableau améliorée
                  <div className="sport-card p-6 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-sport-accent/30">
                          <th className="text-left py-4 px-4 text-sport-accent font-bold">Exercice</th>
                          <th className="text-center py-4 px-4 text-sport-accent font-bold">Séries</th>
                          <th className="text-center py-4 px-4 text-sport-accent font-bold">Rép./Temps</th>
                          {stats.hasWeights && <th className="text-center py-4 px-4 text-sport-accent font-bold">Charge max</th>}
                          <th className="text-center py-4 px-4 text-sport-accent font-bold">Repos moy.</th>
                          <th className="text-center py-4 px-4 text-sport-accent font-bold">Densité</th>
                          <th className="text-center py-4 px-4 text-sport-accent font-bold">Intensité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedExercises.map((group) => (
                          <tr key={group.exerciceId} className="border-b border-sport-gray-light/10 hover:bg-sport-gray-light/5 transition-colors">
                            <td className="py-4 px-4">
                              <button
                                onClick={() => setSelectedExercise(group.exerciceId)}
                                className="text-white hover:text-sport-accent transition-colors font-medium text-left"
                              >
                                {group.nom}
                              </button>
                              {group.exercise && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="bg-sport-secondary text-sport-accent text-xs px-2 py-1 rounded-full">
                                    {group.exercise.categorie}
                                  </span>
                                  <span className={`text-xs font-bold ${getDifficultyColor(group.exercise.difficulte)}`}>
                                    Rang {group.exercise.difficulte}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-2xl font-bold text-sport-accent">{group.totalSets}</span>
                            </td>
                            <td className="py-4 px-4 text-center text-white font-semibold">
                              {group.isTimeBasedExercise ? formatExerciseTime(group.totalTime) : group.totalReps}
                            </td>
                            {stats.hasWeights && (
                              <td className="py-4 px-4 text-center text-white font-semibold">
                                {group.maxWeight || 0}kg
                              </td>
                            )}
                            <td className="py-4 px-4 text-center text-gray-300">
                              {Math.floor(group.avgRest / 60)}:{(group.avgRest % 60).toString().padStart(2, '0')}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="text-lg font-bold text-sport-accent">{Math.round(group.density * 60)}</div>
                              <div className="text-xs text-gray-400">{group.densityFormatted.unit}/min</div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className={`text-lg font-bold ${group.intensityInfo.color}`}>
                                {group.intensityFormatted}
                              </div>
                              <div className="text-xs text-gray-400">{group.intensityInfo.label}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="sport-card p-12 text-center">
                  <InformationCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun exercice</h3>
                  <p className="text-gray-400 mb-6">Cette séance ne contient aucun exercice</p>
                  <Link
                    href={`/entrainements/modifier/${workout.id}`}
                    className="sport-btn-primary"
                  >
                    Ajouter des exercices
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Modal d'info exercice améliorée */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-sport-gray-dark/95 backdrop-blur-sm border border-sport-gray-light/30 rounded-xl p-6 max-w-lg w-full shadow-2xl">
            {(() => {
              const exercise = getExerciseInfo(selectedExercise);
              if (!exercise) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{exercise.nom}</h3>
                    <button
                      onClick={() => setSelectedExercise(null)}
                      className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-sport-gray-light/20 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="bg-sport-secondary text-sport-accent text-sm px-3 py-1 rounded-full font-semibold">
                        {exercise.categorie}
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full border ${getDifficultyColor(exercise.difficulte)} border-current`}>
                        Rang {exercise.difficulte}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-sport-accent mb-3">Description</h4>
                      <p className="text-gray-300 leading-relaxed">{exercise.description}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-sport-accent mb-3">Muscles ciblés</h4>
                      <div className="flex flex-wrap gap-2">
                        {exercise.muscles.map((muscle, index) => (
                          <span
                            key={index}
                            className="text-sm bg-sport-gray-light/20 text-gray-300 px-3 py-1 rounded-full border border-sport-gray-light/30"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-sport-gray-dark/95 backdrop-blur-sm border border-sport-gray-light/30 rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-sport-gray-light/30 text-gray-300 rounded-lg hover:bg-sport-gray-light/10 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteWorkout}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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