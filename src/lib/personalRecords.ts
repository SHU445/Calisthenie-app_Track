import { prisma } from '@/lib/prisma';
import { WorkoutSet, Exercise } from '@/types';

/**
 * Met à jour les records personnels basés sur les sets d'un entraînement
 * @param sets - Les sets de l'entraînement
 * @param workoutId - ID de l'entraînement
 * @param userId - ID de l'utilisateur
 */
export async function updatePersonalRecords(
  sets: WorkoutSet[],
  workoutId: string,
  userId: string
): Promise<void> {
  try {
    // Récupérer les exercices pour connaître leur type de quantification
    const exerciseIds = Array.from(new Set(sets.map(set => set.exerciceId)));
    const exercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } }
    });

    const exerciseMap = new Map(exercises.map(ex => [ex.id, ex]));

    // Grouper les sets par exercice
    const exerciseGroups = sets.reduce((groups, set) => {
      if (!groups[set.exerciceId]) {
        groups[set.exerciceId] = [];
      }
      groups[set.exerciceId].push(set);
      return groups;
    }, {} as Record<string, WorkoutSet[]>);

    // Traiter chaque exercice
    for (const [exerciseId, exerciseSets] of Object.entries(exerciseGroups)) {
      const exercise = exerciseMap.get(exerciseId);
      if (!exercise) continue;

      // Déterminer le type de record selon le type d'exercice
      const recordType = exercise.typeQuantification === 'hold' ? 'temps' : 'repetitions';
      
      // Calculer les valeurs maximales pour cet exercice
      let maxValue = 0;
      
      if (recordType === 'temps') {
        // Pour les exercices de maintien : prendre la durée maximale d'une série
        maxValue = Math.max(...exerciseSets.map(set => set.duree || 0));
      } else {
        // Pour les exercices de répétitions : prendre le nombre max de répétitions d'une série
        maxValue = Math.max(...exerciseSets.map(set => set.repetitions || 0));
      }

      // Vérifier s'il y a des charges utilisées
      const maxWeight = Math.max(...exerciseSets.map(set => set.poids || 0));

      // Mettre à jour le record de répétitions/temps
      if (maxValue > 0) {
        await updateOrCreateRecord(
          userId,
          exerciseId,
          recordType,
          maxValue,
          workoutId
        );
      }

      // Mettre à jour le record de poids si applicable
      if (maxWeight > 0) {
        await updateOrCreateRecord(
          userId,
          exerciseId,
          'poids',
          maxWeight,
          workoutId
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des records personnels:', error);
    // Ne pas faire échouer l'entraînement si les records échouent
  }
}

/**
 * Met à jour ou crée un record personnel
 */
async function updateOrCreateRecord(
  userId: string,
  exerciseId: string,
  type: 'repetitions' | 'temps' | 'poids',
  value: number,
  workoutId: string
): Promise<void> {
  // Chercher un record existant
  const existingRecord = await prisma.personalRecord.findFirst({
    where: {
      userId,
      exerciceId: exerciseId,
      type
    }
  });

  if (existingRecord) {
    // Vérifier si c'est un nouveau record
    let isNewRecord = false;
    
    if (type === 'temps') {
      // Pour le temps, une valeur plus petite est meilleure (moins de temps)
      isNewRecord = value < existingRecord.valeur;
    } else {
      // Pour répétitions et poids, plus c'est haut, mieux c'est
      isNewRecord = value > existingRecord.valeur;
    }

    if (isNewRecord) {
      await prisma.personalRecord.update({
        where: { id: existingRecord.id },
        data: {
          valeur: value,
          date: new Date(),
          workoutId
        }
      });
    }
  } else {
    // Créer un nouveau record
    await prisma.personalRecord.create({
      data: {
        userId,
        exerciceId: exerciseId,
        type,
        valeur: value,
        workoutId
      }
    });
  }
}

/**
 * Récupère les records personnels d'un utilisateur
 */
export async function getPersonalRecords(userId: string) {
  return await prisma.personalRecord.findMany({
    where: { userId },
    include: {
      exercise: true,
      workout: true
    },
    orderBy: {
      date: 'desc'
    }
  });
}

/**
 * Récupère le record maximum pour un exercice donné
 */
export async function getMaxRecord(
  userId: string,
  exerciseId: string,
  type: 'repetitions' | 'temps' | 'poids'
): Promise<number> {
  const record = await prisma.personalRecord.findFirst({
    where: {
      userId,
      exerciceId: exerciseId,
      type
    },
    orderBy: {
      valeur: type === 'temps' ? 'asc' : 'desc' // Pour le temps, le plus petit est le meilleur
    }
  });

  return record ? record.valeur : 0;
}
