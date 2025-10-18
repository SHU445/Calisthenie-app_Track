const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testNextAuthSetup() {
  console.log('🔍 Test de la configuration NextAuth.js...\n');

  try {
    // Vérifier la connexion à la base de données
    console.log('1. Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie\n');

    // Vérifier les tables NextAuth
    console.log('2. Vérification des tables NextAuth...');
    
    // Vérifier la table User
    const userCount = await prisma.user.count();
    console.log(`   - Table User: ${userCount} utilisateur(s) trouvé(s)`);
    
    // Vérifier la table Account
    const accountCount = await prisma.account.count();
    console.log(`   - Table Account: ${accountCount} compte(s) trouvé(s)`);
    
    // Vérifier la table Session
    const sessionCount = await prisma.session.count();
    console.log(`   - Table Session: ${sessionCount} session(s) trouvée(s)`);
    
    // Vérifier la table VerificationToken
    const tokenCount = await prisma.verificationToken.count();
    console.log(`   - Table VerificationToken: ${tokenCount} token(s) trouvé(s)`);
    
    console.log('✅ Toutes les tables NextAuth sont présentes\n');

    // Tester la création d'un utilisateur de test
    console.log('3. Test de création d\'utilisateur...');
    
    // Supprimer l'utilisateur de test s'il existe
    await prisma.user.deleteMany({
      where: { username: 'test-nextauth' }
    });
    
    // Créer un utilisateur de test
    const testUser = await prisma.user.create({
      data: {
        username: 'test-nextauth',
        email: 'test@nextauth.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J7qJqJqJq', // "test123" hashé
        theme: 'dark',
        units: 'metric',
        language: 'fr'
      }
    });
    
    console.log(`✅ Utilisateur de test créé avec l'ID: ${testUser.id}`);
    
    // Nettoyer l'utilisateur de test
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Utilisateur de test supprimé\n');

    console.log('🎉 Configuration NextAuth.js validée avec succès !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Configurez votre fichier .env.local avec NEXTAUTH_URL et NEXTAUTH_SECRET');
    console.log('2. Redémarrez votre serveur de développement');
    console.log('3. Testez la connexion sur http://localhost:3000/auth/login');

  } catch (error) {
    console.error('❌ Erreur lors du test NextAuth.js:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testNextAuthSetup();
