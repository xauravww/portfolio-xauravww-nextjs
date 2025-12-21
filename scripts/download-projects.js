const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function downloadProjects() {
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
    const projects = await db.collection('projects').find({}).sort({ order: 1 }).toArray();

    // Convert ObjectIds to strings for JSON serialization
    const serializedProjects = projects.map(project => ({
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    // Write to JSON file
    const fs = require('fs');
    const path = require('path');

    const outputPath = path.join(__dirname, '..', 'projects-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(serializedProjects, null, 2));

    console.log(`Downloaded ${projects.length} projects to ${outputPath}`);
    if (serializedProjects.length > 0) {
      console.log('Sample project:', JSON.stringify(serializedProjects[0], null, 2));
    }

  } catch (error) {
    console.error('Error downloading projects:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

downloadProjects();