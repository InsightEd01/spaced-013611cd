import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { updateSchool, deleteSchool } from '@/lib/schools';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, region, status, subscription_plan } = body;

    const updatedSchool = await updateSchool(params.id, {
      name,
      region,
      status,
      subscription_plan,
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error('Error updating school:', error);
    return NextResponse.json(
      { error: 'Failed to update school' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteSchool(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting school:', error);
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    );
  }
}
