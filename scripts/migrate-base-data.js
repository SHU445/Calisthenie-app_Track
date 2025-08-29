const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'calisthenie_app';

async function main() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db(dbName);
    
    // 1. Créer l'utilisateur de démonstration
    const usersCollection = db.collection('users');
    
    // Vérifier si l'utilisateur demo existe déjà
    const existingDemoUser = await usersCollection.findOne({ username: 'demo' });
    
    if (!existingDemoUser) {
      const demoUser = {
        id: 'demo-user-id',
        username: 'demo',
        email: 'demo@calisthenie-tracker.com',
        password: 'demo123', // En production, il faudrait hasher le mot de passe
        dateCreation: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          units: 'metric',
          language: 'fr'
        }
      };
      
      await usersCollection.insertOne(demoUser);
      console.log('✅ Utilisateur de démonstration créé');
    } else {
      console.log('ℹ️  Utilisateur de démonstration déjà existant');
    }
    
    // 2. Importer les exercices de base
    const exercisesCollection = db.collection('exercises');
    
    // Lire le fichier JSON des exercices
    const exercisesPath = path.join(__dirname, '..', 'src', 'data', 'liste_exercices.json');
    const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
    
    console.log(`📋 ${exercisesData.length} exercices trouvés dans le fichier JSON`);
    
    // Vérifier combien d'exercices de base existent déjà
    const existingBaseExercises = await exercisesCollection.countDocuments({
      userId: { $exists: false }
    });
    
    if (existingBaseExercises === 0) {
      // Insérer tous les exercices de base (sans userId)
      await exercisesCollection.insertMany(exercisesData);
      console.log(`✅ ${exercisesData.length} exercices de base importés`);
    } else {
      console.log(`ℹ️  ${existingBaseExercises} exercices de base déjà existants`);
    }
    
    // 3. Afficher un résumé
    const totalUsers = await usersCollection.countDocuments();
    const totalBaseExercises = await exercisesCollection.countDocuments({
      userId: { $exists: false }
    });
    const totalPersonalExercises = await exercisesCollection.countDocuments({
      userId: { $exists: true }
    });
    const totalWorkouts = await db.collection('workouts').countDocuments();
    
    console.log('\n📊 Résumé de la base de données :');
    console.log(`   👥 Utilisateurs: ${totalUsers}`);
    console.log(`   🏋️  Exercices de base: ${totalBaseExercises}`);
    console.log(`   💪 Exercices personnalisés: ${totalPersonalExercises}`);
    console.log(`   📅 Entraînements: ${totalWorkouts}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n✅ Migration terminée');
  }
}

main().catch(console.error);
