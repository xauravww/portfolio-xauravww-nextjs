const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function downloadExperiences() {
  if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
    console.error('Missing MongoDB URI or DB_NAME in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.DB_NAME);
    const experiences = await db.collection('experiences').find({}).sort({ order: 1 }).toArray();

    // Convert ObjectIds to strings for JSON serialization
    const serializedExperiences = experiences.map(exp => ({
      ...exp,
      _id: exp._id.toString(),
      startDate: exp.startDate.toISOString(),
      endDate: exp.endDate ? exp.endDate.toISOString() : null,
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    }));

    // Write to JSON file
    const fs = require('fs');
    const path = require('path');

    const outputPath = path.join(__dirname, '..', 'experience-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(serializedExperiences, null, 2));

    console.log(`Downloaded ${experiences.length} experiences to ${outputPath}`);
    console.log('Sample experience:', JSON.stringify(serializedExperiences[0], null, 2));

  } catch (error) {
    console.error('Error downloading experiences:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

downloadExperiences();