import { NextResponse } from 'next/server';
import { getEducations, Education } from '@/models/Education';

export async function GET() {
    try {
        const educations: Education[] = await getEducations();
        // Only return active educations for the public portfolio
        const activeEducations = educations.filter((education: Education) => education.status === 'active');
        return NextResponse.json(activeEducations);
    } catch (error) {
        console.error('Error fetching portfolio educations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch educations' },
            { status: 500 }
        );
    }
}