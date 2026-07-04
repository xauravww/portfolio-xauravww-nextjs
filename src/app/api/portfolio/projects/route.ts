import { NextResponse } from 'next/server';
import { getProjects, Project } from '@/models/Project';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const projects: Project[] = await getProjects();
    const liveProjects = projects.filter((project: Project) => project.status === 'live');
    if (liveProjects && liveProjects.length > 0) {
      return NextResponse.json(liveProjects);
    }
  } catch (error) {
    console.error('Error fetching portfolio projects from DB, falling back to local JSON:', error);
  }

  // Fallback to local JSON file
  try {
    const filePath = path.join(process.cwd(), 'projects-data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const localProjects: Project[] = JSON.parse(fileData);
    const liveProjects = localProjects.filter((project: Project) => project.status === 'live');
    return NextResponse.json(liveProjects);
  } catch (jsonError) {
    console.error('Failed to load projects from JSON fallback:', jsonError);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}