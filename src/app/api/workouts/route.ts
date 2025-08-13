import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
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

    const { db } = await connectToDatabase();
    const workouts = await db.collection('workouts').find({ userId }).toArray();
    
    // Convertir les _id MongoDB en format sans _id et trier par date décroissante
    const workoutsWithStringId = workouts
      .map(workout => {
        const { _id, ...workoutWithoutId } = workout;
        return {
          ...workoutWithoutId,
          id: workout.id || _id.toString(), // Préférer le champ id s'il existe
        } as any; // Type assertion pour éviter l'erreur TypeScript
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(workoutsWithStringId);
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

    const { db } = await connectToDatabase();

    // Générer un ID unique
    const lastWorkout = await db.collection('workouts').findOne({}, { sort: { id: -1 } });
    const maxId = lastWorkout?.id ? parseInt(lastWorkout.id) : 0;
    const newId = (maxId + 1).toString();

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

    // Insérer dans MongoDB
    await db.collection('workouts').insertOne(newWorkout);

    // Retourner sans l'_id MongoDB
    const responseWorkout = {
      ...newWorkout,
      _id: undefined
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