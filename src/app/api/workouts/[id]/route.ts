import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Workout } from '@/types';
import { ObjectId } from 'mongodb';

// GET - Récupérer un entraînement spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    
    // Chercher l'entraînement par id ou _id
    let query;
    if (ObjectId.isValid(id)) {
      // Si l'id est un ObjectId valide, chercher par _id ou id
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    } else {
      // Sinon chercher seulement par id
      query = { id };
    }
    
    const workout = await db.collection('workouts').findOne(query);

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Retourner sans l'_id MongoDB
    const responseWorkout = {
      ...workout,
      _id: undefined
    };

    return NextResponse.json(responseWorkout);
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
    const { db } = await connectToDatabase();
    
    // Chercher l'entraînement par id ou _id
    let query;
    if (ObjectId.isValid(id)) {
      // Si l'id est un ObjectId valide, chercher par _id ou id
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    } else {
      // Sinon chercher seulement par id
      query = { id };
    }
    
    // Vérifier si l'entraînement existe
    const existingWorkout = await db.collection('workouts').findOne(query);
    
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Mettre à jour l'entraînement dans MongoDB
    const result = await db.collection('workouts').updateOne(
      query,
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Récupérer l'entraînement mis à jour
    const updatedWorkout = await db.collection('workouts').findOne(query);

    // Retourner sans l'_id MongoDB
    const responseWorkout = {
      ...updatedWorkout,
      _id: undefined
    };

    return NextResponse.json(responseWorkout);
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
    const { db } = await connectToDatabase();
    
    // Chercher l'entraînement par id ou _id
    let query;
    if (ObjectId.isValid(id)) {
      // Si l'id est un ObjectId valide, chercher par _id ou id
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    } else {
      // Sinon chercher seulement par id
      query = { id };
    }
    
    // Vérifier si l'entraînement existe avant suppression
    const existingWorkout = await db.collection('workouts').findOne(query);
    
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Supprimer l'entraînement de MongoDB
    const result = await db.collection('workouts').deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
} 