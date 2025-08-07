import { create } from 'zustand';
import { ProgressState, PersonalRecord } from '@/types';
import { storage, generateId } from '@/lib/utils';

const RECORDS_STORAGE_KEY = 'calisthenie_records';

interface ProgressStore extends ProgressState {}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  personalRecords: [],
  isLoading: false,
  error: null,

  fetchPersonalRecords: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Récupérer tous les records du localStorage
      const allRecords: PersonalRecord[] = storage.get(RECORDS_STORAGE_KEY) || [];
      
      // Filtrer les records de l'utilisateur connecté
      const userRecords = allRecords.filter(record => record.userId === userId);
      
      set({ personalRecords: userRecords, isLoading: false });
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
      // Récupérer tous les records existants
      const allRecords: PersonalRecord[] = storage.get(RECORDS_STORAGE_KEY) || [];
      
      // Chercher un record existant pour cet exercice, ce type et cet utilisateur
      const existingRecordIndex = allRecords.findIndex(
        record => record.exerciceId === exerciceId && 
                 record.userId === userId && 
                 record.type === type
      );

      const currentDate = new Date().toISOString();

      if (existingRecordIndex !== -1) {
        // Mettre à jour le record existant si la nouvelle valeur est meilleure
        const existingRecord = allRecords[existingRecordIndex];
        
        let isNewRecord = false;
        if (type === 'temps') {
          // Pour le temps, une valeur plus petite est meilleure (moins de temps)
          isNewRecord = valeur < existingRecord.valeur;
        } else {
          // Pour répétitions et poids, plus c'est haut, mieux c'est
          isNewRecord = valeur > existingRecord.valeur;
        }

        if (isNewRecord) {
          allRecords[existingRecordIndex] = {
            ...existingRecord,
            valeur,
            date: currentDate,
            workoutId
          };
        }
      } else {
        // Créer un nouveau record
        const newRecord: PersonalRecord = {
          id: generateId(),
          userId,
          exerciceId,
          type,
          valeur,
          date: currentDate,
          workoutId
        };
        allRecords.push(newRecord);
      }

      // Sauvegarder tous les records
      storage.set(RECORDS_STORAGE_KEY, allRecords);

      // Mettre à jour le state local avec les records de l'utilisateur
      const userRecords = allRecords.filter(record => record.userId === userId);
      set({ 
        personalRecords: userRecords,
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