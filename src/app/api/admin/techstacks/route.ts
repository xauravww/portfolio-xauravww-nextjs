import { NextRequest, NextResponse } from 'next/server';
import { getAllTechStacks, createTechStack } from '@/models/TechStack';

export async function GET() {
  try {
    const techStacks = await getAllTechStacks();
    return NextResponse.json(techStacks);
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stacks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await createTechStack(data);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to create tech stack' },
      { status: 500 }
    );
  }
}