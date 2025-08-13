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

// Test spécifique de la suppression d'exercices
async function testExerciseDeleteFix() {
  log.info('🧪 Test de correction de la suppression d\'exercices');
  
  // Créer d'abord un exercice de test
  const testExercise = {
    nom: 'Test Delete Fix',
    categorie: 'Haut du corps',
    difficulte: 'Débutant',
    description: 'Exercice pour tester la suppression',
    muscles: ['Pectoraux'],
    progression: []
  };
  
  let exerciseId = null;
  
  try {
    // Étape 1: Créer un exercice
    log.info('Création d\'un exercice de test...');
    const createResult = await apiRequest('/api/exercises', {
      method: 'POST',
      body: JSON.stringify(testExercise)
    });
    
    if (!createResult.ok) {
      log.error(`Échec création: ${createResult.data?.error || 'Erreur inconnue'}`);
      return false;
    }
    
    exerciseId = createResult.data.id;
    log.success(`Exercice créé avec ID: ${exerciseId}`);
    
    // Étape 2: Vérifier que l'exercice existe
    log.info('Vérification de l\'existence de l\'exercice...');
    const getResult = await apiRequest(`/api/exercises/${exerciseId}`);
    
    if (!getResult.ok) {
      log.error(`Exercice non trouvé après création: ${getResult.status}`);
      return false;
    }
    
    log.success(`Exercice trouvé: ${getResult.data.nom}`);
    
    // Étape 3: Tenter la suppression
    log.info('Tentative de suppression...');
    const deleteResult = await apiRequest(`/api/exercises/${exerciseId}`, {
      method: 'DELETE'
    });
    
    if (!deleteResult.ok) {
      log.error(`Échec suppression: ${deleteResult.status} - ${deleteResult.data?.error || 'Erreur inconnue'}`);
      return false;
    }
    
    log.success('Exercice supprimé avec succès !');
    
    // Étape 4: Vérifier que l'exercice n'existe plus
    log.info('Vérification de la suppression...');
    const verifyResult = await apiRequest(`/api/exercises/${exerciseId}`);
    
    if (verifyResult.ok) {
      log.error('L\'exercice existe encore après suppression !');
      return false;
    }
    
    if (verifyResult.status === 404) {
      log.success('Suppression confirmée : exercice non trouvé (404)');
      return true;
    } else {
      log.warning(`Statut inattendu lors de la vérification: ${verifyResult.status}`);
      return false;
    }
    
  } catch (error) {
    log.error(`Erreur lors du test: ${error.message}`);
    return false;
  }
}

// Test avec un exercice existant (avec ObjectId)
async function testExistingExerciseDelete() {
  log.info('🔍 Test de suppression d\'exercice existant');
  
  try {
    // Récupérer tous les exercices
    const getAllResult = await apiRequest('/api/exercises');
    
    if (!getAllResult.ok || !Array.isArray(getAllResult.data)) {
      log.error('Impossible de récupérer les exercices existants');
      return false;
    }
    
    const exercises = getAllResult.data;
    
    if (exercises.length === 0) {
      log.warning('Aucun exercice existant trouvé');
      return true;
    }
    
    // Prendre le premier exercice
    const exerciseToDelete = exercises[0];
    log.info(`Test avec exercice existant: ${exerciseToDelete.nom} (ID: ${exerciseToDelete.id})`);
    
    // Tenter la suppression
    const deleteResult = await apiRequest(`/api/exercises/${exerciseToDelete.id}`, {
      method: 'DELETE'
    });
    
    if (!deleteResult.ok) {
      log.error(`Échec suppression exercice existant: ${deleteResult.status} - ${deleteResult.data?.error || 'Erreur inconnue'}`);
      log.info(`ID utilisé: ${exerciseToDelete.id}`);
      log.info(`Type d'ID: ${typeof exerciseToDelete.id}`);
      log.info(`Longueur ID: ${exerciseToDelete.id.length}`);
      return false;
    }
    
    log.success('Exercice existant supprimé avec succès !');
    return true;
    
  } catch (error) {
    log.error(`Erreur lors du test d'exercice existant: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function runDeleteTests() {
  console.log('🚀 Tests de correction de la suppression d\'exercices\n');
  
  const startTime = performance.now();
  
  try {
    // Test 1: Créer et supprimer un nouvel exercice
    const newExerciseTest = await testExerciseDeleteFix();
    console.log('');
    
    // Test 2: Supprimer un exercice existant
    const existingExerciseTest = await testExistingExerciseDelete();
    console.log('');
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Résumé
    if (newExerciseTest && existingExerciseTest) {
      log.success(`🎉 Tous les tests de suppression sont passés ! (${duration}s)`);
      log.info('La correction de la suppression fonctionne correctement.');
    } else {
      log.warning(`⚠️ Certains tests ont échoué. (${duration}s)`);
      
      if (!newExerciseTest) {
        log.error('- Problème avec la suppression de nouveaux exercices');
      }
      if (!existingExerciseTest) {
        log.error('- Problème avec la suppression d\'exercices existants');
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
  await runDeleteTests();
}

main();
