import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'ZOO';

async function connectToDatabase(collectionName) {
  try {
    await client.connect();
    console.log('Connected successfully to the database');
    const db = await client.db(dbName);
    return db.collection(collectionName);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export { connectToDatabase };