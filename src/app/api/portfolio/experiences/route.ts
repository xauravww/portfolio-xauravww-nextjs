import { NextResponse } from 'next/server';
import { getExperiences, Experience } from '@/models/Experience';

export async function GET() {
  try {
    const experiences: Experience[] = await getExperiences();
    // Only return active experiences for the public portfolio
    const activeExperiences = experiences.filter((experience: Experience) => experience.status === 'active');
    return NextResponse.json(activeExperiences);
  } catch (error) {
    console.error('Error fetching portfolio experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}