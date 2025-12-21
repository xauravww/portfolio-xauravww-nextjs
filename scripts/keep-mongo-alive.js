const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function keepMongoAlive() {
  if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
    console.error('Missing MongoDB URI or DB_NAME in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
  });

  try {
    console.log(`${new Date().toISOString()}: Connecting to MongoDB Atlas...`);
    await client.connect();

    const db = client.db(process.env.DB_NAME);

    // Simple ping operation to keep the connection alive
    const pingResult = await db.admin().ping();
    console.log(`${new Date().toISOString()}: MongoDB ping successful:`, pingResult.ok);

    // Optional: Get a small sample of data to ensure the database is responsive
    const collections = await db.collections();
    console.log(`${new Date().toISOString()}: Found ${collections.length} collections`);

  } catch (error) {
    console.error(`${new Date().toISOString()}: Error keeping MongoDB alive:`, error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log(`${new Date().toISOString()}: Disconnected from MongoDB Atlas`);
  }
}

keepMongoAlive();