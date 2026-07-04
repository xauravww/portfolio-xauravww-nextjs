import { NextResponse } from 'next/server';
import { getTechStacks, TechStack } from '@/models/TechStack';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const techStacks = await getTechStacks();
    if (techStacks && techStacks.length > 0) {
      return NextResponse.json(techStacks);
    }
  } catch (error) {
    console.error('Error fetching tech stacks from DB, falling back to local JSON:', error);
  }

  // Fallback to local JSON file
  try {
    const filePath = path.join(process.cwd(), 'techstacks-data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const localTechStacks: TechStack[] = JSON.parse(fileData);
    const activeTechStacks = localTechStacks.filter((t: TechStack) => t.status === 'active');
    return NextResponse.json(activeTechStacks);
  } catch (jsonError) {
    console.error('Failed to load techstacks from JSON fallback:', jsonError);
    return NextResponse.json(
      { error: 'Failed to fetch tech stacks' },
      { status: 500 }
    );
  }
}