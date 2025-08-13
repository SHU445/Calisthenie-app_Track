const fetch = require('node-fetch');

async function testAddExercise() {
  try {
    console.log('🧪 Test de l\'ajout d\'exercice avec MongoDB...');
    
    const response = await fetch('http://localhost:3000/api/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: 'Test MongoDB',
        categorie: 'Haut du corps',
        difficulte: 'F',
        muscles: ['Pectoraux'],
        description: 'Test de l\'ajout avec MongoDB',
        typeQuantification: 'rep'
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Exercice ajouté avec succès !');
      console.log('📋 Détails:', result);
    } else {
      console.log('❌ Erreur lors de l\'ajout:', result);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

async function testGetExercises() {
  try {
    console.log('\n🧪 Test de récupération des exercices...');
    
    const response = await fetch('http://localhost:3000/api/exercises');
    const exercises = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${exercises.length} exercices récupérés avec succès !`);
      console.log('📋 Derniers exercices ajoutés:');
      exercises.slice(-3).forEach(ex => console.log(`   - ${ex.nom} (${ex.categorie})`));
    } else {
      console.log('❌ Erreur lors de la récupération:', exercises);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

// Attendre que le serveur soit prêt
setTimeout(async () => {
  await testGetExercises();
  await testAddExercise();
  await testGetExercises();
}, 3000);
