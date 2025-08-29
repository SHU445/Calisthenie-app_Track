const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/calisthenie-tracker';

async function checkDuplicateWorkouts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('🔍 Vérification des entraînements dupliqués...\n');
    
    // Récupérer tous les entraînements
    const workouts = await db.collection('workouts').find({}).toArray();
    
    console.log(`📊 Total des entraînements: ${workouts.length}`);
    
    // Grouper par userId puis vérifier les doublons d'ID
    const userWorkouts = {};
    const duplicateIds = {};
    
    workouts.forEach(workout => {
      const userId = workout.userId;
      const workoutId = workout.id || workout._id.toString();
      
      if (!userWorkouts[userId]) {
        userWorkouts[userId] = [];
      }
      
      userWorkouts[userId].push({
        id: workoutId,
        mongoId: workout._id.toString(),
        nom: workout.nom,
        date: workout.date
      });
    });
    
    // Vérifier les doublons par utilisateur
    for (const [userId, workoutList] of Object.entries(userWorkouts)) {
      console.log(`\n👤 Utilisateur: ${userId} (${workoutList.length} entraînements)`);
      
      const idCounts = {};
      workoutList.forEach(workout => {
        const id = workout.id;
        if (!idCounts[id]) {
          idCounts[id] = [];
        }
        idCounts[id].push(workout);
      });
      
      // Afficher les doublons
      for (const [id, workouts] of Object.entries(idCounts)) {
        if (workouts.length > 1) {
          console.log(`  ❌ ID dupliqué "${id}" trouvé ${workouts.length} fois:`);
          workouts.forEach((w, i) => {
            console.log(`    ${i+1}. ${w.nom} (${w.date}) - MongoDB ID: ${w.mongoId}`);
          });
          duplicateIds[id] = workouts;
        }
      }
    }
    
    if (Object.keys(duplicateIds).length === 0) {
      console.log('\n✅ Aucun doublon d\'ID trouvé !');
    } else {
      console.log(`\n⚠️  ${Object.keys(duplicateIds).length} ID(s) dupliqué(s) trouvé(s) !`);
      console.log('\n💡 Solutions recommandées:');
      console.log('   1. Exécuter le script de correction des IDs');
      console.log('   2. Utiliser les MongoDB ObjectIds comme clés de sauvegarde');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await client.close();
  }
}

checkDuplicateWorkouts();
