/**
 * Script pour peupler la base de données Prisma avec les exercices de base
 * 
 * Ce script importe les exercices depuis liste_exercices.json dans Prisma.
 * 
 * Utilisation:
 * node scripts/seed-exercises.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('📦 Chargement des exercices de base...');
    
    // Lire le fichier JSON
    const exercisesPath = path.join(__dirname, '..', 'src', 'data', 'liste_exercices.json');
    const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
    
    console.log(`📋 ${exercisesData.length} exercices trouvés dans le fichier JSON\n`);
    
    let created = 0;
    let skipped = 0;
    
    for (const exercise of exercisesData) {
      try {
        // Vérifier si l'exercice existe déjà (exercice de base sans userId)
        const existingExercise = await prisma.exercise.findFirst({
          where: {
            nom: exercise.nom,
            userId: null
          }
        });

        if (!existingExercise) {
          await prisma.exercise.create({
            data: {
              nom: exercise.nom,
              categorie: exercise.categorie,
              difficulte: exercise.difficulte,
              muscles: exercise.muscles || [],
              description: exercise.description,
              instructions: exercise.instructions || [],
              image: exercise.image,
              video: exercise.video,
              typeQuantification: exercise.typeQuantification || 'rep',
              userId: null // Exercice de base
            }
          });
          created++;
          console.log(`  ✓ Exercice créé: ${exercise.nom}`);
        } else {
          skipped++;
          console.log(`  ⊙ Exercice existe déjà: ${exercise.nom}`);
        }
      } catch (error) {
        console.error(`  ✗ Erreur pour ${exercise.nom}:`, error.message);
      }
    }
    
    console.log('\n✅ Importation terminée !');
    console.log(`   - ${created} exercices créés`);
    console.log(`   - ${skipped} exercices ignorés (déjà existants)`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

