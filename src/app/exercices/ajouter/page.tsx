'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuthStore } from '@/stores/authStore';
import { RANKS } from '@/data/ranks';
import { ExerciseCategory, DifficultyRank, QuantificationType } from '@/types';
import { Header } from '@/components/refonte/Header';
import { Footer } from '@/components/refonte/Footer';
import Link from 'next/link';
import {
  PlusIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const categories: ExerciseCategory[] = [
  'Haut du corps',
  'Core/Abdos',
  'Bas du corps',
  'Cardio',
  'Full Body'
];

// Liste complète des muscles du corps humain
const allMuscles = [
  // Tête et cou
  'Trapèzes',
  'Sterno-cléido-mastoïdien',
  
  // Épaules
  'Deltoïdes antérieurs',
  'Deltoïdes moyens',
  'Deltoïdes postérieurs',
  'Deltoïdes',
  
  // Bras
  'Biceps',
  'Triceps',
  'Brachial antérieur',
  'Brachio-radial',
  'Avant-bras',
  
  // Poitrine
  'Pectoraux',
  'Grand pectoral',
  'Petit pectoral',
  'Dentelé antérieur',
  
  // Dos
  'Grand dorsal',
  'Rhomboïdes',
  'Érecteurs spinaux',
  'Lombaires',
  'Infraépineux',
  'Supra-épineux',
  'Grand rond',
  'Petit rond',
  
  // Abdominaux et core
  'Abdominaux',
  'Grand droit de l\'abdomen',
  'Obliques',
  'Obliques externes',
  'Obliques internes',
  'Transverse de l\'abdomen',
  'Carré des lombes',
  'Diaphragme',
  
  // Hanches et fessiers
  'Fessiers',
  'Grand fessier',
  'Moyen fessier',
  'Petit fessier',
  'Tenseur du fascia lata',
  'Fléchisseurs de la hanche',
  'Psoas-iliaque',
  'Piriforme',
  
  // Cuisses
  'Quadriceps',
  'Droit fémoral',
  'Vaste latéral',
  'Vaste médial',
  'Vaste intermédiaire',
  'Ischio-jambiers',
  'Biceps fémoral',
  'Semi-tendineux',
  'Semi-membraneux',
  'Adducteurs',
  'Grand adducteur',
  'Long adducteur',
  'Court adducteur',
  'Pectiné',
  'Gracile',
  
  // Mollets et jambes
  'Mollets',
  'Gastrocnémien',
  'Soléaire',
  'Tibial antérieur',
  'Péroniers',
  'Fléchisseurs des orteils',
  'Extenseurs des orteils'
].sort();

export default function AjouterExercicePage() {
  const router = useRouter();
  const { addExercise } = useExerciseStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    difficulte: '',
    muscles: [] as string[],
    description: '',
    typeQuantification: 'rep' as QuantificationType
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [muscleDropdownOpen, setMuscleDropdownOpen] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de l\'exercice est requis';
    }

    if (!formData.categorie) {
      newErrors.categorie = 'La catégorie est requise';
    }

    if (!formData.difficulte) {
      newErrors.difficulte = 'Le rang de difficulté est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.muscles.length === 0) {
      newErrors.muscles = 'Au moins un muscle doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setErrors({ submit: 'Vous devez être connecté pour ajouter un exercice' });
      return;
    }

    setIsSubmitting(true);

    try {
      const exerciseData = {
        nom: formData.nom.trim(),
        categorie: formData.categorie as ExerciseCategory,
        difficulte: formData.difficulte as DifficultyRank,
        muscles: formData.muscles,
        description: formData.description.trim(),
        instructions: ['Position de base'], // Instruction minimale pour compatibilité
        typeQuantification: formData.typeQuantification,
        userId: user.id // Ajouter l'ID de l'utilisateur
      };

      await addExercise(exerciseData);
      
      // Redirection vers la page des exercices avec un message de succès
      router.push('/exercices?added=true');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'exercice:', error);
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Erreur lors de l\'ajout de l\'exercice' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMuscle = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      muscles: prev.muscles.includes(muscle)
        ? prev.muscles.filter(m => m !== muscle)
        : [...prev.muscles, muscle]
    }));
  };

  const removeMuscle = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      muscles: prev.muscles.filter(m => m !== muscle)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="sport-section pt-28 sm:pt-32 md:pt-36 pb-12">
          <div className="sport-container">
            <div className="max-w-3xl mx-auto">
              {/* Back Link */}
              <div className="mb-8">
                <Link 
                  href="/exercices" 
                  className="inline-flex items-center gap-2 text-sport-accent hover:text-sport-accent-light transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Retour aux exercices</span>
                </Link>
              </div>

              <div className="text-center mb-12">
                <div className="flex items-center justify-center w-16 h-16 bg-sport-accent rounded-full mx-auto mb-6">
                  <PlusIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Ajouter un exercice
                </h1>
                <p className="text-xl text-gray-300">
                  Contribuez à la base d'exercices en ajoutant votre propre exercice de callisthénie
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="pb-16">
          <div className="sport-container">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="sport-card p-8 space-y-8">
                {/* Nom de l'exercice */}
                <div>
                  <label className="block text-sm font-medium text-sport-accent mb-2">
                    Nom de l'exercice *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    className="sport-input w-full"
                    placeholder="Ex: Pompes archer"
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-400">{errors.nom}</p>
                  )}
                </div>

                {/* Catégorie, Rang et Type de quantification */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-sport-accent mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.categorie}
                      onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                      className="sport-input w-full"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((categorie) => (
                        <option key={categorie} value={categorie}>
                          {categorie}
                        </option>
                      ))}
                    </select>
                    {errors.categorie && (
                      <p className="mt-1 text-sm text-red-400">{errors.categorie}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sport-accent mb-2">
                      Rang de difficulté *
                    </label>
                    <select
                      value={formData.difficulte}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulte: e.target.value }))}
                      className="sport-input w-full"
                    >
                      <option value="">Sélectionner un rang</option>
                      {RANKS.map((rank) => (
                        <option key={rank.rank} value={rank.rank}>
                          {rank.rank} - {rank.name}
                        </option>
                      ))}
                    </select>
                    {errors.difficulte && (
                      <p className="mt-1 text-sm text-red-400">{errors.difficulte}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sport-accent mb-2">
                      Type de quantification *
                    </label>
                    <select
                      value={formData.typeQuantification}
                      onChange={(e) => setFormData(prev => ({ ...prev, typeQuantification: e.target.value as QuantificationType }))}
                      className="sport-input w-full"
                    >
                      <option value="rep">Répétitions</option>
                      <option value="hold">Maintien (temps)</option>
                    </select>
                    <div className="mt-1 text-xs text-gray-400">
                      {formData.typeQuantification === 'rep' 
                        ? 'Exercice avec répétitions (pompes, tractions...)' 
                        : 'Exercice statique (planche, handstand...)'
                      }
                    </div>
                  </div>
                </div>

                {/* Muscles travaillés */}
                <div>
                  <label className="block text-sm font-medium text-sport-accent mb-2">
                    Muscles travaillés *
                  </label>
                  
                  {/* Muscles sélectionnés */}
                  {formData.muscles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.muscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="inline-flex items-center gap-1 bg-sport-accent text-white px-3 py-1 rounded-full text-sm"
                        >
                          {muscle}
                          <button
                            type="button"
                            onClick={() => removeMuscle(muscle)}
                            className="hover:bg-white/20 rounded-full p-0.5"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Menu déroulant des muscles */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMuscleDropdownOpen(!muscleDropdownOpen)}
                      className="sport-input w-full text-left flex items-center justify-between"
                    >
                      <span className="text-gray-400">
                        {formData.muscles.length > 0 
                          ? `${formData.muscles.length} muscle${formData.muscles.length > 1 ? 's' : ''} sélectionné${formData.muscles.length > 1 ? 's' : ''}`
                          : 'Sélectionner les muscles'
                        }
                      </span>
                      <svg className={`h-5 w-5 transition-transform ${muscleDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {muscleDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-sport-gray-dark/95 backdrop-blur-sm border border-sport-gray-light/30 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {allMuscles.map((muscle) => (
                          <button
                            key={muscle}
                            type="button"
                            onClick={() => toggleMuscle(muscle)}
                            className={`w-full text-left px-4 py-2 hover:bg-sport-gray-light/20 transition-colors ${
                              formData.muscles.includes(muscle) 
                                ? 'bg-sport-accent/20 text-sport-accent' 
                                : 'text-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 border-2 rounded ${
                                formData.muscles.includes(muscle) 
                                  ? 'bg-sport-accent border-sport-accent' 
                                  : 'border-gray-400'
                              }`}>
                                {formData.muscles.includes(muscle) && (
                                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              {muscle}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {errors.muscles && (
                    <p className="mt-1 text-sm text-red-400">{errors.muscles}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-sport-accent mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="sport-input w-full h-32 resize-none"
                    placeholder="Décrivez brièvement l'exercice, sa technique et ses bénéfices"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="sport-btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'exercice'}
                  </button>
                  <Link
                    href="/exercices"
                    className="sport-btn-secondary flex-1 text-center"
                  >
                    Annuler
                  </Link>
                </div>

                {errors.submit && (
                  <p className="text-red-400 text-center">{errors.submit}</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Fermer le dropdown en cliquant ailleurs */}
      {muscleDropdownOpen && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setMuscleDropdownOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
} 