import { create } from 'zustand';
import { WorkoutState, Workout } from '@/types';

interface WorkoutStore extends WorkoutState {}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  error: null,

  fetchWorkouts: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/workouts?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des entraînements');
      }
      
      const userWorkouts = await response.json();
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
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'entraînement');
      }

      const savedWorkout = await response.json();
      const { workouts } = get();
      set({ 
        workouts: [...workouts, savedWorkout],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'entraînement',
        isLoading: false 
      });
      throw error;
    }
  },

  updateWorkout: async (id, workoutData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de l\'entraînement');
      }

      const updatedWorkout = await response.json();
      const { workouts } = get();
      const updatedWorkouts = workouts.map(workout =>
        workout.id === id ? updatedWorkout : workout
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
      throw error;
    }
  },

  deleteWorkout: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'entraînement');
      }

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
      throw error;
    }
  },

  setCurrentWorkout: (workout: Workout | null) => {
    set({ currentWorkout: workout });
  },

  clearError: () => {
    set({ error: null });
  }
})); 