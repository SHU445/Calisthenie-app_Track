import { create } from 'zustand';
import { ExerciseState, Exercise, ExerciseCategory, DifficultyRank } from '@/types';
import { generateId, filterBySearchTerm } from '@/lib/utils';

interface ExerciseStore extends ExerciseState {}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  exercises: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchTerm: '',

  fetchExercises: async (userId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const url = userId ? `/api/exercises?userId=${userId}` : '/api/exercises';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des exercices');
      }
      
      const exercises = await response.json();
      set({ exercises, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      });
    }
  },

  addExercise: async (exerciseData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'exercice');
      }

      const savedExercise = await response.json();
      const { exercises } = get();
      set({ 
        exercises: [...exercises, savedExercise],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      });
      throw error;
    }
  },

  updateExercise: async (id, exerciseData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification de l\'exercice');
      }

      const updatedExercise = await response.json();
      const { exercises } = get();
      const updatedExercises = exercises.map(exercise =>
        exercise.id === id ? updatedExercise : exercise
      );

      set({ 
        exercises: updatedExercises,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteExercise: async (id, userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/exercises/${id}?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'exercice');
      }

      const { exercises } = get();
      const updatedExercises = exercises.filter(exercise => exercise.id !== id);

      set({ 
        exercises: updatedExercises,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      });
      throw error;
    }
  },

  setSelectedCategory: (category: ExerciseCategory | null) => {
    set({ selectedCategory: category });
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  clearError: () => {
    set({ error: null });
  }
})); 