'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuthStore } from '@/stores/authStore';
import { WorkoutType, WorkoutSet } from '@/types';
import { generateId } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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

interface WorkoutSetForm {
  id: string;
  exerciceId: string;
  nbSeries: number;
  repetitions: number;
  duree?: number;
  tempsRepos: number;
  notes?: string;
  // Nouveaux champs
  repetitionType: 'repetitions' | 'temps'; // Type de mesure
  tempsExecution?: number; // Temps en secondes pour les exercices de gainage
  poids?: number;
  chargeType: 'poids' | 'corps'; // Type de charge
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
    if (exercises.length === 0) {
      fetchExercises();
    }
  }, [exercises.length, fetchExercises]);

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
    workoutSets.forEach((set, index) => {
      if (!set.exerciceId) {
        newErrors[`set_${index}_exercise`] = 'Exercice requis';
      }
      if (set.repetitionType === 'repetitions' && set.repetitions <= 0) {
        newErrors[`set_${index}_reps`] = 'Répétitions requises';
      }
      if (set.repetitionType === 'temps' && (!set.tempsExecution || set.tempsExecution <= 0)) {
        newErrors[`set_${index}_temps`] = 'Temps d\'exécution requis';
      }
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
        sets: workoutSets.flatMap(set => 
          Array.from({ length: set.nbSeries }, () => ({
            id: generateId(),
            exerciceId: set.exerciceId,
            repetitions: set.repetitionType === 'repetitions' ? set.repetitions : 0,
            poids: set.poids || undefined,
            duree: set.repetitionType === 'temps' ? set.tempsExecution : set.duree,
            tempsRepos: set.tempsRepos,
            notes: set.notes?.trim() || undefined
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
      nbSeries: 3,
      repetitions: 1,
      poids: undefined,
      duree: undefined,
      tempsRepos: 60,
      notes: '',
      repetitionType: 'repetitions',
      tempsExecution: undefined,
      chargeType: 'corps'
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
          
          // Réinitialiser les valeurs selon le type
          if (exerciseType === 'hold') {
            updatedSet.repetitions = 0;
            updatedSet.tempsExecution = updatedSet.tempsExecution || 30;
          } else {
            updatedSet.repetitions = updatedSet.repetitions || 1;
            updatedSet.tempsExecution = undefined;
          }
        }
      }
      
      return updatedSet;
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
    const exerciseTime = workoutSets.reduce((total, set) => {
      const exerciseTime = (set.duree || 30) * set.nbSeries; // 30 secondes par défaut pour les exercices × nombre de séries
      const restTime = (set.tempsRepos || 60) * set.nbSeries;
      return total + exerciseTime + restTime;
    }, 0);
    return Math.ceil(exerciseTime / 60); // en minutes
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Header */}
        <section className="sport-section pt-20 pb-12">
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
                    <div className="space-y-4">
                      {workoutSets.map((set, index) => (
                        <div key={set.id} className="bg-sport-gray-light/10 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Exercice {index + 1}</h3>
                            <button
                              type="button"
                              onClick={() => removeExerciseSet(set.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Supprimer"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Sélection d'exercice */}
                            <div className="lg:col-span-2">
                              <label className="block text-sm font-medium text-sport-accent mb-2">
                                Exercice *
                              </label>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowExerciseDropdown(showExerciseDropdown === set.id ? null : set.id)}
                                  className="sport-input w-full text-left flex items-center justify-between"
                                >
                                  <span className={set.exerciceId ? 'text-white' : 'text-gray-400'}>
                                    {getExerciseName(set.exerciceId)}
                                  </span>
                                  <svg className={`h-5 w-5 transition-transform ${showExerciseDropdown === set.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {showExerciseDropdown === set.id && (
                                  <div className="absolute z-10 w-full mt-1 bg-gray-900/98 backdrop-blur-md border border-sport-gray-light/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                                    <div className="p-2">
                                      <input
                                        type="text"
                                        placeholder="Rechercher un exercice..."
                                        value={exerciseSearch}
                                        onChange={(e) => setExerciseSearch(e.target.value)}
                                        className="sport-input w-full text-sm"
                                      />
                                    </div>
                                    {filteredExercises.map((exercise) => (
                                      <button
                                        key={exercise.id}
                                        type="button"
                                        onClick={() => {
                                          updateExerciseSet(set.id, 'exerciceId', exercise.id);
                                          setShowExerciseDropdown(null);
                                          setExerciseSearch('');
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-sport-gray-light/20 transition-colors text-gray-300"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <div className="font-medium">{exercise.nom}</div>
                                            <div className="text-xs text-gray-400">{exercise.categorie} • Rang {exercise.difficulte}</div>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              (exercise.typeQuantification || 'rep') === 'hold' 
                                                ? 'bg-purple-500/20 text-purple-300' 
                                                : 'bg-blue-500/20 text-blue-300'
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
                              {errors[`set_${index}_exercise`] && (
                                <p className="mt-1 text-sm text-red-400">{errors[`set_${index}_exercise`]}</p>
                              )}
                              {/* Indicateur du type détecté */}
                              {set.exerciceId && (
                                <div className="mt-2 flex items-center gap-2">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    set.repetitionType === 'temps' 
                                      ? 'bg-purple-500/20 text-purple-300' 
                                      : 'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {set.repetitionType === 'temps' ? '⏱️ Exercice de maintien' : '🔢 Exercice à répétitions'}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    (détecté automatiquement)
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Nombre de séries */}
                            <div>
                              <label className="block text-sm font-medium text-sport-accent mb-2">
                                Nombre de séries *
                              </label>
                              <select
                                value={set.nbSeries}
                                onChange={(e) => updateExerciseSet(set.id, 'nbSeries', parseInt(e.target.value))}
                                className="sport-input w-full"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                  <option key={num} value={num}>{num} série{num > 1 ? 's' : ''}</option>
                                ))}
                              </select>
                            </div>

                            {/* Répétitions ou Temps */}
                            <div>
                              {set.repetitionType === 'repetitions' ? (
                                <>
                                  <label className="block text-sm font-medium text-sport-accent mb-2">
                                    Répétitions par série *
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={set.repetitions}
                                    onChange={(e) => updateExerciseSet(set.id, 'repetitions', parseInt(e.target.value) || 0)}
                                    className="sport-input w-full"
                                    placeholder="Ex: 10"
                                  />
                                  {errors[`set_${index}_reps`] && (
                                    <p className="mt-1 text-sm text-red-400">{errors[`set_${index}_reps`]}</p>
                                  )}
                                </>
                              ) : (
                                <>
                                  <label className="block text-sm font-medium text-sport-accent mb-2">
                                    Temps par série (sec) *
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={set.tempsExecution || ''}
                                    onChange={(e) => updateExerciseSet(set.id, 'tempsExecution', parseInt(e.target.value) || 0)}
                                    className="sport-input w-full"
                                    placeholder="Ex: 30"
                                  />
                                  {errors[`set_${index}_temps`] && (
                                    <p className="mt-1 text-sm text-red-400">{errors[`set_${index}_temps`]}</p>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Type de charge */}
                            <div>
                              <label className="block text-sm font-medium text-sport-accent mb-2">
                                Type de charge *
                              </label>
                              <select
                                value={set.chargeType}
                                onChange={(e) => updateExerciseSet(set.id, 'chargeType', e.target.value as 'poids' | 'corps')}
                                className="sport-input w-full"
                              >
                                <option value="corps">Poids du corps</option>
                                <option value="poids">Charge additionnelle</option>
                              </select>
                            </div>
                          </div>

                          {/* Deuxième ligne - Charge */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Charge */}
                            <div>
                              <label className="block text-sm font-medium text-sport-accent mb-2">
                                {set.chargeType === 'corps' ? 'Poids du corps (kg)' : 'Charge additionnelle (kg)'} *
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={set.poids || ''}
                                onChange={(e) => updateExerciseSet(set.id, 'poids', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="sport-input w-full"
                                placeholder={set.chargeType === 'corps' ? 'Ex: 70' : 'Ex: 20'}
                              />
                            </div>
                          </div>

                          {/* Troisième ligne - Temps de repos et Notes */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Temps de repos */}
                            <div>
                              <label className="block text-sm font-medium text-sport-accent mb-2">
                                Temps de repos (secondes)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={set.tempsRepos}
                                onChange={(e) => updateExerciseSet(set.id, 'tempsRepos', parseInt(e.target.value) || 0)}
                                className="sport-input w-full"
                              />
                            </div>

                            {/* Notes */}
                            <div>
                              <label className="block text-sm font-medium text-sport-accent mb-2">
                                Notes
                              </label>
                              <input
                                type="text"
                                value={set.notes || ''}
                                onChange={(e) => updateExerciseSet(set.id, 'notes', e.target.value)}
                                className="sport-input w-full"
                                placeholder="Observations, sensations..."
                              />
                            </div>
                          </div>
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
                        <span>{workoutSets.reduce((total, set) => total + set.nbSeries, 0)} série{workoutSets.reduce((total, set) => total + set.nbSeries, 0) > 1 ? 's' : ''} au total</span>
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