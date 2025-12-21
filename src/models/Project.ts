import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

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
  try {
    const filePath = path.join(process.cwd(), 'projects-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const projects = JSON.parse(fileContent);

    // Convert ISO date strings back to Date objects
    return projects.map((project: {
      _id: string;
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
      createdAt: string;
      updatedAt: string;
    }) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    })).sort((a: Project, b: Project) => a.order - b.order);
  } catch (error) {
    console.error('Error reading project data from JSON:', error);
    // Fallback to MongoDB if JSON read fails
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    return db.collection<Project>('projects').find({}).sort({ order: 1 }).toArray();
  }
}

export async function getProjectById(id: string) {
  try {
    const projects = await getProjects();
    return projects.find((project: Project) => project.id === id) || null;
  } catch (error) {
    console.error('Error reading project by ID from JSON:', error);
    // Fallback to MongoDB if JSON read fails
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    return db.collection<Project>('projects').findOne({ id });
  }
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
