import { NextResponse } from 'next/server';
import { getTechStacks } from '@/models/TechStack';

export async function GET() {
  try {
    const techStacks = await getTechStacks();
    return NextResponse.json(techStacks);
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stacks' },
      { status: 500 }
    );
  }
}