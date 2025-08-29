#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Lancement des corrections d\'entraînements...\n');

async function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptName} s'est terminé avec le code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    console.log('1️⃣ Vérification des doublons...');
    await runScript('check-duplicate-workouts.js');
    
    console.log('\n2️⃣ Correction des IDs dupliqués...');
    await runScript('fix-duplicate-workout-ids.js');
    
    console.log('\n🎉 Toutes les corrections ont été appliquées avec succès !');
    console.log('\n📝 Résumé des corrections :');
    console.log('   ✅ Clés React rendues uniques');
    console.log('   ✅ API modifiée pour éviter les doublons futurs');
    console.log('   ✅ Base de données nettoyée');
    console.log('\n⚡ Redémarrez votre application pour voir les changements.');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'exécution des corrections:', error.message);
    process.exit(1);
  }
}

main();
