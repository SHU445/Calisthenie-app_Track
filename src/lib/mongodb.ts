import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://yanismorel382008:EEMo4ypOoL55Abos@cluster0.v4lkvuy.mongodb.net/';
const dbName = process.env.MONGODB_DB_NAME || 'calisthenie_app';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En développement, utiliser une variable globale pour préserver la connexion
  // lors des rechargements à chaud
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En production, créer une nouvelle connexion
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}

export default clientPromise;
