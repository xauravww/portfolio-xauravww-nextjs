import { NextRequest, NextResponse } from 'next/server';
import { reorderEducations } from '@/models/Education';

export async function POST(request: NextRequest) {
  try {
    const { orderedIds } = await request.json();
    
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds must be an array' },
        { status: 400 }
      );
    }

    await reorderEducations(orderedIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering educations:', error);
    return NextResponse.json(
      { error: 'Failed to reorder educations' },
      { status: 500 }
    );
  }
}