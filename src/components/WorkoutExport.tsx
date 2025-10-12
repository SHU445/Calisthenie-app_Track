'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Workout } from '@/types';
import { useThemeStore } from '@/stores/themeStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';
import { 
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  TrophyIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface WorkoutExportProps {
  workout: Workout;
  exercises?: any[];
  personalRecords?: any[];
  onClose: () => void;
}

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
}

export default function WorkoutExport({ workout, exercises: propExercises, personalRecords: propPersonalRecords, onClose }: WorkoutExportProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { exercises, fetchExercises } = useExerciseStore();
  const { personalRecords, fetchPersonalRecords } = useProgressStore();
  const [isExporting, setIsExporting] = useState(false);

  // Utiliser les props si fournies, sinon charger depuis les stores
  const finalExercises = propExercises && propExercises.length > 0 ? propExercises : exercises;
  const finalPersonalRecords = propPersonalRecords && propPersonalRecords.length > 0 ? propPersonalRecords : personalRecords;

  useEffect(() => {
    // Charger les exercices et records si pas fournis en props
    if (user?.id) {
      if (!propExercises || propExercises.length === 0) {
        fetchExercises(user.id);
      }
      if (!propPersonalRecords || propPersonalRecords.length === 0) {
        fetchPersonalRecords(user.id);
      }
    }
  }, [user?.id, propExercises, propPersonalRecords, fetchExercises, fetchPersonalRecords]);

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
    const exercise = finalExercises.find(ex => ex.id === exerciseId);
    return exercise?.nom || 'Exercice inconnu';
  };

  const getExerciseInfo = (exerciseId: string) => {
    return finalExercises.find(ex => ex.id === exerciseId);
  };

  const getWorkoutStats = () => {
    const totalSets = workout.sets.length;
    const totalReps = workout.sets.reduce((sum, set) => sum + (set.repetitions || 0), 0);
    const totalHoldTime = workout.sets.reduce((sum, set) => sum + (set.duree || 0), 0);
    const totalWeight = workout.sets.reduce((sum, set) => sum + ((set.poids || 0) * (set.repetitions || 0)), 0);
    const uniqueExercises = new Set(workout.sets.map(set => set.exerciceId)).size;
    const hasWeights = workout.sets.some(set => set.poids && set.poids > 0);
    
    return { 
      totalSets, 
      totalReps, 
      totalHoldTime,
      totalWeight, 
      uniqueExercises,
      hasWeights
    };
  };

  const getGroupedExercises = (): ExerciseGroup[] => {
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
        isTimeBasedExercise
      };
    });
  };

  const getIntensityLevel = (ressenti: number) => {
    if (ressenti <= 2) return { label: 'Facile', color: 'text-green-400', icon: '😌' };
    if (ressenti === 3) return { label: 'Modéré', color: 'text-yellow-400', icon: '😐' };
    if (ressenti === 4) return { label: 'Difficile', color: 'text-orange-400', icon: '😤' };
    return { label: 'Très difficile', color: 'text-red-400', icon: '🥵' };
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

  const handleExport = async () => {
    if (!exportRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#111827', // bg-gray-900
        width: 800,
        height: exportRef.current.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });

      const link = document.createElement('a');
      link.download = `entrainement-${workout.nom.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date(workout.date).toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const stats = getWorkoutStats();
  const groupedExercises = getGroupedExercises();
  const intensityInfo = getIntensityLevel(workout.ressenti);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-sport-gray-dark/95 backdrop-blur-sm border border-sport-gray-light/30 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sport-accent rounded-full flex items-center justify-center">
              <DocumentArrowDownIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Exporter l'entraînement</h2>
              <p className="text-sm text-gray-400">Générer une image PNG de votre séance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 bg-sport-accent hover:bg-sport-accent-light text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              {isExporting ? 'Export en cours...' : 'Exporter PNG'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-sport-gray-light/20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Aperçu de l'export */}
        <div className="border border-sport-gray-light/30 rounded-lg p-4 bg-sport-gray-light/5">
          <p className="text-sm text-gray-400 mb-4">Aperçu de l'export :</p>
          
          <div 
            ref={exportRef}
            className="bg-gray-900 text-white p-8 rounded-lg shadow-lg"
            style={{ 
              width: '100%',
              minHeight: '800px',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            {/* Header de l'export */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-600">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {workout.type}
                </span>
                <span className="text-2xl">{intensityInfo.icon}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {workout.nom}
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                {formatDate(workout.date)} à {formatTime(workout.date)}
              </p>
              <div className={`text-lg font-semibold ${intensityInfo.color.replace('text-', 'text-')}`}>
                Ressenti : {intensityInfo.label} ({workout.ressenti}/5)
              </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                <TrophyIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.uniqueExercises}</div>
                <div className="text-sm text-gray-400">Exercices</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                <ChartBarIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalSets}</div>
                <div className="text-sm text-gray-400">Séries</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                <BoltIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="space-y-1">
                  <div className="text-xl font-bold text-white">{stats.totalReps}</div>
                  <div className="text-xs text-gray-400">répétitions</div>
                  {stats.totalHoldTime > 0 && (
                    <>
                      <div className="text-xl font-bold text-red-500">{formatExerciseTime(stats.totalHoldTime)}</div>
                      <div className="text-xs text-gray-400">hold total</div>
                    </>
                  )}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                <ClockIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatDuration(workout.duree)}</div>
                <div className="text-sm text-gray-400">Durée</div>
              </div>
            </div>

            {/* Notes générales */}
            {workout.description && (
              <div className="mb-8 p-4 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-white mb-2">Notes de la séance</h3>
                <p className="text-gray-300">{workout.description}</p>
              </div>
            )}

            {/* Exercices détaillés - Tableau */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Exercices réalisés</h2>
              
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left py-4 px-6 text-red-500 font-bold text-sm">Exercice</th>
                      <th className="text-center py-4 px-6 text-red-500 font-bold text-sm">Séries</th>
                      <th className="text-center py-4 px-6 text-red-500 font-bold text-sm">Rép./Temps</th>
                      {stats.hasWeights && <th className="text-center py-4 px-6 text-red-500 font-bold text-sm">Charge max</th>}
                      <th className="text-center py-4 px-6 text-red-500 font-bold text-sm">Repos moy.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedExercises.map((group, index) => (
                      <tr key={group.exerciceId} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-4 px-6">
                          <div className="text-white font-medium">
                            {index + 1}. {group.nom}
                          </div>
                          {group.exercise && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                                {group.exercise.categorie}
                              </span>
                              <span className={`text-xs font-bold ${getDifficultyColor(group.exercise.difficulte).replace('text-', 'text-')}`}>
                                Rang {group.exercise.difficulte}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-2xl font-bold text-red-500">{group.totalSets}</span>
                        </td>
                        <td className="py-4 px-6 text-center text-white font-semibold">
                          {group.isTimeBasedExercise ? formatExerciseTime(group.totalTime) : group.totalReps}
                        </td>
                        {stats.hasWeights && (
                          <td className="py-4 px-6 text-center text-white font-semibold">
                            {group.maxWeight || 0}kg
                          </td>
                        )}
                        <td className="py-4 px-6 text-center text-gray-300">
                          {Math.floor(group.avgRest / 60)}:{(group.avgRest % 60).toString().padStart(2, '0')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t-2 border-gray-600">
              <p className="text-sm text-gray-400">
                Généré le {new Date().toLocaleDateString('fr-FR')} avec Calisthenics Tracker
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
