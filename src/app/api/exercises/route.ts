import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Exercise } from '@/types';

// GET - Récupérer les exercices (de base + personnalisés de l'utilisateur)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Récupérer exercices de base (sans userId) et exercices personnalisés de l'utilisateur
    const exercises = await prisma.exercise.findMany({
      where: userId 
        ? {
            OR: [
              { userId: null },
              { userId: userId }
            ]
          }
        : { userId: null }
    });
    
    return NextResponse.json(exercises);
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
    
    // Vérifier si un exercice avec le même nom existe déjà pour cet utilisateur
    const existingExercise = await prisma.exercise.findFirst({
      where: {
        nom: {
          equals: newExercise.nom,
          mode: 'insensitive'
        },
        userId: newExercise.userId
      }
    });
    
    if (existingExercise) {
      return NextResponse.json(
        { error: 'Vous avez déjà un exercice avec ce nom' },
        { status: 409 }
      );
    }
    
    // Créer le nouvel exercice
    const createdExercise = await prisma.exercise.create({
      data: {
        nom: newExercise.nom,
        categorie: newExercise.categorie,
        difficulte: newExercise.difficulte,
        muscles: newExercise.muscles || [],
        description: newExercise.description,
        instructions: newExercise.instructions || [],
        image: newExercise.image,
        video: newExercise.video,
        typeQuantification: newExercise.typeQuantification || 'rep',
        userId: newExercise.userId
      }
    });
    
    return NextResponse.json(createdExercise, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'exercice' },
      { status: 500 }
    );
  }
} 