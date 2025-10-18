/**
 * Script de test pour vérifier la persistance de connexion NextAuth
 * Ce script teste les fonctionnalités d'authentification et de persistance
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testNextAuthPersistence() {
  console.log('🧪 Test de persistance NextAuth.js...\n');

  try {
    // 1. Vérifier la configuration de la base de données
    console.log('1. Vérification de la connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie\n');

    // 2. Vérifier les tables NextAuth
    console.log('2. Vérification des tables NextAuth...');
    
    // Vérifier si les tables NextAuth existent
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Account', 'Session', 'VerificationToken')
    `;
    
    console.log('Tables NextAuth trouvées:', tables);
    
    if (tables.length === 0) {
      console.log('⚠️  Les tables NextAuth ne sont pas encore créées.');
      console.log('   Exécutez: npx prisma db push pour créer les tables.\n');
    } else {
      console.log('✅ Tables NextAuth configurées\n');
    }

    // 3. Vérifier les utilisateurs existants
    console.log('3. Vérification des utilisateurs existants...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        dateCreation: true
      }
    });
    
    console.log(`Nombre d'utilisateurs: ${users.length}`);
    if (users.length > 0) {
      console.log('Utilisateurs trouvés:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.email}) - ID: ${user.id}`);
      });
    }
    console.log('');

    // 4. Tester la création d'un utilisateur de test
    console.log('4. Test de création d\'utilisateur...');
    
    const testUser = {
      username: 'test-nextauth',
      email: 'test-nextauth@example.com',
      password: 'TestPassword123!'
    };

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: testUser.username },
          { email: testUser.email }
        ]
      }
    });

    if (existingUser) {
      console.log('✅ Utilisateur de test existe déjà');
    } else {
      const newUser = await prisma.user.create({
        data: testUser
      });
      console.log('✅ Utilisateur de test créé:', newUser.username);
    }
    console.log('');

    // 5. Vérifier la configuration NextAuth
    console.log('5. Vérification de la configuration NextAuth...');
    
    const requiredEnvVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️  Variables d\'environnement manquantes:');
      missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
      });
      console.log('   Ajoutez ces variables à votre fichier .env.local\n');
    } else {
      console.log('✅ Toutes les variables d\'environnement NextAuth sont configurées\n');
    }

    // 6. Instructions pour tester la persistance
    console.log('6. Instructions pour tester la persistance de connexion:');
    console.log('');
    console.log('   a) Démarrez l\'application: npm run dev');
    console.log('   b) Allez sur: http://localhost:3000/auth/login');
    console.log('   c) Connectez-vous avec:');
    console.log('      - Nom d\'utilisateur: test-nextauth');
    console.log('      - Mot de passe: TestPassword123!');
    console.log('   d) Vérifiez que vous êtes redirigé vers la page d\'accueil');
    console.log('   e) Rafraîchissez la page (F5) - vous devez rester connecté');
    console.log('   f) Fermez et rouvrez le navigateur - vous devez rester connecté');
    console.log('   g) Attendez 30 jours - la session doit expirer automatiquement');
    console.log('');

    console.log('🎉 Test de configuration NextAuth terminé !');
    console.log('');
    console.log('📝 Notes importantes:');
    console.log('   - La session persiste pendant 30 jours');
    console.log('   - Les cookies sont sécurisés en production');
    console.log('   - La session se met à jour toutes les 24h');
    console.log('   - NextAuth gère automatiquement la persistance');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('');
    console.error('🔧 Solutions possibles:');
    console.error('   1. Vérifiez votre DATABASE_URL dans .env.local');
    console.error('   2. Exécutez: npx prisma generate');
    console.error('   3. Exécutez: npx prisma db push');
    console.error('   4. Redémarrez l\'application');
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testNextAuthPersistence();
