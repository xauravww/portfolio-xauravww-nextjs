import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Experience>('experiences').find({}).sort({ order: 1 }).toArray();
}

export async function getExperienceById(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Experience>('experiences').findOne({ id });
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