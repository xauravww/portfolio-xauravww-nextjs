import { NextRequest, NextResponse } from 'next/server';
import { reorderExperiences } from '@/models/Experience';

export async function POST(request: NextRequest) {
  try {
    const { orderedIds } = await request.json();
    
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds must be an array' },
        { status: 400 }
      );
    }

    await reorderExperiences(orderedIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering experiences:', error);
    return NextResponse.json(
      { error: 'Failed to reorder experiences' },
      { status: 500 }
    );
  }
}