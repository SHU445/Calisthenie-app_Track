const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb://localhost:27017';
const dbName = 'calisthenie_app';

async function migrateData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 Connexion à MongoDB réussie');
    
    const db = client.db(dbName);
    
    // Lire les données existantes
    const exercisesPath = path.join(__dirname, '../src/data/liste_exercices.json');
    const workoutsPath = path.join(__dirname, '../src/data/workouts.json');
    
    // Migrer les exercices
    if (fs.existsSync(exercisesPath)) {
      const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
      
      // Supprimer la collection existante si elle existe
      await db.collection('exercises').deleteMany({});
      
      // Insérer les données
      if (exercisesData.length > 0) {
        await db.collection('exercises').insertMany(exercisesData);
        console.log(`✅ ${exercisesData.length} exercices migrés avec succès`);
      }
    }
    
    // Migrer les workouts
    if (fs.existsSync(workoutsPath)) {
      const workoutsData = JSON.parse(fs.readFileSync(workoutsPath, 'utf8'));
      
      // Supprimer la collection existante si elle existe
      await db.collection('workouts').deleteMany({});
      
      // Insérer les données
      if (workoutsData.length > 0) {
        await db.collection('workouts').insertMany(workoutsData);
        console.log(`✅ ${workoutsData.length} workouts migrés avec succès`);
      } else {
        console.log('📝 Aucun workout à migrer (fichier vide)');
      }
    }
    
    // Créer des index pour optimiser les performances
    await db.collection('exercises').createIndex({ nom: 1 }, { unique: true });
    await db.collection('exercises').createIndex({ categorie: 1 });
    await db.collection('exercises').createIndex({ difficulte: 1 });
    
    await db.collection('workouts').createIndex({ userId: 1 });
    await db.collection('workouts').createIndex({ date: -1 });
    
    console.log('🏗️ Index créés avec succès');
    
    // Afficher les statistiques
    const exerciseCount = await db.collection('exercises').countDocuments();
    const workoutCount = await db.collection('workouts').countDocuments();
    
    console.log('\n📊 Statistiques de migration :');
    console.log(`   - Exercices : ${exerciseCount}`);
    console.log(`   - Workouts : ${workoutCount}`);
    console.log('\n🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error);
  } finally {
    await client.close();
  }
}

migrateData();
