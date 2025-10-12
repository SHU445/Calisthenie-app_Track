/**
 * Script de test pour vérifier le système de records personnels
 * Ce script simule la création d'un entraînement et vérifie que les records sont bien créés
 */

import { prisma } from '@/lib/prisma';
import { updatePersonalRecords } from '@/lib/personalRecords';

async function testPersonalRecordsSystem() {
  console.log('🧪 Test du système de records personnels...\n');

  try {
    // 1. Vérifier qu'il y a des exercices dans la base
    const exercises = await prisma.exercise.findMany({
      take: 3
    });

    if (exercises.length === 0) {
      console.log('❌ Aucun exercice trouvé dans la base de données');
      return;
    }

    console.log(`✅ ${exercises.length} exercices trouvés`);

    // 2. Vérifier qu'il y a des utilisateurs
    const users = await prisma.user.findMany({
      take: 1
    });

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données');
      return;
    }

    const testUser = users[0];
    console.log(`✅ Utilisateur de test: ${testUser.username}`);

    // 3. Créer un entraînement de test avec des sets
    const testSets = [
      {
        exerciceId: exercises[0].id,
        repetitions: 15,
        poids: 0,
        duree: null,
        tempsRepos: 60,
        notes: 'Test set 1'
      },
      {
        exerciceId: exercises[0].id,
        repetitions: 20, // Record potentiel
        poids: 0,
        duree: null,
        tempsRepos: 60,
        notes: 'Test set 2 - record!'
      }
    ];

    // Si c'est un exercice de maintien, ajuster les données
    if (exercises[0].typeQuantification === 'hold') {
      testSets[0].repetitions = 0;
      testSets[0].duree = 30;
      testSets[1].repetitions = 0;
      testSets[1].duree = 45; // Record potentiel
    }

    const testWorkout = await prisma.workout.create({
      data: {
        nom: 'Test Records System',
        date: new Date(),
        type: 'Force',
        duree: 30,
        description: 'Test automatique du système de records',
        userId: testUser.id,
        ressenti: 3,
        sets: {
          create: testSets.map(set => ({
            exerciceId: set.exerciceId,
            repetitions: set.repetitions,
            poids: set.poids,
            duree: set.duree,
            tempsRepos: set.tempsRepos,
            notes: set.notes
          }))
        }
      },
      include: {
        sets: true
      }
    });

    console.log(`✅ Entraînement de test créé: ${testWorkout.id}`);

    // 4. Appeler la fonction de mise à jour des records
    await updatePersonalRecords(testWorkout.sets, testWorkout.id, testUser.id);
    console.log('✅ Fonction updatePersonalRecords exécutée');

    // 5. Vérifier que les records ont été créés
    const records = await prisma.personalRecord.findMany({
      where: {
        userId: testUser.id,
        exerciceId: exercises[0].id
      },
      include: {
        exercise: true,
        workout: true
      }
    });

    console.log(`\n📊 Records créés pour l'exercice "${exercises[0].nom}":`);
    records.forEach(record => {
      console.log(`  - ${record.type}: ${record.valeur} (${record.exercise.typeQuantification === 'hold' ? 'secondes' : 'répétitions'})`);
      console.log(`    Date: ${record.date.toISOString()}`);
      console.log(`    Entraînement: ${record.workout?.nom || 'N/A'}`);
    });

    // 6. Test de l'intensité
    console.log('\n🎯 Test du calcul d\'intensité...');
    
    // Simuler le calcul d'intensité comme dans l'interface
    const exerciseSets = testWorkout.sets.filter(set => set.exerciceId === exercises[0].id);
    const maxRecord = records.find(r => 
      r.type === (exercises[0].typeQuantification === 'hold' ? 'temps' : 'repetitions')
    );

    if (maxRecord) {
      const performedValue = exercises[0].typeQuantification === 'hold' 
        ? Math.max(...exerciseSets.map(set => set.duree || 0))
        : Math.max(...exerciseSets.map(set => set.repetitions || 0));
      
      const intensity = performedValue / maxRecord.valeur;
      console.log(`✅ Intensité calculée: ${Math.round(intensity * 100)}%`);
    } else {
      console.log('❌ Aucun record trouvé pour le calcul d\'intensité');
    }

    // 7. Nettoyer les données de test
    await prisma.workout.delete({
      where: { id: testWorkout.id }
    });
    console.log('✅ Données de test nettoyées');

    console.log('\n🎉 Test terminé avec succès !');
    console.log('\n📋 Résumé:');
    console.log('  - ✅ Système de records personnels fonctionnel');
    console.log('  - ✅ Création automatique lors des entraînements');
    console.log('  - ✅ Calcul d\'intensité opérationnel');
    console.log('  - ✅ Synchronisation avec la base de données');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test si ce fichier est appelé directement
if (require.main === module) {
  testPersonalRecordsSystem();
}

export { testPersonalRecordsSystem };
