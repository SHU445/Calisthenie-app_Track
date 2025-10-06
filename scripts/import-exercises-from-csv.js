/**
 * Script pour importer les exercices depuis un fichier CSV vers Prisma
 * 
 * Ce script importe les exercices depuis calisthenie_app.exercises.csv dans la base de données Neon.
 * Les exercices importés seront accessibles à tous les utilisateurs (userId = null).
 * 
 * Utilisation:
 * node scripts/import-exercises-from-csv.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * Parse une ligne CSV en tenant compte des guillemets
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

/**
 * Transforme les données CSV en format Exercise
 */
function transformCSVToExercise(row, headers) {
  const exercise = {};
  
  // Mapper les données de base
  headers.forEach((header, index) => {
    const value = row[index]?.trim();
    
    // Ignorer les colonnes _id et id (MongoDB), et userId
    if (header === '_id' || header === 'id' || header === 'userId') {
      return;
    }
    
    // Gestion des colonnes muscles[0], muscles[1], etc.
    if (header.startsWith('muscles[')) {
      if (!exercise.muscles) exercise.muscles = [];
      if (value && value !== '') {
        exercise.muscles.push(value);
      }
    }
    // Gestion des colonnes instructions[0], instructions[1], etc.
    else if (header.startsWith('instructions[')) {
      if (!exercise.instructions) exercise.instructions = [];
      if (value && value !== '') {
        exercise.instructions.push(value);
      }
    }
    // Colonnes simples
    else if (value && value !== '' && value !== 'NaN') {
      exercise[header] = value;
    }
  });
  
  return exercise;
}

async function importExercises() {
  try {
    console.log('📦 Chargement du fichier CSV...\n');
    
    // Lire le fichier CSV
    const csvPath = path.join(__dirname, '..', 'Import_csv', 'calisthenie_app.exercises.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    // Parser l'en-tête
    const headers = parseCSVLine(lines[0]);
    console.log(`📋 ${lines.length - 1} exercices trouvés dans le fichier CSV\n`);
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    // Parser chaque ligne (sauf l'en-tête)
    for (let i = 1; i < lines.length; i++) {
      try {
        const row = parseCSVLine(lines[i]);
        const exercise = transformCSVToExercise(row, headers);
        
        // Vérifier que l'exercice a les champs requis
        if (!exercise.nom || !exercise.categorie || !exercise.difficulte || !exercise.description) {
          console.log(`  ⚠️  Exercice incomplet à la ligne ${i + 1}, ignoré`);
          skipped++;
          continue;
        }
        
        // S'assurer que les tableaux existent
        if (!exercise.muscles) exercise.muscles = [];
        if (!exercise.instructions) exercise.instructions = [];
        if (!exercise.typeQuantification) exercise.typeQuantification = 'rep';
        
        // Vérifier si l'exercice existe déjà (exercice de base sans userId)
        const existingExercise = await prisma.exercise.findFirst({
          where: {
            nom: exercise.nom,
            userId: null
          }
        });

        if (!existingExercise) {
          // Créer le nouvel exercice
          await prisma.exercise.create({
            data: {
              nom: exercise.nom,
              categorie: exercise.categorie,
              difficulte: exercise.difficulte,
              muscles: exercise.muscles,
              description: exercise.description,
              instructions: exercise.instructions,
              typeQuantification: exercise.typeQuantification,
              userId: null // Exercice de base accessible à tous
            }
          });
          created++;
          console.log(`  ✓ Exercice créé: ${exercise.nom} (${exercise.difficulte})`);
        } else {
          // Mettre à jour l'exercice existant
          await prisma.exercise.update({
            where: { id: existingExercise.id },
            data: {
              categorie: exercise.categorie,
              difficulte: exercise.difficulte,
              muscles: exercise.muscles,
              description: exercise.description,
              instructions: exercise.instructions,
              typeQuantification: exercise.typeQuantification,
            }
          });
          updated++;
          console.log(`  ⟳ Exercice mis à jour: ${exercise.nom} (${exercise.difficulte})`);
        }
      } catch (error) {
        errors++;
        console.error(`  ✗ Erreur à la ligne ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n✅ Importation terminée !');
    console.log(`   - ${created} exercices créés`);
    console.log(`   - ${updated} exercices mis à jour`);
    console.log(`   - ${skipped} exercices ignorés (incomplets)`);
    if (errors > 0) {
      console.log(`   - ${errors} erreurs rencontrées`);
    }
    
    // Afficher le total d'exercices de base
    const totalBaseExercises = await prisma.exercise.count({
      where: { userId: null }
    });
    console.log(`\n📊 Total d'exercices de base dans la BD: ${totalBaseExercises}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'importation
importExercises();

