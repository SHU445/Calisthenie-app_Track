import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Workout } from '@/types';

// GET - Récupérer un entraînement spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        sets: {
          include: {
            exercise: true
          }
        }
      }
    });

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Formatter la réponse
    const responseWorkout = {
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
    
    // Vérifier si l'entraînement existe
    const existingWorkout = await prisma.workout.findUnique({
      where: { id }
    });
    
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Si des sets sont fournis, on doit les gérer
    let setsUpdate = {};
    if (updateData.sets) {
      // Supprimer les anciens sets et créer les nouveaux
      setsUpdate = {
        sets: {
          deleteMany: {},
          create: updateData.sets.map((set: any) => ({
            exerciceId: set.exerciceId,
            repetitions: set.repetitions,
            poids: set.poids,
            duree: set.duree,
            tempsRepos: set.tempsRepos || 0,
            notes: set.notes
          }))
        }
      };
    }

    // Mettre à jour l'entraînement
    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        ...(updateData.nom && { nom: updateData.nom }),
        ...(updateData.date && { date: new Date(updateData.date) }),
        ...(updateData.type && { type: updateData.type }),
        ...(updateData.duree !== undefined && { duree: updateData.duree }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.ressenti !== undefined && { ressenti: updateData.ressenti }),
        ...(updateData.caloriesBrulees !== undefined && { caloriesBrulees: updateData.caloriesBrulees }),
        ...setsUpdate
      },
      include: {
        sets: true
      }
    });

    // Formatter la réponse
    const responseWorkout = {
      id: updatedWorkout.id,
      nom: updatedWorkout.nom,
      date: updatedWorkout.date.toISOString(),
      duree: updatedWorkout.duree,
      type: updatedWorkout.type,
      description: updatedWorkout.description,
      userId: updatedWorkout.userId,
      ressenti: updatedWorkout.ressenti,
      caloriesBrulees: updatedWorkout.caloriesBrulees,
      sets: updatedWorkout.sets.map(set => ({
        id: set.id,
        exerciceId: set.exerciceId,
        repetitions: set.repetitions,
        poids: set.poids,
        duree: set.duree,
        tempsRepos: set.tempsRepos,
        notes: set.notes
      }))
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
    
    // Vérifier si l'entraînement existe avant suppression
    const existingWorkout = await prisma.workout.findUnique({
      where: { id }
    });
    
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Supprimer l'entraînement (les sets seront supprimés automatiquement grâce à onDelete: Cascade)
    await prisma.workout.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}
