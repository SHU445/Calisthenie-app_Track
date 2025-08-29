import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Exercise } from '@/types';

// GET - Récupérer les exercices (de base + personnalisés de l'utilisateur)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const { db } = await connectToDatabase();
    
    // Récupérer exercices de base (sans userId) et exercices personnalisés de l'utilisateur
    const query = userId 
      ? { $or: [{ userId: { $exists: false } }, { userId: userId }] }
      : { userId: { $exists: false } }; // Si pas d'userId, ne renvoyer que les exercices de base
    
    const exercises = await db.collection('exercises').find(query).toArray();
    
    // Convertir les _id MongoDB en id string
    const exercisesWithStringId = exercises.map(exercise => ({
      ...exercise,
      id: exercise._id ? exercise._id.toString() : exercise.id,
      _id: undefined
    }));
    
    return NextResponse.json(exercisesWithStringId);
  } catch (error) {
    console.error('Erreur lors de la lecture des exercices:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des exercices' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un nouvel exercice personnalisé
export async function POST(request: NextRequest) {
  try {
    const newExercise: Exercise = await request.json();
    
    // Validation des données requises
    if (!newExercise.nom || !newExercise.categorie || !newExercise.difficulte || !newExercise.description || !newExercise.userId) {
      return NextResponse.json(
        { error: 'Données manquantes pour créer l\'exercice (nom, catégorie, difficulté, description, userId requis)' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Vérifier si un exercice avec le même nom existe déjà pour cet utilisateur
    const existingExercise = await db.collection('exercises').findOne({
      nom: { $regex: new RegExp(`^${newExercise.nom}$`, 'i') },
      userId: newExercise.userId
    });
    
    if (existingExercise) {
      return NextResponse.json(
        { error: 'Vous avez déjà un exercice avec ce nom' },
        { status: 409 }
      );
    }
    
    // Générer un ID unique pour cet utilisateur
    const lastExercise = await db.collection('exercises').findOne(
      { userId: newExercise.userId }, 
      { sort: { id: -1 } }
    );
    const maxId = lastExercise?.id ? parseInt(lastExercise.id) : 1000; // Commencer les IDs utilisateur à 1000+
    const newId = (maxId + 1).toString();
    
    // Ajouter le nouvel exercice avec l'ID généré
    const exerciseWithId = { ...newExercise, id: newId };
    
    // Insérer dans MongoDB
    const result = await db.collection('exercises').insertOne(exerciseWithId);
    
    // Retourner l'exercice sans l'_id MongoDB
    const responseExercise = {
      ...exerciseWithId,
      _id: undefined
    };
    
    return NextResponse.json(responseExercise, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'exercice' },
      { status: 500 }
    );
  }
} 