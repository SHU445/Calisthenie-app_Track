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

// Fonction helper pour les requêtes API
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  
  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

// Test spécifique de la modification d'entraînements
async function testWorkoutUpdateFix() {
  log.info('🧪 Test de correction de la modification d\'entraînements');
  
  // Créer d'abord un entraînement de test
  const testWorkout = {
    nom: 'Test Update Fix',
    date: new Date().toISOString().split('T')[0],
    type: 'Force',
    duree: 45,
    description: 'Entraînement pour tester la modification',
    userId: 'test-user-workout-fix',
    sets: [],
    ressenti: 3
  };
  
  let workoutId = null;
  
  try {
    // Étape 1: Créer un entraînement
    log.info('Création d\'un entraînement de test...');
    const createResult = await apiRequest('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(testWorkout)
    });
    
    if (!createResult.ok) {
      log.error(`Échec création: ${createResult.data?.error || 'Erreur inconnue'}`);
      return false;
    }
    
    workoutId = createResult.data.id;
    log.success(`Entraînement créé avec ID: ${workoutId}`);
    
    // Étape 2: Vérifier que l'entraînement existe
    log.info('Vérification de l\'existence de l\'entraînement...');
    const getResult = await apiRequest(`/api/workouts/${workoutId}`);
    
    if (!getResult.ok) {
      log.error(`Entraînement non trouvé après création: ${getResult.status}`);
      return false;
    }
    
    log.success(`Entraînement trouvé: ${getResult.data.nom}`);
    
    // Étape 3: Tenter la modification
    log.info('Tentative de modification...');
    const updateData = {
      nom: 'Test Update Fix - Modifié',
      duree: 60,
      description: 'Description modifiée'
    };
    
    const updateResult = await apiRequest(`/api/workouts/${workoutId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    
    if (!updateResult.ok) {
      log.error(`Échec modification: ${updateResult.status} - ${updateResult.data?.error || 'Erreur inconnue'}`);
      return false;
    }
    
    log.success('Entraînement modifié avec succès !');
    
    // Étape 4: Vérifier que les modifications ont été appliquées
    log.info('Vérification des modifications...');
    const verifyResult = await apiRequest(`/api/workouts/${workoutId}`);
    
    if (!verifyResult.ok) {
      log.error('Impossible de vérifier les modifications');
      return false;
    }
    
    const modifiedWorkout = verifyResult.data;
    if (modifiedWorkout.nom === updateData.nom && 
        modifiedWorkout.duree === updateData.duree &&
        modifiedWorkout.description === updateData.description) {
      log.success('Modifications vérifiées avec succès !');
    } else {
      log.error('Les modifications n\'ont pas été appliquées correctement');
      return false;
    }
    
    // Étape 5: Nettoyer (supprimer l'entraînement de test)
    log.info('Nettoyage...');
    const deleteResult = await apiRequest(`/api/workouts/${workoutId}`, {
      method: 'DELETE'
    });
    
    if (deleteResult.ok) {
      log.success('Entraînement de test supprimé');
    }
    
    return true;
    
  } catch (error) {
    log.error(`Erreur lors du test: ${error.message}`);
    return false;
  }
}

// Test avec un entraînement existant (avec ObjectId)
async function testExistingWorkoutUpdate() {
  log.info('🔍 Test de modification d\'entraînement existant');
  
  try {
    // Récupérer tous les entraînements d'un utilisateur test
    const getAllResult = await apiRequest('/api/workouts?userId=test-user-123');
    
    if (!getAllResult.ok) {
      log.warning('Impossible de récupérer les entraînements existants');
      return true; // Pas d'erreur si pas d'entraînements
    }
    
    const workouts = getAllResult.data;
    
    if (!Array.isArray(workouts) || workouts.length === 0) {
      log.warning('Aucun entraînement existant trouvé');
      return true;
    }
    
    // Prendre le premier entraînement
    const workoutToUpdate = workouts[0];
    log.info(`Test avec entraînement existant: ${workoutToUpdate.nom} (ID: ${workoutToUpdate.id})`);
    
    // Données de modification légères
    const updateData = {
      description: 'Description mise à jour par test de correction'
    };
    
    // Tenter la modification
    const updateResult = await apiRequest(`/api/workouts/${workoutToUpdate.id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    
    if (!updateResult.ok) {
      log.error(`Échec modification entraînement existant: ${updateResult.status} - ${updateResult.data?.error || 'Erreur inconnue'}`);
      log.info(`ID utilisé: ${workoutToUpdate.id}`);
      log.info(`Type d'ID: ${typeof workoutToUpdate.id}`);
      log.info(`Longueur ID: ${workoutToUpdate.id.length}`);
      return false;
    }
    
    log.success('Entraînement existant modifié avec succès !');
    return true;
    
  } catch (error) {
    log.error(`Erreur lors du test d'entraînement existant: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function runWorkoutUpdateTests() {
  console.log('🚀 Tests de correction de la modification d\'entraînements\n');
  
  const startTime = performance.now();
  
  try {
    // Test 1: Créer et modifier un nouvel entraînement
    const newWorkoutTest = await testWorkoutUpdateFix();
    console.log('');
    
    // Test 2: Modifier un entraînement existant
    const existingWorkoutTest = await testExistingWorkoutUpdate();
    console.log('');
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Résumé
    if (newWorkoutTest && existingWorkoutTest) {
      log.success(`🎉 Tous les tests de modification sont passés ! (${duration}s)`);
      log.info('La correction de la modification fonctionne correctement.');
    } else {
      log.warning(`⚠️ Certains tests ont échoué. (${duration}s)`);
      
      if (!newWorkoutTest) {
        log.error('- Problème avec la modification de nouveaux entraînements');
      }
      if (!existingWorkoutTest) {
        log.error('- Problème avec la modification d\'entraînements existants');
      }
    }
    
  } catch (error) {
    log.error(`Erreur générale lors des tests: ${error.message}`);
  }
}

// Vérification si le serveur est accessible
async function checkServerStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/workouts?userId=test`);
    if (!response.ok && response.status !== 400) { // 400 est OK car on teste sans userId valide
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
  await runWorkoutUpdateTests();
}

main();
