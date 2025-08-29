const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/calisthenie-tracker';

async function fixDuplicateWorkoutIds() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('🔧 Correction des IDs d\'entraînements dupliqués...\n');
    
    // Récupérer tous les entraînements groupés par utilisateur
    const allWorkouts = await db.collection('workouts').find({}).toArray();
    const userWorkouts = {};
    
    // Grouper par utilisateur
    allWorkouts.forEach(workout => {
      const userId = workout.userId || 'unknown';
      if (!userWorkouts[userId]) {
        userWorkouts[userId] = [];
      }
      userWorkouts[userId].push(workout);
    });
    
    let totalFixed = 0;
    
    // Traiter chaque utilisateur
    for (const [userId, workouts] of Object.entries(userWorkouts)) {
      console.log(`\n👤 Traitement utilisateur: ${userId} (${workouts.length} entraînements)`);
      
      // Trier par date de création (ObjectId contient le timestamp)
      workouts.sort((a, b) => a._id.getTimestamp() - b._id.getTimestamp());
      
      // Réassigner les IDs séquentiellement
      for (let i = 0; i < workouts.length; i++) {
        const workout = workouts[i];
        const newId = (i + 1).toString();
        
        if (workout.id !== newId) {
          console.log(`  🔄 Mise à jour: "${workout.nom}" - ID: ${workout.id || 'undefined'} → ${newId}`);
          
          await db.collection('workouts').updateOne(
            { _id: workout._id },
            { $set: { id: newId } }
          );
          
          totalFixed++;
        }
      }
    }
    
    console.log(`\n✅ Correction terminée !`);
    console.log(`📊 Total d'entraînements mis à jour: ${totalFixed}`);
    
    // Vérification finale
    console.log('\n🔍 Vérification finale...');
    const verification = await db.collection('workouts').aggregate([
      {
        $group: {
          _id: { userId: '$userId', id: '$id' },
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();
    
    if (verification.length === 0) {
      console.log('✅ Aucun doublon détecté après correction !');
    } else {
      console.log(`❌ ${verification.length} doublon(s) encore présent(s) :`, verification);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await client.close();
  }
}

fixDuplicateWorkoutIds();
