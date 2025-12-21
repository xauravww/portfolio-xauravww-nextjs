import { NextRequest, NextResponse } from 'next/server';
import { getExperiences, createExperience } from '@/models/Experience';

export async function GET() {
  try {
    const experiences = await getExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const experienceData = await request.json();
    
    // Validate required fields
    const requiredFields = ['company', 'position', 'description', 'startDate', 'location', 'status'];
    for (const field of requiredFields) {
      if (!experienceData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const result = await createExperience({
      company: experienceData.company,
      position: experienceData.position,
      description: experienceData.description,
      startDate: new Date(experienceData.startDate),
      endDate: experienceData.endDate ? new Date(experienceData.endDate) : undefined,
      isCurrentJob: experienceData.isCurrentJob || false,
      location: experienceData.location,
      skills: experienceData.skills || [],
      order: experienceData.order || 0,
      status: experienceData.status,
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}