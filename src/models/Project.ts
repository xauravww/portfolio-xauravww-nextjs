import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Project {
  _id?: ObjectId;
  id: string;
  title: string;
  description: string;
  techStacks: string[];
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  url: {
    repo?: string;
    live?: string;
  };
  img: string;
  status: 'live' | 'draft';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectInput {
  title: string;
  description: string;
  techStacks: string[];
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  url: {
    repo?: string;
    live?: string;
  };
  img: string;
  status: 'live' | 'draft';
  order: number;
}

export async function getProjects() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Project>('projects').find({}).sort({ order: 1 }).toArray();
}

export async function getProjectById(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Project>('projects').findOne({ id });
}

export async function createProject(project: ProjectInput) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection<Project>('projects').insertOne(newProject);
  return result;
}

export async function updateProject(id: string, project: Partial<ProjectInput>) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const result = await db.collection<Project>('projects').updateOne(
    { id },
    { 
      $set: { ...project, updatedAt: new Date() } 
    }
  );
  return result;
}

export async function deleteProject(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Project>('projects').deleteOne({ id });
}

export async function reorderProjects(orderedIds: string[]) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { id },
      update: { $set: { order: index } }
    }
  }));
  
  return db.collection<Project>('projects').bulkWrite(bulkOps);
}
