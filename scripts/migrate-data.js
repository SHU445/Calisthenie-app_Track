const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'calisthenie_app';

async function migrateData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('🔗 Connexion à MongoDB établie');
    
    const db = client.db(dbName);
    
    // Migration des exercices
    const exercisesPath = path.join(__dirname, '../src/data/liste_exercices.json');
    if (fs.existsSync(exercisesPath)) {
      console.log('📋 Migration des exercices...');
      const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
      
      // Supprimer les données existantes
      await db.collection('exercises').deleteMany({});
      
      if (exercisesData.length > 0) {
        await db.collection('exercises').insertMany(exercisesData);
        console.log(`✅ ${exercisesData.length} exercices migrés`);
      }
    }
    
    // Migration des entraînements
    const workoutsPath = path.join(__dirname, '../src/data/workouts.json');
    if (fs.existsSync(workoutsPath)) {
      console.log('🏋️ Migration des entraînements...');
      const workoutsData = JSON.parse(fs.readFileSync(workoutsPath, 'utf8'));
      
      // Supprimer les données existantes
      await db.collection('workouts').deleteMany({});
      
      if (workoutsData.length > 0) {
        await db.collection('workouts').insertMany(workoutsData);
        console.log(`✅ ${workoutsData.length} entraînements migrés`);
      }
    }
    
    console.log('🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await client.close();
  }
}

migrateData();
