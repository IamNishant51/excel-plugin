import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  // Always reuse the cached client to prevent connection leaks
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30_000,
    });
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}

export default getClientPromise;
