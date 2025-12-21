const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function updateMongoDB() {
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
    const projectsCollection = db.collection('projects');
    const educationsCollection = db.collection('educations');

    // 1. Add new NebulaPlan project
    const nebulaPlanProject = {
      _id: new ObjectId(),
      title: "NebulaPlan",
      description: "Created an AI-powered project planning tool that automates development from ideas to deployment, with chat-based brainstorming. Used AI to generate requirements, architecture, user stories, tech recommendations, workflows, and UI mockups accurately. Added features for task tracking, personas, user journeys, and auto PDF docs.",
      techStacks: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "LangChain",
        "OpenAI API",
        "Tailwind CSS"
      ],
      difficulty: "Advanced",
      url: {
        repo: "https://github.com/xauravww/project-planner-next",
        live: "https://nebulaplan.vercel.app"
      },
      img: "https://cdn.jsdelivr.net/gh/sauravtechno/main-d/assets/projects/nebulaplan.png",
      status: "live",
      order: 0,
      id: "nebulaplan_2025",
      createdAt: new Date("2025-12-21T03:30:00.000Z"),
      updatedAt: new Date("2025-12-21T03:30:00.000Z")
    };

    console.log('Adding NebulaPlan project...');
    const insertResult = await projectsCollection.insertOne(nebulaPlanProject);
    console.log('NebulaPlan project added with ID:', insertResult.insertedId);

    // 2. Update all existing projects' order (shift them down by 1)
    console.log('Updating project orders...');
    const projectUpdates = [
      { id: "1757781792113", newOrder: 1 }, // JobQuest AI
      { id: "1756401810030", newOrder: 2 }, // Rupay Savvy
      { id: "1756401054698", newOrder: 3 }, // FunWala Telegram Bot
      { id: "1756402058947", newOrder: 4 }, // Portfolio Website
      { id: "1756402847576", newOrder: 5 }, // Grocery Bud
      { id: "1756402777771", newOrder: 6 }, // Color Shade Generator
      { id: "1756402409616", newOrder: 7 }, // Midi Piano
      { id: "1756402581666", newOrder: 8 }, // Form Validation
      { id: "1756402934578", newOrder: 9 }, // Pixtract
      { id: "1756403032577", newOrder: 10 }, // Analog Clock
      { id: "1756401303235", newOrder: 11 }, // Detoxy Fusion
      { id: "1756401158172", newOrder: 12 }, // AI Resume Analyzer
      { id: "1756401669185", newOrder: 13 }  // BRCM Educon
    ];

    for (const update of projectUpdates) {
      await projectsCollection.updateOne(
        { id: update.id },
        { $set: { order: update.newOrder, updatedAt: new Date() } }
      );
    }
    console.log('All project orders updated');

    // 3. Update education GPA
    console.log('Updating education GPA...');
    await educationsCollection.updateOne(
      { institution: "BRCM College Of Engineering and Technology" },
      {
        $set: {
          gpa: "8.02/10",
          updatedAt: new Date()
        }
      }
    );

    // 4. Update 10th standard field
    await educationsCollection.updateOne(
      { degree: "10th" },
      {
        $set: {
          field: "General",
          updatedAt: new Date()
        }
      }
    );

    console.log('Education records updated');

    // 5. Verify the updates
    console.log('\nVerifying updates...');
    const projectsCount = await projectsCollection.countDocuments();
    const nebulaPlanCheck = await projectsCollection.findOne({ title: "NebulaPlan" });
    const educationCheck = await educationsCollection.findOne({ institution: "BRCM College Of Engineering and Technology" });

    console.log(`Total projects: ${projectsCount}`);
    console.log(`NebulaPlan order: ${nebulaPlanCheck?.order}`);
    console.log(`BRCM GPA: ${educationCheck?.gpa}`);

  } catch (error) {
    console.error('Error updating MongoDB:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

updateMongoDB();