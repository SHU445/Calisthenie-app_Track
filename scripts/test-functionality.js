const { performance } = require('perf_hooks');

// Configuration de base
const BASE_URL = 'http://localhost:3000';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

// Données de test
const testExercise = {
  nom: 'Test Push-up',
  categorie: 'Poussée',
  difficulte: 'Débutant',
  description: 'Exercice de test pour les pompes',
  points: 10,
  muscles: ['Pectoraux', 'Triceps'],
  progression: []
};

const testWorkout = {
  nom: 'Test Workout',
  date: new Date().toISOString().split('T')[0],
  type: 'Force',
  duree: 30,
  description: 'Entraînement de test',
  userId: 'test-user-123',
  sets: [],
  ressenti: 4,
  caloriesBrulees: 200
};

let createdExerciseId = null;
let createdWorkoutId = null;

// Fonction helper pour les requêtes API
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

// Tests pour les exercices
async function testExercisesCRUD() {
  log.info('🏋️ Tests des exercices CRUD');
  
  // Test POST - Créer un exercice
  try {
    const createResult = await apiRequest('/api/exercises', {
      method: 'POST',
      body: JSON.stringify(testExercise)
    });
    
    if (createResult.ok) {
      createdExerciseId = createResult.data.id;
      log.success(`Exercice créé avec l'ID: ${createdExerciseId}`);
    } else {
      log.error(`Échec création exercice: ${createResult.data.error}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur création exercice: ${error.message}`);
    return false;
  }
  
  // Test GET - Récupérer tous les exercices
  try {
    const getAllResult = await apiRequest('/api/exercises');
    if (getAllResult.ok && Array.isArray(getAllResult.data)) {
      log.success(`Liste des exercices récupérée (${getAllResult.data.length} exercices)`);
    } else {
      log.error('Échec récupération liste exercices');
    }
  } catch (error) {
    log.error(`Erreur récupération exercices: ${error.message}`);
  }
  
  // Test GET - Récupérer un exercice spécifique
  try {
    const getOneResult = await apiRequest(`/api/exercises/${createdExerciseId}`);
    if (getOneResult.ok) {
      log.success(`Exercice spécifique récupéré: ${getOneResult.data.nom}`);
    } else {
      log.error(`Échec récupération exercice: ${getOneResult.data.error}`);
    }
  } catch (error) {
    log.error(`Erreur récupération exercice: ${error.message}`);
  }
  
  // Test PUT - Modifier l'exercice
  try {
    const updateData = { nom: 'Test Push-up Modifié', difficulte: 'Intermédiaire' };
    const updateResult = await apiRequest(`/api/exercises/${createdExerciseId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    
    if (updateResult.ok) {
      log.success(`Exercice modifié: ${updateResult.data.nom}`);
    } else {
      log.error(`Échec modification exercice: ${updateResult.data.error}`);
    }
  } catch (error) {
    log.error(`Erreur modification exercice: ${error.message}`);
  }
  
  // Test DELETE - Supprimer l'exercice
  try {
    const deleteResult = await apiRequest(`/api/exercises/${createdExerciseId}`, {
      method: 'DELETE'
    });
    
    if (deleteResult.ok) {
      log.success('Exercice supprimé avec succès');
      return true;
    } else {
      log.error(`Échec suppression exercice: ${deleteResult.data.error}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur suppression exercice: ${error.message}`);
    return false;
  }
}

// Tests pour les entraînements
async function testWorkoutsCRUD() {
  log.info('💪 Tests des entraînements CRUD');
  
  // Test POST - Créer un entraînement
  try {
    const createResult = await apiRequest('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(testWorkout)
    });
    
    if (createResult.ok) {
      createdWorkoutId = createResult.data.id;
      log.success(`Entraînement créé avec l'ID: ${createdWorkoutId}`);
    } else {
      log.error(`Échec création entraînement: ${createResult.data.error}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur création entraînement: ${error.message}`);
    return false;
  }
  
  // Test GET - Récupérer les entraînements d'un utilisateur
  try {
    const getAllResult = await apiRequest(`/api/workouts?userId=${testWorkout.userId}`);
    if (getAllResult.ok && Array.isArray(getAllResult.data)) {
      log.success(`Liste des entraînements récupérée (${getAllResult.data.length} entraînements)`);
    } else {
      log.error('Échec récupération liste entraînements');
    }
  } catch (error) {
    log.error(`Erreur récupération entraînements: ${error.message}`);
  }
  
  // Test GET - Récupérer un entraînement spécifique
  try {
    const getOneResult = await apiRequest(`/api/workouts/${createdWorkoutId}`);
    if (getOneResult.ok) {
      log.success(`Entraînement spécifique récupéré: ${getOneResult.data.nom}`);
    } else {
      log.error(`Échec récupération entraînement: ${getOneResult.data.error}`);
    }
  } catch (error) {
    log.error(`Erreur récupération entraînement: ${error.message}`);
  }
  
  // Test PUT - Modifier l'entraînement
  try {
    const updateData = { nom: 'Test Workout Modifié', duree: 45 };
    const updateResult = await apiRequest(`/api/workouts/${createdWorkoutId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    
    if (updateResult.ok) {
      log.success(`Entraînement modifié: ${updateResult.data.nom}`);
    } else {
      log.error(`Échec modification entraînement: ${updateResult.data.error}`);
    }
  } catch (error) {
    log.error(`Erreur modification entraînement: ${error.message}`);
  }
  
  // Test DELETE - Supprimer l'entraînement
  try {
    const deleteResult = await apiRequest(`/api/workouts/${createdWorkoutId}`, {
      method: 'DELETE'
    });
    
    if (deleteResult.ok) {
      log.success('Entraînement supprimé avec succès');
      return true;
    } else {
      log.error(`Échec suppression entraînement: ${deleteResult.data.error}`);
      return false;
    }
  } catch (error) {
    log.error(`Erreur suppression entraînement: ${error.message}`);
    return false;
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Début des tests d\'intégrité des fonctionnalités\n');
  
  const startTime = performance.now();
  
  try {
    // Tester les exercices
    const exercisesSuccess = await testExercisesCRUD();
    console.log('');
    
    // Tester les entraînements
    const workoutsSuccess = await testWorkoutsCRUD();
    console.log('');
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Résumé
    if (exercisesSuccess && workoutsSuccess) {
      log.success(`🎉 Tous les tests sont passés avec succès ! (${duration}s)`);
    } else {
      log.warning(`⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus. (${duration}s)`);
      
      if (!exercisesSuccess) {
        log.error('- Problèmes détectés avec les exercices');
      }
      if (!workoutsSuccess) {
        log.error('- Problèmes détectés avec les entraînements');
      }
    }
    
  } catch (error) {
    log.error(`Erreur générale lors des tests: ${error.message}`);
  }
}

// Vérification si le serveur est accessible
async function checkServerStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/exercises`);
    if (!response.ok) {
      log.warning('Le serveur semble ne pas répondre correctement');
      log.info('Assurez-vous que le serveur Next.js est en cours d\'exécution (npm run dev)');
      process.exit(1);
    }
    log.success('Serveur accessible');
  } catch (error) {
    log.error('Impossible de se connecter au serveur');
    log.info('Veuillez démarrer le serveur avec: npm run dev');
    process.exit(1);
  }
}

// Exécution
async function main() {
  await checkServerStatus();
  await runTests();
}

main();
