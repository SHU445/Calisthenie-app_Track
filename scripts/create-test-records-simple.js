/**
 * Script simple pour créer des records de test
 * Utilise directement Prisma sans les imports TypeScript
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestRecords() {
  console.log('🧪 Création de records de test...\n');

  try {
    // 1. Récupérer un utilisateur de test
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    console.log(`✅ Utilisateur de test: ${user.username}`);

    // 2. Récupérer quelques exercices
    const exercises = await prisma.exercise.findMany({
      take: 3
    });
    console.log(`✅ ${exercises.length} exercices trouvés`);

    // 3. Créer des records de test pour chaque exercice
    for (const exercise of exercises) {
      const recordType = exercise.typeQuantification === 'hold' ? 'temps' : 'repetitions';
      
      // Créer un record de base (pas trop élevé pour permettre l'amélioration)
      const baseValue = exercise.typeQuantification === 'hold' ? 30 : 10;
      
      // Vérifier si un record existe déjà
      const existingRecord = await prisma.personalRecord.findFirst({
        where: {
          userId: user.id,
          exerciceId: exercise.id,
          type: recordType
        }
      });

      if (!existingRecord) {
        await prisma.personalRecord.create({
          data: {
            userId: user.id,
            exerciceId: exercise.id,
            type: recordType,
            valeur: baseValue,
            date: new Date()
          }
        });
        console.log(`✅ Record créé pour ${exercise.nom}: ${baseValue} ${recordType === 'temps' ? 'secondes' : 'répétitions'}`);
      } else {
        console.log(`ℹ️ Record existant pour ${exercise.nom}: ${existingRecord.valeur} ${recordType === 'temps' ? 'secondes' : 'répétitions'}`);
      }
    }

    // 4. Afficher tous les records de l'utilisateur
    const allRecords = await prisma.personalRecord.findMany({
      where: { userId: user.id },
      include: {
        exercise: {
          select: {
            nom: true,
            typeQuantification: true
          }
        }
      }
    });

    console.log('\n📊 Records personnels actuels:');
    allRecords.forEach(record => {
      console.log(`  - ${record.exercise.nom}: ${record.valeur} ${record.type} (${record.exercise.typeQuantification})`);
    });

    console.log('\n🎉 Records de test créés avec succès !');
    console.log('\n💡 Maintenant, créez un entraînement avec des performances supérieures à ces records pour voir l\'intensité s\'afficher.');

  } catch (error) {
    console.error('❌ Erreur lors de la création des records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createTestRecords();
