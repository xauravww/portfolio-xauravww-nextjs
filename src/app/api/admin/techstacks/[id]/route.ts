import { NextRequest, NextResponse } from 'next/server';
import { getTechStackById, updateTechStack, deleteTechStack } from '@/models/TechStack';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const techStack = await getTechStackById(id);
    if (!techStack) {
      return NextResponse.json(
        { error: 'Tech stack not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(techStack);
  } catch (error) {
    console.error('Error fetching tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stack' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const result = await updateTechStack(id, data);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Tech stack not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to update tech stack' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteTechStack(id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Tech stack not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to delete tech stack' },
      { status: 500 }
    );
  }
}