/**
 * Script de migration de MongoDB vers Prisma/PostgreSQL
 * 
 * Ce script migre toutes les données de MongoDB vers la base de données Prisma.
 * Il doit être exécuté après avoir configuré Prisma et créé le schéma.
 * 
 * Utilisation:
 * 1. Assurez-vous que DATABASE_URL et MONGODB_URI sont configurés dans .env.local
 * 2. Exécutez: npx prisma generate
 * 3. Exécutez: npx prisma db push
 * 4. Exécutez: node scripts/migrate-to-prisma.js
 */

const { MongoClient } = require('mongodb');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrate() {
  // Vérifier si MONGODB_URI existe
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️  MONGODB_URI non défini. Migration ignorée.');
    console.log('Si vous avez des données MongoDB à migrer, configurez MONGODB_URI dans .env.local');
    return;
  }

  const mongoClient = new MongoClient(mongoUri);
  
  try {
    await mongoClient.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = mongoClient.db(process.env.MONGODB_DB_NAME || 'calisthenie_app');
    
    // Migrer les utilisateurs
    console.log('\n📦 Migration des utilisateurs...');
    const users = await db.collection('users').find({}).toArray();
    
    for (const user of users) {
      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findFirst({
          where: { username: user.username }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id || user._id.toString(),
              username: user.username,
              email: user.email,
              password: user.password,
              dateCreation: user.dateCreation ? new Date(user.dateCreation) : new Date(),
              theme: user.preferences?.theme || 'dark',
              units: user.preferences?.units || 'metric',
              language: user.preferences?.language || 'fr'
            }
          });
          console.log(`  ✓ Utilisateur migré: ${user.username}`);
        } else {
          console.log(`  ⊙ Utilisateur existe déjà: ${user.username}`);
        }
      } catch (error) {
        console.error(`  ✗ Erreur pour ${user.username}:`, error.message);
      }
    }
    
    // Migrer les exercices
    console.log('\n📦 Migration des exercices...');
    const exercises = await db.collection('exercises').find({}).toArray();
    
    for (const exercise of exercises) {
      try {
        // Vérifier si l'exercice existe déjà
        const existingExercise = await prisma.exercise.findFirst({
          where: { 
            nom: exercise.nom,
            userId: exercise.userId || null
          }
        });

        if (!existingExercise) {
          await prisma.exercise.create({
            data: {
              id: exercise.id || exercise._id.toString(),
              nom: exercise.nom,
              categorie: exercise.categorie,
              difficulte: exercise.difficulte,
              muscles: exercise.muscles || [],
              description: exercise.description,
              instructions: exercise.instructions || [],
              image: exercise.image,
              video: exercise.video,
              typeQuantification: exercise.typeQuantification || 'rep',
              userId: exercise.userId || null
            }
          });
          console.log(`  ✓ Exercice migré: ${exercise.nom}`);
        } else {
          console.log(`  ⊙ Exercice existe déjà: ${exercise.nom}`);
        }
      } catch (error) {
        console.error(`  ✗ Erreur pour ${exercise.nom}:`, error.message);
      }
    }
    
    // Migrer les workouts
    console.log('\n📦 Migration des entraînements...');
    const workouts = await db.collection('workouts').find({}).toArray();
    
    for (const workout of workouts) {
      try {
        // Vérifier si le workout existe déjà
        const workoutId = workout.id || workout._id.toString();
        const existingWorkout = await prisma.workout.findUnique({
          where: { id: workoutId }
        });

        if (!existingWorkout) {
          await prisma.workout.create({
            data: {
              id: workoutId,
              nom: workout.nom,
              date: new Date(workout.date),
              duree: workout.duree || 0,
              type: workout.type,
              description: workout.description,
              userId: workout.userId,
              ressenti: workout.ressenti || 3,
              caloriesBrulees: workout.caloriesBrulees,
              sets: {
                create: (workout.sets || []).map(set => ({
                  id: set.id,
                  exerciceId: set.exerciceId,
                  repetitions: set.repetitions,
                  poids: set.poids,
                  duree: set.duree,
                  tempsRepos: set.tempsRepos || 0,
                  notes: set.notes
                }))
              }
            }
          });
          console.log(`  ✓ Entraînement migré: ${workout.nom}`);
        } else {
          console.log(`  ⊙ Entraînement existe déjà: ${workout.nom}`);
        }
      } catch (error) {
        console.error(`  ✗ Erreur pour ${workout.nom}:`, error.message);
      }
    }
    
    console.log('\n✅ Migration terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

migrate();

