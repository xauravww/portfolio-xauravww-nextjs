const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function downloadEducations() {
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
    const educations = await db.collection('educations').find({}).sort({ order: 1 }).toArray();

    // Convert ObjectIds to strings for JSON serialization
    const serializedEducations = educations.map(education => ({
      ...education,
      _id: education._id.toString(),
      startDate: education.startDate.toISOString(),
      endDate: education.endDate ? education.endDate.toISOString() : null,
      createdAt: education.createdAt.toISOString(),
      updatedAt: education.updatedAt.toISOString(),
    }));

    // Write to JSON file
    const fs = require('fs');
    const path = require('path');

    const outputPath = path.join(__dirname, '..', 'educations-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(serializedEducations, null, 2));

    console.log(`Downloaded ${educations.length} educations to ${outputPath}`);
    if (serializedEducations.length > 0) {
      console.log('Sample education:', JSON.stringify(serializedEducations[0], null, 2));
    }

  } catch (error) {
    console.error('Error downloading educations:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

downloadEducations();