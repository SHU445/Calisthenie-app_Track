import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Exercise } from '@/types';

// PUT - Modifier un exercice personnalisé
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData: Partial<Exercise> = await request.json();
    
    console.log('PUT request - exerciseId:', id, 'userId:', updateData.userId);
    
    // Validation: userId requis pour les modifications
    if (!updateData.userId || updateData.userId === 'undefined' || updateData.userId === 'null') {
      return NextResponse.json(
        { error: 'userId requis pour modifier un exercice' },
        { status: 400 }
      );
    }
    
    // Vérifier si l'exercice existe
    const existingExercise = await prisma.exercise.findUnique({
      where: { id }
    });
    
    if (!existingExercise) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si c'est un exercice de base (sans userId) - ne peut pas être modifié
    if (!existingExercise.userId) {
      return NextResponse.json(
        { error: 'Les exercices de base ne peuvent pas être modifiés' },
        { status: 403 }
      );
    }
    
    // Vérifier si l'utilisateur est le propriétaire de l'exercice
    if (existingExercise.userId !== updateData.userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez modifier que vos propres exercices' },
        { status: 403 }
      );
    }
    
    // Vérifier si le nouveau nom existe déjà pour cet utilisateur (si le nom est modifié)
    if (updateData.nom && updateData.nom !== existingExercise.nom) {
      const duplicateExercise = await prisma.exercise.findFirst({
        where: {
          nom: {
            equals: updateData.nom,
            mode: 'insensitive'
          },
          userId: updateData.userId,
          id: { not: id }
        }
      });
      
      if (duplicateExercise) {
        return NextResponse.json(
          { error: 'Vous avez déjà un exercice avec ce nom' },
          { status: 409 }
        );
      }
    }
    
    // Mettre à jour l'exercice
    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        ...(updateData.nom && { nom: updateData.nom }),
        ...(updateData.categorie && { categorie: updateData.categorie }),
        ...(updateData.difficulte && { difficulte: updateData.difficulte }),
        ...(updateData.muscles && { muscles: updateData.muscles }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.instructions && { instructions: updateData.instructions }),
        ...(updateData.image !== undefined && { image: updateData.image }),
        ...(updateData.video !== undefined && { video: updateData.video }),
        ...(updateData.typeQuantification && { typeQuantification: updateData.typeQuantification })
      }
    });
    
    return NextResponse.json(updatedExercise);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'exercice' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un exercice personnalisé
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('DELETE request - exerciseId:', id, 'userId:', userId);
    
    // Validation: userId requis pour les suppressions
    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json(
        { error: 'userId requis pour supprimer un exercice' },
        { status: 400 }
      );
    }
    
    // Vérifier si l'exercice existe avant suppression
    const existingExercise = await prisma.exercise.findUnique({
      where: { id }
    });
    
    if (!existingExercise) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si c'est un exercice de base (sans userId) - ne peut pas être supprimé
    if (!existingExercise.userId) {
      return NextResponse.json(
        { error: 'Les exercices de base ne peuvent pas être supprimés' },
        { status: 403 }
      );
    }
    
    // Vérifier si l'utilisateur est le propriétaire de l'exercice
    if (existingExercise.userId !== userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez supprimer que vos propres exercices' },
        { status: 403 }
      );
    }
    
    // Supprimer l'exercice
    await prisma.exercise.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      message: 'Exercice supprimé avec succès',
      exercise: existingExercise 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'exercice' },
      { status: 500 }
    );
  }
}

// GET - Récupérer un exercice spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Trouver l'exercice
    const exercise = await prisma.exercise.findUnique({
      where: { id }
    });
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'exercice' },
      { status: 500 }
    );
  }
} 