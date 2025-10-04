import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Workout } from '@/types';

// GET - Récupérer tous les entraînements d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        sets: {
          include: {
            exercise: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Transformer les données pour correspondre au format attendu par l'application
    const formattedWorkouts = workouts.map(workout => ({
      id: workout.id,
      nom: workout.nom,
      date: workout.date.toISOString(),
      duree: workout.duree,
      type: workout.type,
      description: workout.description,
      userId: workout.userId,
      ressenti: workout.ressenti,
      caloriesBrulees: workout.caloriesBrulees,
      sets: workout.sets.map(set => ({
        id: set.id,
        exerciceId: set.exerciceId,
        repetitions: set.repetitions,
        poids: set.poids,
        duree: set.duree,
        tempsRepos: set.tempsRepos,
        notes: set.notes
      }))
    }));

    return NextResponse.json(formattedWorkouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel entraînement
export async function POST(request: NextRequest) {
  try {
    const workoutData = await request.json();

    // Validation des données requises
    if (!workoutData.nom || !workoutData.date || !workoutData.type || !workoutData.userId) {
      return NextResponse.json(
        { error: 'Missing required fields: nom, date, type, userId' },
        { status: 400 }
      );
    }

    // Créer le workout avec ses sets
    const newWorkout = await prisma.workout.create({
      data: {
        nom: workoutData.nom,
        date: new Date(workoutData.date),
        type: workoutData.type,
        duree: workoutData.duree || 0,
        description: workoutData.description || '',
        userId: workoutData.userId,
        ressenti: workoutData.ressenti || 3,
        caloriesBrulees: workoutData.caloriesBrulees,
        sets: {
          create: (workoutData.sets || []).map((set: any) => ({
            exerciceId: set.exerciceId,
            repetitions: set.repetitions,
            poids: set.poids,
            duree: set.duree,
            tempsRepos: set.tempsRepos || 0,
            notes: set.notes
          }))
        }
      },
      include: {
        sets: true
      }
    });

    // Formatter la réponse
    const responseWorkout = {
      id: newWorkout.id,
      nom: newWorkout.nom,
      date: newWorkout.date.toISOString(),
      duree: newWorkout.duree,
      type: newWorkout.type,
      description: newWorkout.description,
      userId: newWorkout.userId,
      ressenti: newWorkout.ressenti,
      caloriesBrulees: newWorkout.caloriesBrulees,
      sets: newWorkout.sets.map(set => ({
        id: set.id,
        exerciceId: set.exerciceId,
        repetitions: set.repetitions,
        poids: set.poids,
        duree: set.duree,
        tempsRepos: set.tempsRepos,
        notes: set.notes
      }))
    };

    return NextResponse.json(responseWorkout, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
} 