// Script de test pour vérifier la configuration NextAuth
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testNextAuthSetup() {
  console.log('🔍 Test de la configuration NextAuth...\n');

  try {
    // Vérifier la connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie\n');

    // Vérifier les tables NextAuth
    console.log('2. Vérification des tables NextAuth...');
    
    // Vérifier la table users
    const userCount = await prisma.user.count();
    console.log(`   - Table users: ${userCount} utilisateur(s)`);

    // Vérifier la table accounts
    const accountCount = await prisma.account.count();
    console.log(`   - Table accounts: ${accountCount} compte(s)`);

    // Vérifier la table sessions
    const sessionCount = await prisma.session.count();
    console.log(`   - Table sessions: ${sessionCount} session(s)`);

    // Vérifier la table verification_tokens
    const tokenCount = await prisma.verificationToken.count();
    console.log(`   - Table verification_tokens: ${tokenCount} token(s)`);

    console.log('✅ Toutes les tables NextAuth sont présentes\n');

    // Test de création d'un utilisateur de test
    console.log('3. Test de création d\'utilisateur...');
    const testUser = await prisma.user.upsert({
      where: { username: 'test-nextauth' },
      update: {},
      create: {
        username: 'test-nextauth',
        email: 'test@nextauth.com',
        password: 'Test123',
        theme: 'dark',
        units: 'metric',
        language: 'fr'
      }
    });
    console.log(`✅ Utilisateur de test créé: ${testUser.username} (ID: ${testUser.id})\n`);

    // Nettoyer l'utilisateur de test
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Utilisateur de test supprimé\n');

    console.log('🎉 Configuration NextAuth validée avec succès !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Ajoutez NEXTAUTH_SECRET à votre fichier .env.local');
    console.log('2. Ajoutez NEXTAUTH_URL à votre fichier .env.local');
    console.log('3. Redémarrez votre serveur de développement');
    console.log('4. Testez la connexion sur http://localhost:3000/auth/login');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('\n🔧 Solutions possibles :');
    console.error('1. Vérifiez votre DATABASE_URL dans .env.local');
    console.error('2. Exécutez "npx prisma db push" pour synchroniser le schéma');
    console.error('3. Vérifiez que votre base de données est accessible');
  } finally {
    await prisma.$disconnect();
  }
}

testNextAuthSetup();
