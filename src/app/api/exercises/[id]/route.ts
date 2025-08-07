import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Exercise } from '@/types';

const EXERCISES_FILE_PATH = path.join(process.cwd(), 'src/data/liste_exercices.json');

// PUT - Modifier un exercice existant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData: Partial<Exercise> = await request.json();
    
    // Lire le fichier existant
    const fileContents = await fs.readFile(EXERCISES_FILE_PATH, 'utf8');
    const exercises: Exercise[] = JSON.parse(fileContents);
    
    // Trouver l'index de l'exercice à modifier
    const exerciseIndex = exercises.findIndex(exercise => exercise.id === id);
    
    if (exerciseIndex === -1) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si le nouveau nom existe déjà (si le nom est modifié)
    if (updateData.nom && updateData.nom !== exercises[exerciseIndex].nom) {
      const existingExercise = exercises.find(ex => 
        ex.nom.toLowerCase() === updateData.nom!.toLowerCase() && ex.id !== id
      );
      if (existingExercise) {
        return NextResponse.json(
          { error: 'Un exercice avec ce nom existe déjà' },
          { status: 409 }
        );
      }
    }
    
    // Mettre à jour l'exercice
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], ...updateData };
    
    // Sauvegarder le fichier
    await fs.writeFile(EXERCISES_FILE_PATH, JSON.stringify(exercises, null, 2));
    
    return NextResponse.json(exercises[exerciseIndex]);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'exercice:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'exercice' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un exercice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Lire le fichier existant
    const fileContents = await fs.readFile(EXERCISES_FILE_PATH, 'utf8');
    const exercises: Exercise[] = JSON.parse(fileContents);
    
    // Trouver l'index de l'exercice à supprimer
    const exerciseIndex = exercises.findIndex(exercise => exercise.id === id);
    
    if (exerciseIndex === -1) {
      return NextResponse.json(
        { error: 'Exercice non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer l'exercice
    const deletedExercise = exercises.splice(exerciseIndex, 1)[0];
    
    // Sauvegarder le fichier
    await fs.writeFile(EXERCISES_FILE_PATH, JSON.stringify(exercises, null, 2));
    
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
    
    // Lire le fichier existant
    const fileContents = await fs.readFile(EXERCISES_FILE_PATH, 'utf8');
    const exercises: Exercise[] = JSON.parse(fileContents);
    
    // Trouver l'exercice
    const exercise = exercises.find(exercise => exercise.id === id);
    
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