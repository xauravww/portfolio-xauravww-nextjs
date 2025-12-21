import { NextRequest, NextResponse } from 'next/server';
import { reorderTechStacks } from '@/models/TechStack';

export async function POST(request: NextRequest) {
  try {
    const { orderedIds } = await request.json();
    
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds must be an array' },
        { status: 400 }
      );
    }

    await reorderTechStacks(orderedIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering tech stacks:', error);
    return NextResponse.json(
      { error: 'Failed to reorder tech stacks' },
      { status: 500 }
    );
  }
}