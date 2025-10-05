// Types pour l'application Callisthenics Tracker

export type DifficultyRank = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';

export interface RankInfo {
  rank: DifficultyRank;
  name: string;
  description: string;
  timeframe: string;
  skills: string[];
  color: string;
}

export type ExerciseCategory = 
  | 'Haut du corps' 
  | 'Bas du corps' 
  | 'Core/Abdos' 
  | 'Cardio' 
  | 'Flexibilité'
  | 'Équilibre'
  | 'Full Body';

export type WorkoutType = 
  | 'Force' 
  | 'Endurance' 
  | 'Flexibilité' 
  | 'Cardio' 
  | 'HIIT'
  | 'Circuit Training'
  | 'Récupération';

// Exercice - base de données partagée
export type QuantificationType = 'rep' | 'hold';

export interface Exercise {
  id: string;
  nom: string;
  categorie: ExerciseCategory;
  difficulte: DifficultyRank;
  muscles: string[];
  description: string;
  instructions?: string[];
  image?: string;
  video?: string;
  typeQuantification: QuantificationType;
  userId?: string; // Optionnel : si absent, c'est un exercice de base accessible à tous
}

// Utilisateur
export interface User {
  id: string;
  username: string;
  email?: string;
  password: string;
  dateCreation: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  units: 'metric' | 'imperial';
  language: 'fr' | 'en';
}

// Série d'exercice dans un entraînement
export interface WorkoutSet {
  id: string;
  exerciceId: string;
  repetitions: number;
  poids?: number; // en kg
  duree?: number; // en secondes (pour les exercices de temps)
  tempsRepos: number; // en secondes
  notes?: string;
}

// Entraînement complet
export interface Workout {
  id: string;
  userId: string;
  nom: string;
  date: string; // ISO string
  duree: number; // en minutes
  type: WorkoutType;
  description?: string;
  sets: WorkoutSet[];
  caloriesBrulees?: number;
  ressenti: 1 | 2 | 3 | 4 | 5; // 1 = très facile, 5 = très difficile
}

// Record personnel
export interface PersonalRecord {
  id: string;
  userId: string;
  exerciceId: string;
  type: 'repetitions' | 'temps' | 'poids';
  valeur: number;
  date: string;
  workoutId?: string;
}

// États Zustand pour l'authentification
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  clearError: () => void;
}

// États Zustand pour les exercices
export interface ExerciseState {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: ExerciseCategory | null;
  searchTerm: string;
  fetchExercises: (userId?: string) => Promise<void>;
  addExercise: (exercise: Omit<Exercise, 'id'>) => Promise<void>;
  updateExercise: (id: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string, userId: string) => Promise<void>;
  setSelectedCategory: (category: ExerciseCategory | null) => void;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
}

// États Zustand pour les entraînements
export interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  isLoading: boolean;
  error: string | null;
  fetchWorkouts: (userId: string) => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id'>) => Promise<void>;
  updateWorkout: (id: string, workout: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  setCurrentWorkout: (workout: Workout | null) => void;
  clearError: () => void;
}

// États Zustand pour les progrès
export interface ProgressState {
  personalRecords: PersonalRecord[];
  isLoading: boolean;
  error: string | null;
  fetchPersonalRecords: (userId: string) => Promise<void>;
  updatePersonalRecord: (exerciceId: string, type: 'repetitions' | 'temps' | 'poids', valeur: number, userId: string, workoutId?: string) => Promise<void>;
  getRecordsByExercise: (exerciceId: string) => PersonalRecord[];
  clearError: () => void;
}

// Types pour les statistiques et analyses
export interface WorkoutStats {
  totalWorkouts: number;
  totalTime: number; // en minutes
  averageWorkoutTime: number;
  caloriesBrulees: number;
  workoutsByType: Record<WorkoutType, number>;
  workoutsByMonth: Record<string, number>;
  streakJours: number;
  meilleurMois: string;
}

export interface ProgressData {
  exerciseId: string;
  exerciseName: string;
  records: {
    date: string;
    value: number;
    type: 'repetitions' | 'temps' | 'poids';
  }[];
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  totalSessions: number;
  bestRecord: PersonalRecord | null;
  progressTrend: 'up' | 'down' | 'stable';
  lastWorkout: string | null;
}

// Types pour les filtres
export interface ExerciseFilter {
  category?: ExerciseCategory;
  difficulty?: DifficultyRank;
  searchTerm?: string;
  muscleGroup?: string;
}

export interface WorkoutFilter {
  startDate?: string;
  endDate?: string;
  type?: WorkoutType;
  minDuration?: number;
  maxDuration?: number;
}

export interface ProgressFilter {
  exerciseIds?: string[];
  startDate?: string;
  endDate?: string;
  recordType?: 'repetitions' | 'temps' | 'poids';
}

// Types pour les formulaires
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ExerciseForm {
  nom: string;
  categorie: ExerciseCategory;
  difficulte: DifficultyRank;
  muscles: string[];
  description: string;
  instructions: string[];
  typeQuantification: QuantificationType;
}

export interface WorkoutForm {
  nom: string;
  date: string;
  type: WorkoutType;
  description?: string;
  sets: Omit<WorkoutSet, 'id'>[];
}

// Types utilitaires
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
} 