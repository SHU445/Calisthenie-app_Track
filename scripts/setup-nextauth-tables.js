/**
 * Script pour créer les tables NextAuth dans la base de données
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupNextAuthTables() {
  console.log('🔧 Configuration des tables NextAuth...\n');

  try {
    // Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie\n');

    // Créer les tables NextAuth avec des requêtes SQL directes
    console.log('1. Création de la table Account...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "accounts" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "accounts_provider_providerAccountId_key" UNIQUE("provider","providerAccountId")
      )
    `;
    console.log('✅ Table Account créée\n');

    console.log('2. Création de la table Session...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "sessionToken" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      )
    `;
    console.log('✅ Table Session créée\n');

    console.log('3. Création de la table VerificationToken...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "verification_tokens_identifier_token_key" UNIQUE("identifier","token")
      )
    `;
    console.log('✅ Table VerificationToken créée\n');

    // Ajouter les contraintes de clés étrangères
    console.log('4. Ajout des contraintes de clés étrangères...');
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "accounts" 
        ADD CONSTRAINT "accounts_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ Contrainte Account -> User ajoutée');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Contrainte Account -> User existe déjà');
      } else {
        throw error;
      }
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE "sessions" 
        ADD CONSTRAINT "sessions_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log('✅ Contrainte Session -> User ajoutée');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Contrainte Session -> User existe déjà');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Tables NextAuth configurées avec succès !');
    console.log('');
    console.log('📋 Tables créées :');
    console.log('   - accounts (comptes OAuth)');
    console.log('   - sessions (sessions utilisateur)');
    console.log('   - verification_tokens (tokens de vérification)');
    console.log('');
    console.log('✅ NextAuth.js est maintenant prêt pour la persistance de connexion !');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
    console.error('');
    console.error('🔧 Solutions possibles:');
    console.error('   1. Vérifiez votre DATABASE_URL dans .env.local');
    console.error('   2. Assurez-vous que la base de données est accessible');
    console.error('   3. Vérifiez les permissions de la base de données');
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la configuration
setupNextAuthTables();
