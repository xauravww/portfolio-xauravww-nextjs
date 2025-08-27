import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export interface TechStack {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
  icon: string; // URL or path to icon/image
  color?: string; // Optional color for the tech stack
  description?: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTechStacks(): Promise<TechStack[]> {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('techstacks');
    
    const techStacks = await collection
      .find({ status: 'active' })
      .sort({ order: 1, name: 1 })
      .toArray();
    
    return techStacks.map(stack => ({
      id: stack._id.toString(),
      name: stack.name,
      category: stack.category,
      icon: stack.icon,
      color: stack.color,
      description: stack.description,
      status: stack.status,
      order: stack.order,
      createdAt: stack.createdAt,
      updatedAt: stack.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    return [];
  } finally {
    await client.close();
  }
}

export async function getAllTechStacks(): Promise<TechStack[]> {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('techstacks');
    
    const techStacks = await collection
      .find({})
      .sort({ order: 1, name: 1 })
      .toArray();
    
    return techStacks.map(stack => ({
      id: stack._id.toString(),
      name: stack.name,
      category: stack.category,
      icon: stack.icon,
      color: stack.color,
      description: stack.description,
      status: stack.status,
      order: stack.order,
      createdAt: stack.createdAt,
      updatedAt: stack.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching all tech stacks:', error);
    return [];
  } finally {
    await client.close();
  }
}

export async function getTechStackById(id: string): Promise<TechStack | null> {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('techstacks');
    
    const stack = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!stack) return null;
    
    return {
      id: stack._id.toString(),
      name: stack.name,
      category: stack.category,
      icon: stack.icon,
      color: stack.color,
      description: stack.description,
      status: stack.status,
      order: stack.order,
      createdAt: stack.createdAt,
      updatedAt: stack.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching tech stack by ID:', error);
    return null;
  } finally {
    await client.close();
  }
}

export async function createTechStack(data: Omit<TechStack, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('techstacks');
    
    const now = new Date();
    const result = await collection.insertOne({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    
    return result;
  } catch (error) {
    console.error('Error creating tech stack:', error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function updateTechStack(id: string, data: Partial<Omit<TechStack, 'id' | 'createdAt'>>) {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('techstacks');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date(),
        }
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error updating tech stack:', error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function deleteTechStack(id: string) {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('techstacks');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error('Error deleting tech stack:', error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function reorderTechStacks(orderedIds: string[]) {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const collection = db.collection('techstacks');
    
    const updatePromises = orderedIds.map((id, index) =>
      collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { order: index, updatedAt: new Date() } }
      )
    );
    
    await Promise.all(updatePromises);
    return { success: true };
  } catch (error) {
    console.error('Error reordering tech stacks:', error);
    throw error;
  } finally {
    await client.close();
  }
}