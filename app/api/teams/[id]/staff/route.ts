import { NextRequest, NextResponse } from 'next/server';
import { getStaffByTeamId } from '@/actions/staff';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staff = await getStaffByTeamId(id);

    return NextResponse.json({ staff }, { status: 200 });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff', staff: [] },
      { status: 500 }
    );
  }
}
