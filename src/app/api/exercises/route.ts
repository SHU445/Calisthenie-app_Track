import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Exercise } from '@/types';

// GET - Récupérer tous les exercices
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Optimisation : Créer des index pour les recherches fréquentes
    await db.collection('exercises').createIndex({ nom: 1 });
    await db.collection('exercises').createIndex({ categorie: 1 });
    
    // Optimisation : Trier directement en base
    const exercises = await db.collection('exercises')
      .find({})
      .sort({ nom: 1 }) // Trier par nom alphabétique
      .toArray();
    
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

// POST - Ajouter un nouvel exercice
export async function POST(request: NextRequest) {
  try {
    const newExercise: Exercise = await request.json();
    
    // Validation des données requises
    if (!newExercise.nom || !newExercise.categorie || !newExercise.difficulte || !newExercise.description) {
      return NextResponse.json(
        { error: 'Données manquantes pour créer l\'exercice' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Vérifier si un exercice avec le même nom existe déjà
    const existingExercise = await db.collection('exercises').findOne({
      nom: { $regex: new RegExp(`^${newExercise.nom}$`, 'i') }
    });
    
    if (existingExercise) {
      return NextResponse.json(
        { error: 'Un exercice avec ce nom existe déjà' },
        { status: 409 }
      );
    }
    
    // Générer un nouvel ID
    const lastExercise = await db.collection('exercises').findOne({}, { sort: { id: -1 } });
    const maxId = lastExercise?.id ? parseInt(lastExercise.id) : 0;
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