import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export interface Education {
  _id?: ObjectId;
  id: string;
  institution: string;
  degree: string;
  field: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyStudying: boolean;
  location: string;
  gpa?: string;
  achievements?: string[];
  order: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationInput {
  institution: string;
  degree: string;
  field: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyStudying: boolean;
  location: string;
  gpa?: string;
  achievements?: string[];
  order: number;
  status: 'active' | 'inactive';
}

export async function getEducations() {
  try {
    const filePath = path.join(process.cwd(), 'educations-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const educations = JSON.parse(fileContent);

    // Convert ISO date strings back to Date objects
    return educations.map((education: {
      _id: string;
      id: string;
      institution: string;
      degree: string;
      field: string;
      description?: string;
      startDate: string;
      endDate?: string;
      isCurrentlyStudying: boolean;
      location: string;
      gpa?: string;
      achievements?: string[];
      order: number;
      status: 'active' | 'inactive';
      createdAt: string;
      updatedAt: string;
    }) => ({
      ...education,
      startDate: new Date(education.startDate),
      endDate: education.endDate ? new Date(education.endDate) : undefined,
      createdAt: new Date(education.createdAt),
      updatedAt: new Date(education.updatedAt),
    })).sort((a: Education, b: Education) => a.order - b.order);
  } catch (error) {
    console.error('Error reading education data from JSON:', error);
    // Fallback to MongoDB if JSON read fails
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    return db.collection<Education>('educations').find({}).sort({ order: 1 }).toArray();
  }
}

export async function getEducationById(id: string) {
  try {
    const educations = await getEducations();
    return educations.find((education: Education) => education.id === id) || null;
  } catch (error) {
    console.error('Error reading education by ID from JSON:', error);
    // Fallback to MongoDB if JSON read fails
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    return db.collection<Education>('educations').findOne({ id });
  }
}

export async function createEducation(education: EducationInput) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const newEducation: Education = {
    ...education,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection<Education>('educations').insertOne(newEducation);
  return result;
}

export async function updateEducation(id: string, education: Partial<EducationInput>) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const result = await db.collection<Education>('educations').updateOne(
    { id },
    { 
      $set: { ...education, updatedAt: new Date() } 
    }
  );
  return result;
}

export async function deleteEducation(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Education>('educations').deleteOne({ id });
}

export async function reorderEducations(orderedIds: string[]) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { id },
      update: { $set: { order: index } }
    }
  }));
  
  return db.collection<Education>('educations').bulkWrite(bulkOps);
}