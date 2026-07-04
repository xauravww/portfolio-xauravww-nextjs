import { NextResponse } from 'next/server';
import { getEducations, Education } from '@/models/Education';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const educations: Education[] = await getEducations();
    const activeEducations = educations.filter((education: Education) => education.status === 'active');
    if (activeEducations && activeEducations.length > 0) {
      return NextResponse.json(activeEducations);
    }
  } catch (error) {
    console.error('Error fetching portfolio educations from DB, falling back to local JSON:', error);
  }

  // Fallback to local JSON file
  try {
    const filePath = path.join(process.cwd(), 'educations-data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const localEducations: Education[] = JSON.parse(fileData);
    const activeEducations = localEducations.filter((e: Education) => e.status === 'active');
    return NextResponse.json(activeEducations);
  } catch (jsonError) {
    console.error('Failed to load educations from JSON fallback:', jsonError);
    return NextResponse.json(
      { error: 'Failed to fetch educations' },
      { status: 500 }
    );
  }
}