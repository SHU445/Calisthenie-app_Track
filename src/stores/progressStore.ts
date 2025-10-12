import { create } from 'zustand';
import { ProgressState, PersonalRecord } from '@/types';

interface ProgressStore extends ProgressState {}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  personalRecords: [],
  isLoading: false,
  error: null,

  fetchPersonalRecords: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/personal-records?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des records');
      }
      
      const personalRecords = await response.json();
      set({ personalRecords, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des records',
        isLoading: false 
      });
    }
  },

  updatePersonalRecord: async (
    exerciceId: string, 
    type: 'repetitions' | 'temps' | 'poids', 
    valeur: number, 
    userId: string, 
    workoutId?: string
  ) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/personal-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          exerciceId,
          type,
          valeur,
          workoutId
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du record');
      }

      const updatedRecord = await response.json();
      
      // Mettre à jour le state local
      const { personalRecords } = get();
      const existingIndex = personalRecords.findIndex(
        record => record.exerciceId === exerciceId && 
                 record.userId === userId && 
                 record.type === type
      );

      if (existingIndex !== -1) {
        personalRecords[existingIndex] = updatedRecord;
      } else {
        personalRecords.push(updatedRecord);
      }

      set({ 
        personalRecords: [...personalRecords],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du record',
        isLoading: false 
      });
    }
  },

  getRecordsByExercise: (exerciceId: string): PersonalRecord[] => {
    const { personalRecords } = get();
    return personalRecords.filter(record => record.exerciceId === exerciceId);
  },

  clearError: () => {
    set({ error: null });
  }
})); 