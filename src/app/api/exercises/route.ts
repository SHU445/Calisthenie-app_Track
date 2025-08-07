import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Exercise } from '@/types';

const EXERCISES_FILE_PATH = path.join(process.cwd(), 'src/data/liste_exercices.json');

// GET - Récupérer tous les exercices
export async function GET() {
  try {
    const fileContents = await fs.readFile(EXERCISES_FILE_PATH, 'utf8');
    const exercises: Exercise[] = JSON.parse(fileContents);
    
    return NextResponse.json(exercises);
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
    
    // Lire le fichier existant
    const fileContents = await fs.readFile(EXERCISES_FILE_PATH, 'utf8');
    const exercises: Exercise[] = JSON.parse(fileContents);
    
    // Vérifier si un exercice avec le même nom existe déjà
    const existingExercise = exercises.find(ex => ex.nom.toLowerCase() === newExercise.nom.toLowerCase());
    if (existingExercise) {
      return NextResponse.json(
        { error: 'Un exercice avec ce nom existe déjà' },
        { status: 409 }
      );
    }
    
    // Générer un nouvel ID
    const maxId = exercises.length > 0 ? Math.max(...exercises.map(ex => parseInt(ex.id))) : 0;
    const newId = (maxId + 1).toString();
    
    // Ajouter le nouvel exercice avec l'ID généré
    const exerciseWithId = { ...newExercise, id: newId };
    exercises.push(exerciseWithId);
    
    // Sauvegarder le fichier
    await fs.writeFile(EXERCISES_FILE_PATH, JSON.stringify(exercises, null, 2));
    
    return NextResponse.json(exerciseWithId, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'exercice' },
      { status: 500 }
    );
  }
} 