import { create } from 'zustand';
import { WorkoutState, Workout } from '@/types';
import { storage, generateId } from '@/lib/utils';

const WORKOUTS_STORAGE_KEY = 'calisthenie_workouts';

interface WorkoutStore extends WorkoutState {}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  error: null,

  fetchWorkouts: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Récupérer tous les entraînements du localStorage
      const allWorkouts: Workout[] = storage.get(WORKOUTS_STORAGE_KEY) || [];
      
      // Filtrer les entraînements de l'utilisateur connecté
      const userWorkouts = allWorkouts.filter(workout => workout.userId === userId);
      
      set({ workouts: userWorkouts, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des entraînements',
        isLoading: false 
      });
    }
  },

  addWorkout: async (workoutData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newWorkout: Workout = {
        ...workoutData,
        id: generateId()
      };

      // Récupérer tous les entraînements existants
      const allWorkouts: Workout[] = storage.get(WORKOUTS_STORAGE_KEY) || [];
      
      // Ajouter le nouvel entraînement
      const updatedWorkouts = [...allWorkouts, newWorkout];
      storage.set(WORKOUTS_STORAGE_KEY, updatedWorkouts);

      // Mettre à jour le state avec les entraînements de l'utilisateur
      const { workouts } = get();
      set({ 
        workouts: [...workouts, newWorkout],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'entraînement',
        isLoading: false 
      });
    }
  },

  updateWorkout: async (id, workoutData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Récupérer tous les entraînements
      const allWorkouts: Workout[] = storage.get(WORKOUTS_STORAGE_KEY) || [];
      
      // Mettre à jour l'entraînement spécifique
      const updatedAllWorkouts = allWorkouts.map(workout =>
        workout.id === id ? { ...workout, ...workoutData } : workout
      );
      
      // Sauvegarder
      storage.set(WORKOUTS_STORAGE_KEY, updatedAllWorkouts);

      // Mettre à jour le state local
      const { workouts } = get();
      const updatedWorkouts = workouts.map(workout =>
        workout.id === id ? { ...workout, ...workoutData } : workout
      );

      set({ 
        workouts: updatedWorkouts,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la modification de l\'entraînement',
        isLoading: false 
      });
    }
  },

  deleteWorkout: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Récupérer tous les entraînements
      const allWorkouts: Workout[] = storage.get(WORKOUTS_STORAGE_KEY) || [];
      
      // Supprimer l'entraînement spécifique
      const updatedAllWorkouts = allWorkouts.filter(workout => workout.id !== id);
      
      // Sauvegarder
      storage.set(WORKOUTS_STORAGE_KEY, updatedAllWorkouts);

      // Mettre à jour le state local
      const { workouts } = get();
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);

      set({ 
        workouts: updatedWorkouts,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'entraînement',
        isLoading: false 
      });
    }
  },

  setCurrentWorkout: (workout: Workout | null) => {
    set({ currentWorkout: workout });
  },

  clearError: () => {
    set({ error: null });
  }
})); 