import { NextRequest, NextResponse } from 'next/server';
import { getEducationById, updateEducation, deleteEducation } from '@/models/Education';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const education = await getEducationById(id);
        if (!education) {
            return NextResponse.json(
                { error: 'Education not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(education);
    } catch (error) {
        console.error('Error fetching education:', error);
        return NextResponse.json(
            { error: 'Failed to fetch education' },
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
        const educationData = await request.json();
        const updateData: Partial<typeof educationData> = { ...educationData };
        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }

        const result = await updateEducation(id, updateData);

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Education not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating education:', error);
        return NextResponse.json(
            { error: 'Failed to update education' },
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
        const result = await deleteEducation(id);

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Education not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting education:', error);
        return NextResponse.json(
            { error: 'Failed to delete education' },
            { status: 500 }
        );
    }
}