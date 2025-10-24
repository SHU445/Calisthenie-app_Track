'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuthStore } from '@/stores/authStore';
import { WorkoutType, WorkoutSet } from '@/types';
import { generateId } from '@/lib/utils';
import { Header } from '@/components/refonte/Header';
import { Footer } from '@/components/refonte/Footer';
import Link from 'next/link';
import {
  PlusIcon,
  ArrowLeftIcon,
  TrashIcon,
  ClockIcon,
  InformationCircleIcon
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

interface SerieForm {
  id: string;
  repetitions: number;
  poids?: number; // Poids en kg (optionnel)
  tempsRepos: number; // Temps de repos en secondes
  tempsExecution?: number; // Pour les exercices de maintien
}

interface WorkoutSetForm {
  id: string;
  exerciceId: string;
  series: SerieForm[];
  notes?: string;
  repetitionType: 'repetitions' | 'temps'; // Type de mesure
}

export default function AjouterSeancePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addWorkout } = useWorkoutStore();
  const { exercises, fetchExercises } = useExerciseStore();
  
  const [formData, setFormData] = useState({
    nom: '',
    date: new Date().toISOString().slice(0, 16), // Format datetime-local
    type: '' as WorkoutType | '',
    duree: 60, // minutes
    description: '',
    ressenti: 3 as 1 | 2 | 3 | 4 | 5
  });
  
  const [workoutSets, setWorkoutSets] = useState<WorkoutSetForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showExerciseDropdown, setShowExerciseDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (exercises.length === 0 && user?.id) {
      fetchExercises(user.id);
    }
  }, [exercises.length, fetchExercises, user?.id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de la séance est requis';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    if (!formData.type) {
      newErrors.type = 'Le type d\'entraînement est requis';
    }

    if (formData.duree <= 0) {
      newErrors.duree = 'La durée doit être positive';
    }

    if (workoutSets.length === 0) {
      newErrors.sets = 'Au moins un exercice doit être ajouté';
    }

    // Validation des sets
    workoutSets.forEach((set, setIndex) => {
      if (!set.exerciceId) {
        newErrors[`set_${setIndex}_exercise`] = 'Exercice requis';
      }
      
      if (set.series.length === 0) {
        newErrors[`set_${setIndex}_series`] = 'Au moins une série est requise';
      }

      set.series.forEach((serie, serieIndex) => {
        if (set.repetitionType === 'repetitions' && serie.repetitions <= 0) {
          newErrors[`set_${setIndex}_serie_${serieIndex}_reps`] = 'Répétitions requises';
        }
        if (set.repetitionType === 'temps' && (!serie.tempsExecution || serie.tempsExecution <= 0)) {
          newErrors[`set_${setIndex}_serie_${serieIndex}_temps`] = 'Temps d\'exécution requis';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) {
      return;
    }

    setIsSubmitting(true);

    try {
      const workoutData = {
        nom: formData.nom.trim(),
        date: formData.date,
        type: formData.type as WorkoutType,
        duree: formData.duree,
        description: formData.description.trim(),
        ressenti: formData.ressenti,
        userId: user.id,
        sets: workoutSets.flatMap(workoutSet => 
          workoutSet.series.map(serie => ({
            id: generateId(),
            exerciceId: workoutSet.exerciceId,
            repetitions: workoutSet.repetitionType === 'repetitions' ? serie.repetitions : 0,
            poids: serie.poids || undefined,
            duree: workoutSet.repetitionType === 'temps' ? serie.tempsExecution : undefined,
            tempsRepos: serie.tempsRepos,
            notes: workoutSet.notes?.trim() || undefined
          }))
        ) as WorkoutSet[]
      };

      await addWorkout(workoutData);
      router.push('/entrainements');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la séance:', error);
      setErrors({ submit: 'Erreur lors de l\'ajout de la séance' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExerciseSet = () => {
    const newSet: WorkoutSetForm = {
      id: generateId(),
      exerciceId: '',
      series: [
        {
          id: generateId(),
          repetitions: 1,
          poids: undefined,
          tempsRepos: 60,
          tempsExecution: undefined
        }
      ],
      notes: '',
      repetitionType: 'repetitions'
    };
    setWorkoutSets([...workoutSets, newSet]);
  };

  const removeExerciseSet = (setId: string) => {
    setWorkoutSets(workoutSets.filter(set => set.id !== setId));
  };

  const updateExerciseSet = (setId: string, field: keyof WorkoutSetForm, value: any) => {
    setWorkoutSets(workoutSets.map(set => {
      if (set.id !== setId) return set;
      
      const updatedSet = { ...set, [field]: value };
      
      // Si on change l'exercice, adapter automatiquement le type de mesure
      if (field === 'exerciceId' && value) {
        const selectedExercise = exercises.find(ex => ex.id === value);
        if (selectedExercise) {
          // Utiliser le nouveau champ typeQuantification si disponible
          const exerciseType = selectedExercise.typeQuantification || 
            (selectedExercise.nom.toLowerCase().includes('hold') || 
             selectedExercise.nom.toLowerCase().includes('planche') ||
             selectedExercise.nom.toLowerCase().includes('l-sit') ||
             selectedExercise.nom.toLowerCase().includes('handstand') ||
             selectedExercise.categorie === 'Core/Abdos' ? 'hold' : 'rep');
          
          updatedSet.repetitionType = exerciseType === 'hold' ? 'temps' : 'repetitions';
          
          // Mettre à jour toutes les séries selon le nouveau type
          updatedSet.series = updatedSet.series.map(serie => ({
            ...serie,
            repetitions: exerciseType === 'hold' ? 0 : (serie.repetitions || 1),
            tempsExecution: exerciseType === 'hold' ? (serie.tempsExecution || 30) : undefined
          }));
        }
      }
      
      return updatedSet;
    }));
  };

  const addSerie = (exerciseId: string) => {
    setWorkoutSets(workoutSets.map(set => {
      if (set.id !== exerciseId) return set;
      
      const newSerie: SerieForm = {
        id: generateId(),
        repetitions: set.repetitionType === 'repetitions' ? 1 : 0,
        poids: undefined,
        tempsRepos: 60,
        tempsExecution: set.repetitionType === 'temps' ? 30 : undefined
      };
      
      return {
        ...set,
        series: [...set.series, newSerie]
      };
    }));
  };

  const removeSerie = (exerciseId: string, serieId: string) => {
    setWorkoutSets(workoutSets.map(set => {
      if (set.id !== exerciseId) return set;
      
      return {
        ...set,
        series: set.series.filter(serie => serie.id !== serieId)
      };
    }));
  };

  const updateSerie = (exerciseId: string, serieId: string, field: keyof SerieForm, value: any) => {
    setWorkoutSets(workoutSets.map(set => {
      if (set.id !== exerciseId) return set;
      
      return {
        ...set,
        series: set.series.map(serie => 
          serie.id === serieId ? { ...serie, [field]: value } : serie
        )
      };
    }));
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.nom.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.nom || 'Sélectionner un exercice';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalEstimatedTime = () => {
    const totalTime = workoutSets.reduce((total, set) => {
      return total + set.series.reduce((setTotal, serie) => {
        const exerciseTime = set.repetitionType === 'temps' 
          ? (serie.tempsExecution || 30) 
          : 30; // 30 secondes par défaut pour les exercices à répétitions
        const restTime = serie.tempsRepos || 60;
        return setTotal + exerciseTime + restTime;
      }, 0);
    }, 0);
    return Math.ceil(totalTime / 60); // en minutes
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="sport-section pt-28 sm:pt-32 md:pt-36 pb-12">
          <div className="sport-container">
            <div className="max-w-4xl mx-auto">
              {/* Back Link */}
              <div className="mb-8">
                <Link 
                  href="/entrainements" 
                  className="inline-flex items-center gap-2 text-sport-accent hover:text-sport-accent-light transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Retour aux entraînements</span>
                </Link>
              </div>

              <div className="text-center mb-12">
                <div className="flex items-center justify-center w-16 h-16 bg-sport-accent rounded-full mx-auto mb-6">
                  <PlusIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Ajouter une séance
                </h1>
                <p className="text-xl text-gray-300">
                  Créez votre nouvelle séance d'entraînement
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="pb-16">
          <div className="sport-container">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations générales */}
                <div className="sport-card p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Informations générales</h2>
                  <div className="space-y-6">
                    {/* Nom de la séance */}
                    <div>
                      <label className="block text-sm font-medium text-sport-accent mb-2">
                        Nom de la séance *
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                        className="sport-input w-full"
                        placeholder="Ex: Séance pectoraux/triceps"
                      />
                      {errors.nom && (
                        <p className="mt-1 text-sm text-red-400">{errors.nom}</p>
                      )}
                    </div>

                    {/* Date, Type et Durée */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-sport-accent mb-2">
                          Date & Heure *
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="sport-input w-full"
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-400">{errors.date}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sport-accent mb-2">
                          Type d'entraînement *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as WorkoutType }))}
                          className="sport-input w-full"
                        >
                          <option value="">Sélectionner un type</option>
                          {workoutTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.type && (
                          <p className="mt-1 text-sm text-red-400">{errors.type}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sport-accent mb-2">
                          Durée prévue (min) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.duree}
                          onChange={(e) => setFormData(prev => ({ ...prev, duree: parseInt(e.target.value) || 0 }))}
                          className="sport-input w-full"
                        />
                        {errors.duree && (
                          <p className="mt-1 text-sm text-red-400">{errors.duree}</p>
                        )}
                      </div>
                    </div>

                    {/* Ressenti */}
                    <div>
                      <label className="block text-sm font-medium text-sport-accent mb-2">
                        Ressenti prévu (1 = très facile, 5 = très difficile)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, ressenti: value as 1 | 2 | 3 | 4 | 5 }))}
                            className={`w-12 h-12 rounded-full border-2 transition-all ${
                              formData.ressenti === value
                                ? 'bg-sport-accent border-sport-accent text-white'
                                : 'border-sport-gray-light/30 text-gray-400 hover:border-sport-accent/50'
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes générales */}
                    <div>
                      <label className="block text-sm font-medium text-sport-accent mb-2">
                        Notes générales
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="sport-input w-full h-24 resize-none"
                        placeholder="Objectifs, état de forme, remarques..."
                      />
                    </div>
                  </div>
                </div>

                {/* Section Exercices */}
                <div className="sport-card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Exercices</h2>
                    <button
                      type="button"
                      onClick={addExerciseSet}
                      className="inline-flex items-center gap-2 bg-sport-accent hover:bg-sport-accent-light text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Ajouter un exercice</span>
                    </button>
                  </div>

                  {errors.sets && (
                    <p className="mb-4 text-sm text-red-400">{errors.sets}</p>
                  )}

                  {workoutSets.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-sport-gray-light/30 rounded-lg">
                      <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">Aucun exercice ajouté</p>
                      <button
                        type="button"
                        onClick={addExerciseSet}
                        className="sport-btn-secondary"
                      >
                        Ajouter votre premier exercice
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {workoutSets.map((workoutSet, workoutIndex) => (
                        <div key={workoutSet.id} className="bg-martial-surface-1 rounded-lg p-6 border border-martial-steel/20">
                          {/* Header avec titre et bouton supprimer */}
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-display font-bold text-martial-highlight uppercase tracking-wide">
                              EXERCICE {workoutIndex + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeExerciseSet(workoutSet.id)}
                              className="text-martial-steel hover:text-martial-danger-accent p-2 rounded-md transition-colors"
                              title="Supprimer cet exercice"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Sélection d'exercice */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-martial-steel mb-2">
                              Exercice
                            </label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowExerciseDropdown(showExerciseDropdown === workoutSet.id ? null : workoutSet.id)}
                                className="martial-input w-full text-left flex items-center justify-between"
                              >
                                <span className={workoutSet.exerciceId ? 'text-martial-highlight' : 'text-martial-steel'}>
                                  {getExerciseName(workoutSet.exerciceId)}
                                </span>
                                <svg className={`h-5 w-5 transition-transform ${showExerciseDropdown === workoutSet.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {showExerciseDropdown === workoutSet.id && (
                                <div className="absolute z-10 w-full mt-1 bg-martial-surface-1 border border-martial-steel/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                                  <div className="p-2">
                                    <input
                                      type="text"
                                      placeholder="Rechercher un exercice..."
                                      value={exerciseSearch}
                                      onChange={(e) => setExerciseSearch(e.target.value)}
                                      className="martial-input w-full text-sm"
                                    />
                                  </div>
                                  {filteredExercises.map((exercise) => (
                                    <button
                                      key={exercise.id}
                                      type="button"
                                      onClick={() => {
                                        updateExerciseSet(workoutSet.id, 'exerciceId', exercise.id);
                                        setShowExerciseDropdown(null);
                                        setExerciseSearch('');
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-martial-surface-hover transition-colors text-martial-steel"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium text-martial-highlight">{exercise.nom}</div>
                                          <div className="text-xs text-martial-steel">{exercise.categorie} • Rang {exercise.difficulte}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            (exercise.typeQuantification || 'rep') === 'hold' 
                                              ? 'bg-martial-warning/20 text-martial-warning' 
                                              : 'bg-martial-success/20 text-martial-success'
                                          }`}>
                                            {(exercise.typeQuantification || 'rep') === 'hold' ? '⏱️ Hold' : '🔢 Rep'}
                                          </span>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {errors[`set_${workoutIndex}_exercise`] && (
                              <p className="mt-1 text-sm text-martial-danger-accent">{errors[`set_${workoutIndex}_exercise`]}</p>
                            )}
                          </div>

                          {/* Section Séries */}
                          {workoutSet.exerciceId && (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-display font-bold text-martial-steel uppercase tracking-wide">
                                  SÉRIES
                                </h4>
                                {workoutSet.repetitionType === 'temps' ? (
                                  <span className="text-xs text-martial-warning bg-martial-warning/10 px-2 py-1 rounded">
                                    ⏱️ Exercice de maintien
                                  </span>
                                ) : (
                                  <span className="text-xs text-martial-success bg-martial-success/10 px-2 py-1 rounded">
                                    🔢 Exercice à répétitions
                                  </span>
                                )}
                              </div>

                              {/* En-têtes des colonnes */}
                              <div className="grid grid-cols-4 gap-4 mb-2 text-xs font-medium text-martial-steel uppercase tracking-wide">
                                <div>Répétitions</div>
                                <div>Poids (kg, optionnel)</div>
                                <div>Repos (secondes)</div>
                                <div></div>
                              </div>

                              {/* Lignes de séries */}
                              <div className="space-y-3">
                                {workoutSet.series.map((serie, serieIndex) => (
                                  <div key={serie.id} className="grid grid-cols-4 gap-4 items-center">
                                    {/* Répétitions ou Temps */}
                                    <div>
                                      {workoutSet.repetitionType === 'repetitions' ? (
                                        <input
                                          type="number"
                                          min="1"
                                          value={serie.repetitions || ''}
                                          onChange={(e) => updateSerie(workoutSet.id, serie.id, 'repetitions', parseInt(e.target.value) || 0)}
                                          className="martial-input w-full"
                                          placeholder="10"
                                        />
                                      ) : (
                                        <input
                                          type="number"
                                          min="1"
                                          value={serie.tempsExecution || ''}
                                          onChange={(e) => updateSerie(workoutSet.id, serie.id, 'tempsExecution', parseInt(e.target.value) || 0)}
                                          className="martial-input w-full"
                                          placeholder="30s"
                                        />
                                      )}
                                      {errors[`set_${workoutIndex}_serie_${serieIndex}_${workoutSet.repetitionType === 'repetitions' ? 'reps' : 'temps'}`] && (
                                        <p className="text-xs text-martial-danger-accent mt-1">Requis</p>
                                      )}
                                    </div>

                                    {/* Poids */}
                                    <div>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={serie.poids || ''}
                                        onChange={(e) => updateSerie(workoutSet.id, serie.id, 'poids', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className="martial-input w-full"
                                        placeholder=""
                                      />
                                    </div>

                                    {/* Temps de repos */}
                                    <div>
                                      <input
                                        type="number"
                                        min="0"
                                        value={serie.tempsRepos}
                                        onChange={(e) => updateSerie(workoutSet.id, serie.id, 'tempsRepos', parseInt(e.target.value) || 60)}
                                        className="martial-input w-full"
                                      />
                                    </div>

                                    {/* Bouton supprimer série */}
                                    <div className="flex justify-end">
                                      {workoutSet.series.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeSerie(workoutSet.id, serie.id)}
                                          className="text-martial-steel hover:text-martial-danger-accent p-1 rounded transition-colors"
                                          title="Supprimer cette série"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Bouton ajouter série */}
                              <div className="mt-4">
                                <button
                                  type="button"
                                  onClick={() => addSerie(workoutSet.id)}
                                  className="flex items-center gap-2 text-martial-steel hover:text-martial-highlight transition-colors text-sm"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  <span>Ajouter une série</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer du formulaire */}
                <div className="sport-card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span>{workoutSets.length} exercice{workoutSets.length > 1 ? 's' : ''} ajouté{workoutSets.length > 1 ? 's' : ''}</span>
                        <span>{workoutSets.reduce((total, set) => total + set.series.length, 0)} série{workoutSets.reduce((total, set) => total + set.series.length, 0) > 1 ? 's' : ''} au total</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          Temps estimé: {getTotalEstimatedTime()}min
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            nom: '',
                            date: new Date().toISOString().slice(0, 16),
                            type: '',
                            duree: 60,
                            description: '',
                            ressenti: 3
                          });
                          setWorkoutSets([]);
                          setErrors({});
                        }}
                        className="sport-btn-secondary"
                      >
                        Réinitialiser
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="sport-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer la séance'}
                      </button>
                    </div>
                  </div>

                  {errors.submit && (
                    <p className="mt-4 text-red-400 text-center">{errors.submit}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Fermer les dropdowns en cliquant ailleurs */}
      {showExerciseDropdown && (
        <div 
          className="fixed inset-0 z-5 bg-black/20" 
          onClick={() => {
            setShowExerciseDropdown(null);
            setExerciseSearch('');
          }}
        />
      )}

      <Footer />
    </div>
  );
} 