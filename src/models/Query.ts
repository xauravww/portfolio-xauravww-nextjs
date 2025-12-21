import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Query {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  ip: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryInput {
  name: string;
  email: string;
  message: string;
  ip: string;
}

export async function getQueries() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Query>('queries').find({}).sort({ createdAt: -1 }).toArray();
}

export async function getQueryById(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Query>('queries').findOne({ id });
}

export async function createQuery(query: QueryInput) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const newQuery: Query = {
    ...query,
    id: Date.now().toString(),
    status: 'new',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection<Query>('queries').insertOne(newQuery);
  return result;
}

export async function updateQuery(id: string, query: Partial<Query>) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  
  const result = await db.collection<Query>('queries').updateOne(
    { id },
    { 
      $set: { ...query, updatedAt: new Date() } 
    }
  );
  return result;
}

export async function deleteQuery(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Query>('queries').deleteOne({ id });
}

export async function getQueryCount() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Query>('queries').countDocuments();
}

export async function getNewQueryCount() {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  return db.collection<Query>('queries').countDocuments({ status: 'new' });
}
