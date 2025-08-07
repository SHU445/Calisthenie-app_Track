import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { Workout } from '@/types';

const WORKOUTS_FILE = join(process.cwd(), 'src/data/workouts.json');

// Fonction pour lire les entraînements
async function getWorkouts(): Promise<Workout[]> {
  try {
    const data = await readFile(WORKOUTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    return [];
  }
}

// Fonction pour sauvegarder les entraînements
async function saveWorkouts(workouts: Workout[]): Promise<void> {
  await writeFile(WORKOUTS_FILE, JSON.stringify(workouts, null, 2));
}

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

    const workouts = await getWorkouts();
    const userWorkouts = workouts.filter(workout => workout.userId === userId);
    
    // Trier par date décroissante (plus récent en premier)
    userWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(userWorkouts);
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

    const workouts = await getWorkouts();

    // Générer un ID unique
    const newId = (Math.max(0, ...workouts.map(w => parseInt(w.id) || 0)) + 1).toString();

    const newWorkout: Workout = {
      id: newId,
      nom: workoutData.nom,
      date: workoutData.date,
      type: workoutData.type,
      duree: workoutData.duree || 0,
      description: workoutData.description || '',
      userId: workoutData.userId,
      sets: workoutData.sets || [],
      ressenti: workoutData.ressenti || 3,
      caloriesBrulees: workoutData.caloriesBrulees
    };

    workouts.push(newWorkout);
    await saveWorkouts(workouts);

    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
} 