import { NextRequest, NextResponse } from 'next/server';
import { getEducations, createEducation } from '@/models/Education';

export async function GET() {
  try {
    const educations = await getEducations();
    return NextResponse.json(educations);
  } catch (error) {
    console.error('Error fetching educations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch educations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const educationData = await request.json();
    
    // Validate required fields
    const requiredFields = ['institution', 'degree', 'field', 'startDate', 'location', 'status'];
    for (const field of requiredFields) {
      if (!educationData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const result = await createEducation({
      institution: educationData.institution,
      degree: educationData.degree,
      field: educationData.field,
      description: educationData.description,
      startDate: new Date(educationData.startDate),
      endDate: educationData.endDate ? new Date(educationData.endDate) : undefined,
      isCurrentlyStudying: educationData.isCurrentlyStudying || false,
      location: educationData.location,
      gpa: educationData.gpa,
      achievements: educationData.achievements || [],
      order: educationData.order || 0,
      status: educationData.status,
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    );
  }
}