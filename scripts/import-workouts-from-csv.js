/**
 * Script pour importer les entraînements depuis un fichier CSV vers Prisma
 * 
 * Ce script importe les entraînements depuis calisthenie_app.workouts.csv dans la base de données Neon.
 * Il importe uniquement les entraînements avec userId = "NaN" et les assigne à l'utilisateur spécifié.
 * 
 * Utilisation:
 * node scripts/import-workouts-from-csv.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// ID de l'utilisateur cible
const TARGET_USER_ID = 'cmgc4486y0001uq9wz13jzioc';

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
 * Crée une correspondance entre les anciens IDs MongoDB et les nouveaux IDs Prisma
 */
async function createExerciseIdMapping() {
  console.log('📋 Création de la correspondance des IDs d\'exercices...\n');
  
  // Récupérer tous les exercices de base (ceux importés depuis le CSV exercises)
  const exercises = await prisma.exercise.findMany({
    where: { userId: null }
  });
  
  const mapping = new Map();
  
  // Les anciens IDs MongoDB des exercices sont ceux qu'on trouve dans le CSV
  // On va créer une correspondance basée sur le nom de l'exercice
  for (const exercise of exercises) {
    mapping.set(exercise.nom.toLowerCase(), exercise.id);
  }
  
  // Pour les IDs spécifiques trouvés dans le CSV, on crée aussi une correspondance directe
  // Ces IDs proviennent des exercices importés qui avaient ces IDs MongoDB
  const exercisesByOldId = await prisma.$queryRaw`
    SELECT id, nom FROM "exercises" WHERE "userId" IS NULL
  `;
  
  return { mapping, exercises };
}

/**
 * Trouve l'ID Prisma d'un exercice à partir de son ancien ID MongoDB
 */
async function findExerciseIdByOldId(oldId, exercisesData) {
  if (!oldId || oldId === '' || oldId === 'NaN') return null;
  
  // Liste des correspondances connues entre anciens IDs et noms
  const knownMappings = {
    '689b1c81c5d142fe1778504f': 'Pompes',
    '689b1c81c5d142fe17785050': 'Rowing inversé',
    '689b1c81c5d142fe17785051': 'Tractions',
    '689b1c81c5d142fe17785052': 'Dips',
    '689b1c81c5d142fe17785053': 'Elbow lever',
    '689b1c81c5d142fe17785054': 'L-sit',
    '689b1c81c5d142fe17785055': 'Frogstand',
    '689b1c81c5d142fe17785056': 'Pike push-up',
    '689b1c81c5d142fe17785057': 'Tuck front lever',
    '689b1c81c5d142fe17785058': 'Handstand',
    '689b1c81c5d142fe17785059': 'Tuck planche',
    '689b1c81c5d142fe1778505a': 'Handstand push-up',
    '689b1c81c5d142fe1778505b': 'Advanced tuck planche',
    '689b1c81c5d142fe1778505c': 'Advanced tuck front lever',
    '689b1c81c5d142fe1778505d': 'Muscle-up',
    '689b1c81c5d142fe1778505e': 'V-sit',
    '689b1c81c5d142fe1778505f': 'One-arm push-up',
    '689b1c81c5d142fe17785060': 'Straddle planche',
    '689b1c81c5d142fe17785061': 'Straddle front lever',
    '689b1c81c5d142fe17785062': 'Front lever',
    '689b1c81c5d142fe17785063': '90° push-up',
    '689b1c81c5d142fe17785064': 'One-arm pull-up',
    '689b1c81c5d142fe17785065': 'Manna',
    '689b1c81c5d142fe17785066': 'Full planche',
    '689b1c81c5d142fe17785067': 'Touch front lever',
    '689b1c81c5d142fe17785068': 'Dragon planche',
    '689b1c81c5d142fe17785069': 'Maltese',
    '689b1c81c5d142fe1778506a': 'Full planche push-up',
    '689b1c81c5d142fe1778506b': 'Croix de Fer',
    '689b1c81c5d142fe1778506c': 'Back lever',
    '689b1c81c5d142fe1778506d': 'Straddle Back lever',
    '689b1c81c5d142fe1778506e': 'Tirage aux anneaux',
    '68a100cdf6bb97bd64200e95': 'Wall handstand push up',
    '68ad976b9319c9a8403cb5de': 'Pompes Archer',
    '68addc5d9319c9a8403cb5ec': 'Dips on the bar',
    '68addc859319c9a8403cb5ed': 'Hollow body',
    '68addca79319c9a8403cb5ee': 'Pseudo pompes',
    '68addce99319c9a8403cb5ef': 'Tractions explosives',
    '68addda69319c9a8403cb5f1': 'Korean dips',
    '68addf579319c9a8403cb5f7': 'Russian twist',
  };
  
  const exerciseName = knownMappings[oldId];
  if (!exerciseName) {
    console.log(`  ⚠️  ID inconnu: ${oldId}`);
    return null;
  }
  
  const exercise = exercisesData.exercises.find(
    ex => ex.nom.toLowerCase() === exerciseName.toLowerCase()
  );
  
  return exercise ? exercise.id : null;
}

/**
 * Parse les sets d'un workout depuis les colonnes CSV
 */
function parseSets(row, headers) {
  const sets = [];
  const maxSets = 22; // Maximum de sets possibles selon le CSV
  
  for (let i = 0; i < maxSets; i++) {
    const exerciceIdIndex = headers.indexOf(`sets[${i}].exerciceId`);
    const repetitionsIndex = headers.indexOf(`sets[${i}].repetitions`);
    const poidsIndex = headers.indexOf(`sets[${i}].poids`);
    const tempsReposIndex = headers.indexOf(`sets[${i}].tempsRepos`);
    const dureeIndex = headers.indexOf(`sets[${i}].duree`);
    
    if (exerciceIdIndex === -1) continue;
    
    const exerciceId = row[exerciceIdIndex]?.trim();
    const repetitions = row[repetitionsIndex]?.trim();
    const poids = row[poidsIndex]?.trim();
    const tempsRepos = row[tempsReposIndex]?.trim();
    const duree = row[dureeIndex]?.trim();
    
    // Si l'exerciceId existe et n'est pas vide
    if (exerciceId && exerciceId !== '' && exerciceId !== 'NaN') {
      sets.push({
        oldExerciceId: exerciceId,
        repetitions: repetitions && repetitions !== '' ? parseInt(repetitions) : 0,
        poids: poids && poids !== '' && poids !== 'NaN' ? parseFloat(poids) : null,
        tempsRepos: tempsRepos && tempsRepos !== '' ? parseInt(tempsRepos) : 60,
        duree: duree && duree !== '' ? parseInt(duree) : null,
      });
    }
  }
  
  return sets;
}

/**
 * Importer les workouts depuis le CSV
 */
async function importWorkouts() {
  try {
    console.log('📦 Chargement du fichier CSV des workouts...\n');
    
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: TARGET_USER_ID }
    });
    
    if (!user) {
      console.error(`❌ Utilisateur avec l'ID ${TARGET_USER_ID} introuvable!`);
      console.log('\n💡 Astuce: Créez d\'abord un compte utilisateur ou utilisez un ID existant.');
      return;
    }
    
    console.log(`✓ Utilisateur trouvé: ${user.username}\n`);
    
    // Créer la correspondance des IDs d'exercices
    const exercisesData = await createExerciseIdMapping();
    console.log(`✓ ${exercisesData.exercises.length} exercices disponibles\n`);
    
    // Lire le fichier CSV
    const csvPath = path.join(__dirname, '..', 'Import_csv', 'calisthenie_app.workouts.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    // Parser l'en-tête
    const headers = parseCSVLine(lines[0]);
    console.log(`📋 ${lines.length - 1} entraînements trouvés dans le fichier CSV\n`);
    
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    // Parser chaque ligne (sauf l'en-tête)
    for (let i = 1; i < lines.length; i++) {
      try {
        const row = parseCSVLine(lines[i]);
        
        // Extraire les données du workout
        const userIdIndex = headers.indexOf('userId');
        const userId = row[userIdIndex]?.trim();
        
        // Filtrer uniquement les workouts avec userId = "NaN"
        if (userId !== 'NaN') {
          skipped++;
          continue;
        }
        
        const nomIndex = headers.indexOf('nom');
        const dateIndex = headers.indexOf('date');
        const typeIndex = headers.indexOf('type');
        const dureeIndex = headers.indexOf('duree');
        const descriptionIndex = headers.indexOf('description');
        const ressentiIndex = headers.indexOf('ressenti');
        const caloriesBruleesIndex = headers.indexOf('caloriesBrulees');
        
        const nom = row[nomIndex]?.trim();
        const date = row[dateIndex]?.trim();
        const type = row[typeIndex]?.trim();
        const duree = row[dureeIndex]?.trim();
        const description = row[descriptionIndex]?.trim();
        const ressenti = row[ressentiIndex]?.trim();
        const caloriesBrulees = row[caloriesBruleesIndex]?.trim();
        
        // Vérifier les champs requis
        if (!nom || !date || !type) {
          console.log(`  ⚠️  Workout incomplet à la ligne ${i + 1}, ignoré`);
          skipped++;
          continue;
        }
        
        // Parser les sets
        const sets = parseSets(row, headers);
        
        if (sets.length === 0) {
          console.log(`  ⚠️  Workout "${nom}" sans sets, ignoré`);
          skipped++;
          continue;
        }
        
        // Mapper les exerciceId
        const mappedSets = [];
        for (const set of sets) {
          const newExerciceId = await findExerciseIdByOldId(set.oldExerciceId, exercisesData);
          if (newExerciceId) {
            mappedSets.push({
              exerciceId: newExerciceId,
              repetitions: set.repetitions,
              poids: set.poids,
              tempsRepos: set.tempsRepos,
              duree: set.duree,
            });
          } else {
            console.log(`  ⚠️  Exercice non trouvé pour l'ID ${set.oldExerciceId}`);
          }
        }
        
        if (mappedSets.length === 0) {
          console.log(`  ⚠️  Workout "${nom}" sans sets valides, ignoré`);
          skipped++;
          continue;
        }
        
        // Créer le workout avec ses sets
        const workout = await prisma.workout.create({
          data: {
            nom: nom,
            date: new Date(date),
            type: type,
            duree: duree ? parseInt(duree) : 0,
            description: description && description !== '' ? description : null,
            ressenti: ressenti && ressenti !== '' ? parseInt(ressenti) : 3,
            caloriesBrulees: caloriesBrulees && caloriesBrulees !== '' ? parseInt(caloriesBrulees) : null,
            userId: TARGET_USER_ID,
            sets: {
              create: mappedSets
            }
          },
          include: {
            sets: true
          }
        });
        
        created++;
        console.log(`  ✓ Workout créé: "${nom}" (${new Date(date).toLocaleDateString()}) - ${mappedSets.length} sets`);
        
      } catch (error) {
        errors++;
        console.error(`  ✗ Erreur à la ligne ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n✅ Importation terminée !');
    console.log(`   - ${created} entraînements créés`);
    console.log(`   - ${skipped} entraînements ignorés (userId différent de "NaN" ou incomplets)`);
    if (errors > 0) {
      console.log(`   - ${errors} erreurs rencontrées`);
    }
    
    // Afficher le total d'entraînements de l'utilisateur
    const totalWorkouts = await prisma.workout.count({
      where: { userId: TARGET_USER_ID }
    });
    console.log(`\n📊 Total d'entraînements pour l'utilisateur: ${totalWorkouts}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'importation
importWorkouts();

