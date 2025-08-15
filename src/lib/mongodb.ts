import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://yanismorel382008:EEMo4ypOoL55Abos@cluster0.v4lkvuy.mongodb.net/';
const dbName = process.env.MONGODB_DB_NAME || 'calisthenie_app';

// Options optimisées pour Vercel et MongoDB Atlas
const options = {
  maxPoolSize: 10, // Limite le nombre de connexions simultanées
  serverSelectionTimeoutMS: 5000, // Timeout rapide pour la sélection du serveur
  socketTimeoutMS: 45000, // Timeout pour les opérations socket
  retryWrites: true, // Active les tentatives de réécriture automatiques
  writeConcern: {
    w: 'majority',
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En développement, utiliser une variable globale pour préserver la connexion
  // lors des rechargements à chaud
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En production (Vercel), optimiser pour les fonctions serverless
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}

export default clientPromise;
