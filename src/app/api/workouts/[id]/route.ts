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
    return [];
  }
}

// Fonction pour sauvegarder les entraînements
async function saveWorkouts(workouts: Workout[]): Promise<void> {
  await writeFile(WORKOUTS_FILE, JSON.stringify(workouts, null, 2));
}

// GET - Récupérer un entraînement spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workouts = await getWorkouts();
    const workout = workouts.find(w => w.id === id);

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un entraînement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();
    const workouts = await getWorkouts();
    
    const workoutIndex = workouts.findIndex(w => w.id === id);
    
    if (workoutIndex === -1) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Mettre à jour l'entraînement
    workouts[workoutIndex] = {
      ...workouts[workoutIndex],
      ...updateData,
      id: id // S'assurer que l'ID ne change pas
    };

    await saveWorkouts(workouts);

    return NextResponse.json(workouts[workoutIndex]);
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un entraînement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workouts = await getWorkouts();
    const workoutIndex = workouts.findIndex(w => w.id === id);
    
    if (workoutIndex === -1) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Supprimer l'entraînement
    workouts.splice(workoutIndex, 1);
    await saveWorkouts(workouts);

    return NextResponse.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
} 