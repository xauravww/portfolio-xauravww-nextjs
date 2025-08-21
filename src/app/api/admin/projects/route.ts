import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/models/Project';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'techStacks', 'difficulty', 'img', 'status'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const result = await createProject({
      title: projectData.title,
      description: projectData.description,
      techStacks: projectData.techStacks,
      difficulty: projectData.difficulty,
      url: projectData.url || {},
      img: projectData.img,
      status: projectData.status,
      order: projectData.order || 0,
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
