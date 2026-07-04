import { NextResponse } from 'next/server';
import { getExperiences, Experience } from '@/models/Experience';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const experiences: Experience[] = await getExperiences();
    const activeExperiences = experiences.filter((experience: Experience) => experience.status === 'active');
    if (activeExperiences && activeExperiences.length > 0) {
      return NextResponse.json(activeExperiences);
    }
  } catch (error) {
    console.error('Error fetching experiences from DB, falling back to local JSON:', error);
  }

  // Fallback to local JSON file
  try {
    const filePath = path.join(process.cwd(), 'experience-data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const localExperiences: Experience[] = JSON.parse(fileData);
    const activeExperiences = localExperiences.filter((e: Experience) => e.status === 'active');
    return NextResponse.json(activeExperiences);
  } catch (jsonError) {
    console.error('Failed to load experiences from JSON fallback:', jsonError);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}