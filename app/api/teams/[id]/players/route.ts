import { NextRequest, NextResponse } from 'next/server';
import { getPlayersByTeamId } from '@/actions/player';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const players = await getPlayersByTeamId(id);

    return NextResponse.json({ players }, { status: 200 });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players', players: [] },
      { status: 500 }
    );
  }
}
