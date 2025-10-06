/**
 * Script pour vérifier les entraînements importés
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TARGET_USER_ID = 'cmgc4486y0001uq9wz13jzioc';

async function verifyWorkouts() {
  try {
    console.log('🔍 Vérification des entraînements importés...\n');
    
    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: TARGET_USER_ID },
      select: { username: true }
    });
    
    if (!user) {
      console.error('❌ Utilisateur introuvable!');
      return;
    }
    
    console.log(`👤 Utilisateur: ${user.username}\n`);
    
    // Compter les workouts
    const totalWorkouts = await prisma.workout.count({
      where: { userId: TARGET_USER_ID }
    });
    
    console.log(`✅ Total d'entraînements: ${totalWorkouts}\n`);
    
    // Grouper par type
    const byType = await prisma.workout.groupBy({
      by: ['type'],
      where: { userId: TARGET_USER_ID },
      _count: true
    });
    
    console.log('📊 Répartition par type:');
    byType.forEach(item => {
      console.log(`   ${item.type}: ${item._count} entraînements`);
    });
    
    // Grouper par mois
    const workouts = await prisma.workout.findMany({
      where: { userId: TARGET_USER_ID },
      select: { date: true, nom: true },
      orderBy: { date: 'desc' }
    });
    
    const byMonth = {};
    workouts.forEach(w => {
      const month = w.date.toISOString().substring(0, 7);
      if (!byMonth[month]) byMonth[month] = 0;
      byMonth[month]++;
    });
    
    console.log('\n📅 Répartition par mois:');
    Object.entries(byMonth)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .forEach(([month, count]) => {
        console.log(`   ${month}: ${count} entraînements`);
      });
    
    // Compter le total de sets
    const totalSets = await prisma.workoutSet.count({
      where: {
        workout: {
          userId: TARGET_USER_ID
        }
      }
    });
    
    console.log(`\n📈 Total de sets: ${totalSets}`);
    
    // Afficher quelques exemples
    console.log('\n📋 Derniers entraînements:');
    const recentWorkouts = await prisma.workout.findMany({
      where: { userId: TARGET_USER_ID },
      select: {
        nom: true,
        date: true,
        type: true,
        duree: true,
        _count: {
          select: { sets: true }
        }
      },
      orderBy: { date: 'desc' },
      take: 5
    });
    
    recentWorkouts.forEach(w => {
      const date = w.date.toLocaleDateString('fr-FR');
      console.log(`   • ${w.nom} - ${date} (${w.type}, ${w.duree}min, ${w._count.sets} sets)`);
    });
    
    // Exercices les plus utilisés
    console.log('\n💪 Exercices les plus utilisés:');
    const exerciseUsage = await prisma.workoutSet.groupBy({
      by: ['exerciceId'],
      where: {
        workout: {
          userId: TARGET_USER_ID
        }
      },
      _count: true,
      orderBy: {
        _count: {
          exerciceId: 'desc'
        }
      },
      take: 5
    });
    
    for (const usage of exerciseUsage) {
      const exercise = await prisma.exercise.findUnique({
        where: { id: usage.exerciceId },
        select: { nom: true }
      });
      console.log(`   • ${exercise.nom}: ${usage._count} sets`);
    }
    
    console.log('\n✅ Vérification terminée!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyWorkouts();

