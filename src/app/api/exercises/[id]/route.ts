import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Exercise } from '@/types';
import { ObjectId } from 'mongodb';

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
    
    const { db } = await connectToDatabase();
    
    // Chercher l'exercice par id ou _id
    let query;
    if (ObjectId.isValid(id)) {
      // Si l'id est un ObjectId valide, chercher par _id ou id
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    } else {
      // Sinon chercher seulement par id
      query = { id };
    }
    
    // Vérifier si l'exercice existe
    const existingExercise = await db.collection('exercises').findOne(query);
    
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
      const duplicateQuery = {
        nom: { $regex: new RegExp(`^${updateData.nom}$`, 'i') },
        userId: updateData.userId,
        $and: [
          { $nor: [query] } // Exclure l'exercice actuel
        ]
      };
      
      const duplicateExercise = await db.collection('exercises').findOne(duplicateQuery);
      
      if (duplicateExercise) {
        return NextResponse.json(
          { error: 'Vous avez déjà un exercice avec ce nom' },
          { status: 409 }
        );
      }
    }
    
    // Mettre à jour l'exercice dans MongoDB
    const result = await db.collection('exercises').updateOne(
      query,
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    // Récupérer l'exercice mis à jour
    const updatedExercise = await db.collection('exercises').findOne(query);
    
    // Retourner sans l'_id MongoDB
    const responseExercise = {
      ...updatedExercise,
      _id: undefined
    };
    
    return NextResponse.json(responseExercise);
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
    
    const { db } = await connectToDatabase();
    
    // Chercher l'exercice par id ou _id
    let query;
    if (ObjectId.isValid(id)) {
      // Si l'id est un ObjectId valide, chercher par _id ou id
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    } else {
      // Sinon chercher seulement par id
      query = { id };
    }
    
    // Vérifier si l'exercice existe avant suppression
    const existingExercise = await db.collection('exercises').findOne(query);
    
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
    
    // Supprimer l'exercice de MongoDB
    const result = await db.collection('exercises').deleteOne(query);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    // Retourner l'exercice supprimé sans l'_id MongoDB
    const deletedExercise = {
      ...existingExercise,
      _id: undefined
    };
    
    return NextResponse.json({ 
      message: 'Exercice supprimé avec succès',
      exercise: deletedExercise 
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
    
    const { db } = await connectToDatabase();
    
    // Chercher l'exercice par id ou _id
    let query;
    if (ObjectId.isValid(id)) {
      // Si l'id est un ObjectId valide, chercher par _id ou id
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    } else {
      // Sinon chercher seulement par id
      query = { id };
    }
    
    // Trouver l'exercice dans MongoDB
    const exercise = await db.collection('exercises').findOne(query);
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    // Retourner sans l'_id MongoDB
    const responseExercise = {
      ...exercise,
      _id: undefined
    };
    
    return NextResponse.json(responseExercise);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'exercice' },
      { status: 500 }
    );
  }
} 