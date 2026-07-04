const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
// Also fallback to main .env if .env.local doesn't exist
require('dotenv').config({ path: '.env' });

const TECH_STACKS = [
  // Frontend
  { name: 'React.js', icon: '/assets/techstack/react.png', category: 'frontend', status: 'active', order: 1 },
  { name: 'Next.js', icon: '/assets/techstack/next-js.svg', category: 'frontend', status: 'active', order: 2 },
  { name: 'TypeScript', icon: '/assets/techstack/typescript.svg', category: 'frontend', status: 'active', order: 3 },
  { name: 'JavaScript', icon: '/assets/techstack/javascript.png', category: 'frontend', status: 'active', order: 4 },
  { name: 'HTML & CSS', icon: '/assets/techstack/html-css.png', category: 'frontend', status: 'active', order: 5 },
  { name: 'Tailwind CSS', icon: '/assets/techstack/tailwind-css.svg', category: 'frontend', status: 'active', order: 6 },
  { name: 'Redux Toolkit', icon: '/assets/techstack/redux-toolkit.png', category: 'frontend', status: 'active', order: 7 },
  { name: 'XML', icon: '/assets/techstack/xml.png', category: 'frontend', status: 'active', order: 8 },

  // Backend
  { name: 'Node.js', icon: '/assets/techstack/nodejs.png', category: 'backend', status: 'active', order: 9 },
  { name: 'Express.js', icon: '/assets/techstack/express.webp', category: 'backend', status: 'active', order: 10 },
  { name: 'Prisma', icon: '/assets/techstack/prisma.svg', category: 'backend', status: 'active', order: 11 },
  { name: 'GraphQL', icon: '/assets/techstack/graphql-square.svg', category: 'backend', status: 'active', order: 12 },
  { name: 'Notion API', icon: '/assets/techstack/notion.png', category: 'backend', status: 'active', order: 13 },
  { name: 'Gram.js', icon: '/assets/techstack/gram-js.png', category: 'backend', status: 'active', order: 14 },
  { name: 'JWT', icon: '/assets/techstack/jwt-colorful.svg', category: 'backend', status: 'active', order: 15 },

  // Databases
  { name: 'MongoDB', icon: '/assets/techstack/mongodb.png', category: 'database', status: 'active', order: 16 },
  { name: 'PostgreSQL', icon: '/assets/techstack/postgresql.svg', category: 'database', status: 'active', order: 17 },
  { name: 'Redis', icon: '/assets/techstack/redis.png', category: 'database', status: 'active', order: 18 },
  { name: 'Sanity CMS', icon: '/assets/techstack/sanity.png', category: 'database', status: 'active', order: 19 },

  // DevOps & Tools
  { name: 'Docker', icon: '/assets/techstack/docker-square.png', category: 'devops', status: 'active', order: 20 },
  { name: 'Git', icon: '/assets/techstack/git-square.png', category: 'devops', status: 'active', order: 21 },
  { name: 'GitHub', icon: '/assets/techstack/github-square.png', category: 'devops', status: 'active', order: 22 },
  { name: 'N8N', icon: '/assets/techstack/n8n.jpg', category: 'devops', status: 'active', order: 23 },
  { name: 'Postman', icon: '/assets/techstack/postman-square.svg', category: 'devops', status: 'active', order: 24 },

  // Mobile
  { name: 'React Native', icon: '/assets/techstack/react-native.png', category: 'mobile', status: 'active', order: 25 },
  { name: 'Kotlin', icon: '/assets/techstack/kotlin.png', category: 'mobile', status: 'active', order: 26 },
  { name: 'Android', icon: '/assets/techstack/android.png', category: 'mobile', status: 'active', order: 27 },
  { name: 'C++', icon: '/assets/techstack/cpp.png', category: 'mobile', status: 'active', order: 28 },

  // Design
  { name: 'Figma', icon: '/assets/techstack/figma-square.png', category: 'design', status: 'active', order: 29 },

  // Other / AI
  { name: 'LangChain', icon: '/assets/techstack/langchain-square.png', category: 'other', status: 'active', order: 30 },
  { name: 'OpenAI API', icon: '/assets/techstack/openai-square.png', category: 'other', status: 'active', order: 31 },
];

async function seedTechStacks() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI env variable');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB cluster');

    const dbNames = [process.env.DB_NAME || 'portfolio_db', 'portfolio'];
    
    for (const dbName of dbNames) {
      console.log(`Seeding database: "${dbName}"...`);
      const db = client.db(dbName);
      const collection = db.collection('techstacks');

      // Clear existing techstacks
      await collection.deleteMany({});
      console.log(`- Cleared existing techstacks from ${dbName}`);

      // Insert new techstacks
      const now = new Date();
      const docsToInsert = TECH_STACKS.map(tech => ({
        ...tech,
        createdAt: now,
        updatedAt: now
      }));

      const result = await collection.insertMany(docsToInsert);
      console.log(`- Successfully inserted ${result.insertedCount} techstacks into ${dbName}`);
    }

    console.log('\nDatabase seeding finished successfully!');
  } catch (err) {
    console.error('Error seeding techstacks:', err);
  } finally {
    await client.close();
  }
}

seedTechStacks();
