import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export interface Experience {
  _id?: ObjectId;
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrentJob: boolean;
  location: string;
  skills: string[];
  order: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceInput {
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrentJob: boolean;
  location: string;
  skills: string[];
  order: number;
  status: 'active' | 'inactive';
}

export async function getExperiences() {
  try {
    const filePath = path.join(process.cwd(), 'experience-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const experiences = JSON.parse(fileContent);

    // Convert ISO date strings back to Date objects
    return experiences.map((exp: {
      _id: string;
      id: string;
      company: string;
      position: string;
      description: string;
      startDate: string;
      endDate?: string;
      isCurrentJob: boolean;
      location: string;
      skills: string[];
      order: number;
      status: 'active' | 'inactive';
      createdAt: string;
      updatedAt: string;
    }) => ({
      ...exp,
      startDate: new Date(exp.startDate),
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      createdAt: new Date(exp.createdAt),
      updatedAt: new Date(exp.updatedAt),
    })).sort((a: Experience, b: Experience) => a.order - b.order);
  } catch (error) {
    console.error('Error reading experience data from JSON:', error);
    // Fallback to MongoDB if JSON read fails
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    return db.collection<Experience>('experiences').find({}).sort({ order: 1 }).toArray();
  }
}

export async function getExperienceById(id: string) {
  try {
    const experiences = await getExperiences();
    return experiences.find((exp: Experience) => exp.id === id) || null;
  } catch (error) {
    console.error('Error reading experience by ID from JSON:', error);
    // Fallback to MongoDB if JSON read fails
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    return db.collection<Experience>('experiences').findOne({ id });
  }
}

export async function createExperience(experience: ExperienceInput) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const newExperience: Experience = {
    ...experience,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection<Experience>('experiences').insertOne(newExperience);
  return result;
}

export async function updateExperience(id: string, experience: Partial<ExperienceInput>) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const result = await db.collection<Experience>('experiences').updateOne(
    { id },
    { 
      $set: { ...experience, updatedAt: new Date() } 
    }
  );
  return result;
}

export async function deleteExperience(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Experience>('experiences').deleteOne({ id });
}

export async function reorderExperiences(orderedIds: string[]) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { id },
      update: { $set: { order: index } }
    }
  }));
  
  return db.collection<Experience>('experiences').bulkWrite(bulkOps);
}