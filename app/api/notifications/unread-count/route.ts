import { NextResponse } from 'next/server';

export async function GET() {
  // Return a quick response to prevent timeout errors
  // This endpoint is not currently used but prevents client-side timeout errors
  return NextResponse.json({ 
    count: 0,
    success: true 
  }, { status: 200 });
}

