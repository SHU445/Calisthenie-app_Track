/**
 * Script pour vérifier les exercices de base importés
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyBaseExercises() {
  try {
    console.log('🔍 Vérification des exercices de base...\n');
    
    // Compter les exercices de base
    const count = await prisma.exercise.count({
      where: { userId: null }
    });
    console.log(`✅ Total d'exercices de base: ${count}\n`);
    
    // Grouper par difficulté
    const byDifficulty = await prisma.exercise.groupBy({
      by: ['difficulte'],
      where: { userId: null },
      _count: true
    });
    
    console.log('📊 Répartition par difficulté:');
    byDifficulty.sort((a, b) => {
      const order = ['F', 'D', 'C', 'B', 'A', 'S', 'SS'];
      return order.indexOf(a.difficulte) - order.indexOf(b.difficulte);
    });
    byDifficulty.forEach(item => {
      console.log(`   ${item.difficulte}: ${item._count} exercices`);
    });
    
    // Grouper par catégorie
    const byCategory = await prisma.exercise.groupBy({
      by: ['categorie'],
      where: { userId: null },
      _count: true
    });
    
    console.log('\n📊 Répartition par catégorie:');
    byCategory.forEach(item => {
      console.log(`   ${item.categorie}: ${item._count} exercices`);
    });
    
    // Afficher quelques exemples
    console.log('\n📋 Exemples d\'exercices:');
    const examples = await prisma.exercise.findMany({
      where: { userId: null },
      select: { 
        nom: true, 
        difficulte: true, 
        categorie: true,
        typeQuantification: true 
      },
      take: 10
    });
    
    examples.forEach(ex => {
      console.log(`   • ${ex.nom} (${ex.difficulte}) - ${ex.categorie} [${ex.typeQuantification}]`);
    });
    
    console.log('\n✅ Vérification terminée!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyBaseExercises();

