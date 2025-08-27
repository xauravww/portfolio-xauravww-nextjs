import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Education>('educations').find({}).sort({ order: 1 }).toArray();
}

export async function getEducationById(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Education>('educations').findOne({ id });
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