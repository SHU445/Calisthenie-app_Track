import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Exercise, WorkoutSet, PersonalRecord } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Générer un ID unique
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Formatage des dates
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
}

// Formatage des durées en secondes
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

// Stockage local temporaire pour compatibilité
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignorer les erreurs de stockage
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignorer les erreurs de stockage
    }
  }
};

// Validation des emails
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validation des mots de passe
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validation du nom d'utilisateur
export function validateUsername(username: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
  }
  
  if (username.length > 20) {
    errors.push('Le nom d\'utilisateur ne peut pas dépasser 20 caractères');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, _ et -');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Calculs statistiques
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

export function calculateMax(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.max(...numbers);
}

export function calculateMin(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.min(...numbers);
}

// Calcul de la progression en pourcentage
export function calculateProgress(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Filtrage et recherche
export function filterBySearchTerm<T>(
  items: T[],
  searchTerm: string,
  searchKeys: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase();
  
  return items.filter(item =>
    searchKeys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      if (Array.isArray(value)) {
        return value.some(v => 
          typeof v === 'string' && v.toLowerCase().includes(term)
        );
      }
      return false;
    })
  );
}

// Tri par date
export function sortByDate<T extends { date: string }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

// Débouncing pour les recherches
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Calcul de calories brûlées (estimation basique)
export function estimateCaloriesBurned(
  duration: number, // en minutes
  intensity: 'low' | 'medium' | 'high' | 'extreme',
  bodyWeight: number = 70 // kg par défaut
): number {
  const baseRate = {
    low: 3,      // MET pour exercice léger
    medium: 6,   // MET pour exercice modéré
    high: 8,     // MET pour exercice intense
    extreme: 12  // MET pour exercice très intense
  };
  
  // Formule: MET × poids(kg) × durée(h)
  return Math.round(baseRate[intensity] * bodyWeight * (duration / 60));
}

// Génération de couleurs pour les graphiques
export function generateChartColors(count: number): string[] {
  const colors = [
    '#47B7CC', // Turquoise
    '#10B981', // Vert océanique
    '#2E79C5', // Bleu vif
    '#F59E0B', // Orangé doux
    '#EF4444', // Rouge corail
    '#1E3A5F', // Bleu marine profond
    '#2E5E8E', // Bleu océan moyen
    '#D4AF37', // Or doux
    '#BCCCDC', // Argent pâle
    '#CD7C2F'  // Bronze chaud
  ];
  
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
}

// Formatage des nombres pour l'affichage
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Conversion d'unités
export function convertWeight(weight: number, fromUnit: 'kg' | 'lbs', toUnit: 'kg' | 'lbs'): number {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  }
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight / 2.20462;
  }
  
  return weight;
}

// Vérifier si une date est aujourd'hui
export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  
  return today.toDateString() === date.toDateString();
}

// Vérifier si une date est cette semaine
export function isThisWeek(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
}

// Calculer la streak de jours d'entraînement
export function calculateWorkoutStreak(workoutDates: string[]): number {
  if (workoutDates.length === 0) return 0;
  
  const sortedDates = workoutDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const workoutDate of sortedDates) {
    const workoutDay = new Date(workoutDate);
    workoutDay.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - workoutDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
      streak++;
      currentDate = new Date(workoutDay);
    } else {
      break;
    }
  }
  
  return streak;
}

// ===== FONCTIONS DE CALCUL DE DENSITÉ =====

/**
 * Calcule le volume d'un exercice selon son type
 * - Exercices dynamiques (rep) : total des répétitions
 * - Exercices statiques (hold) : total des secondes de maintien
 */
export function calculateExerciseVolume(
  sets: WorkoutSet[],
  exercise: Exercise
): number {
  if (exercise.typeQuantification === 'hold') {
    // Pour les exercices statiques, volume = total des secondes de maintien
    return sets.reduce((total, set) => total + (set.duree || 0), 0);
  } else {
    // Pour les exercices dynamiques, volume = total des répétitions
    return sets.reduce((total, set) => total + (set.repetitions || 0), 0);
  }
}

/**
 * Calcule le temps total d'un exercice (temps de travail + temps de repos)
 */
export function calculateExerciseTime(
  sets: WorkoutSet[],
  exercise: Exercise
): number {
  let workTime = 0;
  let restTime = 0;

  if (exercise.typeQuantification === 'hold') {
    // Pour les exercices statiques : temps de travail = durée de maintien
    workTime = sets.reduce((total, set) => total + (set.duree || 0), 0);
  } else {
    // Pour les exercices dynamiques : estimer le temps de travail
    // Approximation : 2 secondes par répétition (1s concentrique + 1s excentrique)
    const totalReps = sets.reduce((total, set) => total + (set.repetitions || 0), 0);
    workTime = totalReps * 2;
  }

  // Temps de repos = somme de tous les temps de repos
  restTime = sets.reduce((total, set) => total + (set.tempsRepos || 0), 0);

  return workTime + restTime;
}

/**
 * Calcule la densité d'un exercice (Volume / Temps)
 */
export function calculateExerciseDensity(
  sets: WorkoutSet[],
  exercise: Exercise
): number {
  const volume = calculateExerciseVolume(sets, exercise);
  const time = calculateExerciseTime(sets, exercise);
  
  if (time === 0) return 0;
  
  return volume / time;
}

/**
 * Calcule la densité totale d'une séance
 */
export function calculateWorkoutDensity(
  sets: WorkoutSet[],
  exercises: Exercise[]
): number {
  // Grouper les sets par exercice
  const exerciseGroups = sets.reduce((groups, set) => {
    if (!groups[set.exerciceId]) {
      groups[set.exerciceId] = [];
    }
    groups[set.exerciceId].push(set);
    return groups;
  }, {} as Record<string, WorkoutSet[]>);

  let totalVolume = 0;
  let totalTime = 0;

  // Calculer le volume et temps total pour chaque exercice
  Object.entries(exerciseGroups).forEach(([exerciseId, exerciseSets]) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      totalVolume += calculateExerciseVolume(exerciseSets, exercise);
      totalTime += calculateExerciseTime(exerciseSets, exercise);
    }
  });

  if (totalTime === 0) return 0;
  
  return totalVolume / totalTime;
}

/**
 * Formate l'affichage de la densité avec conversion en unités/minute
 */
export function formatDensity(
  density: number,
  exerciseType: 'rep' | 'hold',
  precision: number = 3
): {
  perSecond: string;
  perMinute: string;
  unit: string;
} {
  const unit = exerciseType === 'hold' ? 's' : 'rép';
  const perSecond = density.toFixed(precision);
  const perMinute = Math.round(density * 60);

  return {
    perSecond: `${perSecond} ${unit}/s`,
    perMinute: `≈ ${perMinute} ${unit}/min`,
    unit
  };
}

/**
 * Formate l'affichage de la densité pour une séance mixte
 */
export function formatWorkoutDensity(
  density: number,
  precision: number = 3
): {
  perSecond: string;
  perMinute: string;
} {
  const perSecond = density.toFixed(precision);
  const perMinute = Math.round(density * 60);

  return {
    perSecond: `${perSecond} unités/s`,
    perMinute: `≈ ${perMinute} unités/min`
  };
}

// ===== FONCTIONS DE CALCUL D'INTENSITÉ =====

/**
 * Récupère le record personnel maximum pour un exercice donné
 */
export function getExerciseMaxRecord(
  exerciseId: string,
  exercise: Exercise,
  personalRecords: PersonalRecord[]
): number {
  const exerciseRecords = personalRecords.filter(record => record.exerciceId === exerciseId);
  
  if (exerciseRecords.length === 0) return 0;
  
  // Pour les exercices statiques, on cherche le record de 'temps'
  // Pour les exercices dynamiques, on cherche le record de 'repetitions'
  const recordType = exercise.typeQuantification === 'hold' ? 'temps' : 'repetitions';
  
  const relevantRecords = exerciseRecords.filter(record => record.type === recordType);
  
  if (relevantRecords.length === 0) return 0;
  
  // Retourner la valeur maximale
  return Math.max(...relevantRecords.map(record => record.valeur));
}

/**
 * Calcule l'intensité d'une série par rapport au record personnel
 */
export function calculateSetIntensity(
  set: WorkoutSet,
  exercise: Exercise,
  maxRecord: number
): number {
  if (maxRecord === 0) return 0;
  
  let performedValue = 0;
  
  if (exercise.typeQuantification === 'hold') {
    // Pour les exercices statiques : durée réalisée
    performedValue = set.duree || 0;
  } else {
    // Pour les exercices dynamiques : répétitions réalisées
    performedValue = set.repetitions || 0;
  }
  
  if (performedValue === 0) return 0;
  
  // Intensité = valeur réalisée ÷ record max
  return performedValue / maxRecord;
}

/**
 * Calcule l'intensité moyenne d'un exercice
 */
export function calculateExerciseIntensity(
  sets: WorkoutSet[],
  exercise: Exercise,
  personalRecords: PersonalRecord[]
): number {
  const maxRecord = getExerciseMaxRecord(exercise.id, exercise, personalRecords);
  
  if (maxRecord === 0 || sets.length === 0) return 0;
  
  // Calculer l'intensité de chaque série
  const setIntensities = sets.map(set => 
    calculateSetIntensity(set, exercise, maxRecord)
  );
  
  // Retourner la moyenne des intensités
  const validIntensities = setIntensities.filter(intensity => intensity > 0);
  
  if (validIntensities.length === 0) return 0;
  
  return validIntensities.reduce((sum, intensity) => sum + intensity, 0) / validIntensities.length;
}

/**
 * Calcule l'intensité moyenne pondérée d'une séance
 */
export function calculateWorkoutIntensity(
  sets: WorkoutSet[],
  exercises: Exercise[],
  personalRecords: PersonalRecord[]
): number {
  // Grouper les sets par exercice
  const exerciseGroups = sets.reduce((groups, set) => {
    if (!groups[set.exerciceId]) {
      groups[set.exerciceId] = [];
    }
    groups[set.exerciceId].push(set);
    return groups;
  }, {} as Record<string, WorkoutSet[]>);

  let totalWeightedIntensity = 0;
  let totalVolume = 0;

  // Calculer l'intensité pondérée pour chaque exercice
  Object.entries(exerciseGroups).forEach(([exerciseId, exerciseSets]) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;
    
    const exerciseIntensity = calculateExerciseIntensity(exerciseSets, exercise, personalRecords);
    const exerciseVolume = calculateExerciseVolume(exerciseSets, exercise);
    
    if (exerciseIntensity > 0 && exerciseVolume > 0) {
      totalWeightedIntensity += exerciseIntensity * exerciseVolume;
      totalVolume += exerciseVolume;
    }
  });

  if (totalVolume === 0) return 0;
  
  return totalWeightedIntensity / totalVolume;
}

/**
 * Formate l'affichage de l'intensité en pourcentage
 */
export function formatIntensity(intensity: number): string {
  if (intensity === 0) return '0%';
  return `${Math.round(intensity * 100)}%`;
}

/**
 * Obtient la couleur et le label selon le niveau d'intensité
 */
export function getIntensityColor(intensity: number): {
  color: string;
  label: string;
} {
  if (intensity === 0) return { color: 'text-gray-400', label: 'Non défini' };
  if (intensity < 0.3) return { color: 'text-green-400', label: 'Faible' };
  if (intensity < 0.6) return { color: 'text-yellow-400', label: 'Modérée' };
  if (intensity < 0.8) return { color: 'text-orange-400', label: 'Élevée' };
  if (intensity < 1.0) return { color: 'text-red-400', label: 'Très élevée' };
  return { color: 'text-purple-400', label: 'Record battu!' };
} 