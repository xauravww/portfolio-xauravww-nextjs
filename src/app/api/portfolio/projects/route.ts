import { NextResponse } from 'next/server';
import { getProjects } from '@/models/Project';

export async function GET() {
  try {
    const projects = await getProjects();
    // Only return live projects for the public portfolio
    const liveProjects = projects.filter(project => project.status === 'live');
    return NextResponse.json(liveProjects);
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}