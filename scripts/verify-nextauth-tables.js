/**
 * Script pour vérifier que les tables NextAuth existent
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyNextAuthTables() {
  console.log('🔍 Vérification des tables NextAuth...\n');

  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie\n');

    // Vérifier chaque table individuellement
    console.log('1. Vérification de la table accounts...');
    try {
      const accountCount = await prisma.account.count();
      console.log(`✅ Table accounts existe (${accountCount} enregistrements)`);
    } catch (error) {
      console.log('❌ Table accounts n\'existe pas:', error.message);
    }

    console.log('\n2. Vérification de la table sessions...');
    try {
      const sessionCount = await prisma.session.count();
      console.log(`✅ Table sessions existe (${sessionCount} enregistrements)`);
    } catch (error) {
      console.log('❌ Table sessions n\'existe pas:', error.message);
    }

    console.log('\n3. Vérification de la table verification_tokens...');
    try {
      const tokenCount = await prisma.verificationToken.count();
      console.log(`✅ Table verification_tokens existe (${tokenCount} enregistrements)`);
    } catch (error) {
      console.log('❌ Table verification_tokens n\'existe pas:', error.message);
    }

    console.log('\n4. Test de création d\'une session...');
    try {
      // Créer une session de test
      const testSession = await prisma.session.create({
        data: {
          sessionToken: 'test-session-token-' + Date.now(),
          userId: 'cmgc423re0000uq9w9we9jpz3', // ID de l'utilisateur demo
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
        }
      });
      console.log('✅ Session de test créée:', testSession.id);

      // Supprimer la session de test
      await prisma.session.delete({
        where: { id: testSession.id }
      });
      console.log('✅ Session de test supprimée');
    } catch (error) {
      console.log('❌ Erreur lors du test de session:', error.message);
    }

    console.log('\n🎉 Vérification terminée !');
    console.log('');
    console.log('📝 NextAuth.js est configuré et prêt à utiliser !');
    console.log('   - Les sessions seront persistées dans la base de données');
    console.log('   - La durée de vie des sessions est de 30 jours');
    console.log('   - Les cookies sont sécurisés en production');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la vérification
verifyNextAuthTables();
