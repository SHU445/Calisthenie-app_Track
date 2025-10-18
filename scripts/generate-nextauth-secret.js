const crypto = require('crypto');

function generateNextAuthSecret() {
  const secret = crypto.randomBytes(32).toString('base64');
  
  console.log('🔐 Génération d\'un secret NextAuth.js sécurisé...\n');
  console.log('Secret généré :');
  console.log(secret);
  console.log('\n📋 Ajoutez cette ligne à votre fichier .env.local :');
  console.log(`NEXTAUTH_SECRET="${secret}"`);
  console.log('\n⚠️  Important :');
  console.log('- Gardez ce secret en sécurité');
  console.log('- Ne le partagez jamais publiquement');
  console.log('- Utilisez un secret différent pour chaque environnement');
}

generateNextAuthSecret();
