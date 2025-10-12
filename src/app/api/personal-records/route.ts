import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les records personnels d'un utilisateur
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

    const personalRecords = await prisma.personalRecord.findMany({
      where: { userId },
      include: {
        exercise: {
          select: {
            id: true,
            nom: true,
            categorie: true,
            difficulte: true,
            typeQuantification: true
          }
        },
        workout: {
          select: {
            id: true,
            nom: true,
            date: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Formatter la réponse
    const formattedRecords = personalRecords.map(record => ({
      id: record.id,
      userId: record.userId,
      exerciceId: record.exerciceId,
      type: record.type,
      valeur: record.valeur,
      date: record.date.toISOString(),
      workoutId: record.workoutId,
      exercise: record.exercise,
      workout: record.workout ? {
        id: record.workout.id,
        nom: record.workout.nom,
        date: record.workout.date.toISOString()
      } : null
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching personal records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personal records' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour un record personnel
export async function POST(request: NextRequest) {
  try {
    const recordData = await request.json();

    // Validation des données requises
    if (!recordData.userId || !recordData.exerciceId || !recordData.type || recordData.valeur === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, exerciceId, type, valeur' },
        { status: 400 }
      );
    }

    // Chercher un record existant
    const existingRecord = await prisma.personalRecord.findFirst({
      where: {
        userId: recordData.userId,
        exerciceId: recordData.exerciceId,
        type: recordData.type
      }
    });

    let record: any;

    if (existingRecord) {
      // Vérifier si c'est un nouveau record
      let isNewRecord = false;
      
      if (recordData.type === 'temps') {
        // Pour le temps, une valeur plus petite est meilleure
        isNewRecord = recordData.valeur < existingRecord.valeur;
      } else {
        // Pour répétitions et poids, plus c'est haut, mieux c'est
        isNewRecord = recordData.valeur > existingRecord.valeur;
      }

      if (isNewRecord) {
        record = await prisma.personalRecord.update({
          where: { id: existingRecord.id },
          data: {
            valeur: recordData.valeur,
            date: new Date(),
            workoutId: recordData.workoutId
          },
          include: {
            exercise: {
              select: {
                id: true,
                nom: true,
                categorie: true,
                difficulte: true,
                typeQuantification: true
              }
            },
            workout: {
              select: {
                id: true,
                nom: true,
                date: true
              }
            }
          }
        });
      } else {
        // Pour les records existants, on doit récupérer les relations
        record = await prisma.personalRecord.findUnique({
          where: { id: existingRecord.id },
          include: {
            exercise: {
              select: {
                id: true,
                nom: true,
                categorie: true,
                difficulte: true,
                typeQuantification: true
              }
            },
            workout: {
              select: {
                id: true,
                nom: true,
                date: true
              }
            }
          }
        });
      }
    } else {
      // Créer un nouveau record
      record = await prisma.personalRecord.create({
        data: {
          userId: recordData.userId,
          exerciceId: recordData.exerciceId,
          type: recordData.type,
          valeur: recordData.valeur,
          workoutId: recordData.workoutId
        },
        include: {
          exercise: {
            select: {
              id: true,
              nom: true,
              categorie: true,
              difficulte: true,
              typeQuantification: true
            }
          },
          workout: {
            select: {
              id: true,
              nom: true,
              date: true
            }
          }
        }
      });
    }

    // Formatter la réponse
    const responseRecord = {
      id: record.id,
      userId: record.userId,
      exerciceId: record.exerciceId,
      type: record.type,
      valeur: record.valeur,
      date: record.date.toISOString(),
      workoutId: record.workoutId,
      exercise: record.exercise ? {
        id: record.exercise.id,
        nom: record.exercise.nom,
        categorie: record.exercise.categorie,
        difficulte: record.exercise.difficulte,
        typeQuantification: record.exercise.typeQuantification
      } : null,
      workout: record.workout ? {
        id: record.workout.id,
        nom: record.workout.nom,
        date: record.workout.date.toISOString()
      } : null
    };

    return NextResponse.json(responseRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating personal record:', error);
    return NextResponse.json(
      { error: 'Failed to create/update personal record' },
      { status: 500 }
    );
  }
}
