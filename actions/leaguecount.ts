'use server';

import connectDB from '@/lib/dbConnect';
import LeagueCount from '@/models/LeagueCount';
import { Document } from 'mongoose';

// Define league type to restrict to valid values
type League = 'Tournament' | 'NYSL';

// Interface for the league count document
interface LeagueCountDocument extends Document {
  league: League;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}


export async function getLeagueCountNumber(league: League): Promise<number> {
  try {
    await connectDB();
    
    // Validate league parameter
    if (!['Tournament', 'NYSL'].includes(league)) {
      throw new Error("League must be either 'Tournament' or 'NYSL'");
    }
    
    // Find the league count
    const leagueCount = await LeagueCount.findOne({ league }) as LeagueCountDocument | null;
    
    // Return the count or 0 if not found
    return leagueCount ? leagueCount.count : 0;
  } catch (error) {
    console.error(`Error fetching count for ${league}:`, error);
    throw new Error(`Failed to get count for ${league}`);
  }
}

export async function updateLeagueCountNumber(
  league: League, 
  count: number | string
): Promise<Record<string, any>> {
  try {
    await connectDB();
    
    // Validate league parameter
    if (!['Tournament', 'NYSL'].includes(league)) {
      throw new Error("League must be either 'Tournament' or 'NYSL'");
    }
    
    // Ensure count is a positive number
    const newCount = Math.max(0, parseInt(String(count)) || 0);
    
    // Find and update, or create if it doesn't exist (upsert)
    const updatedLeagueCount = await LeagueCount.findOneAndUpdate(
      { league },
      { count: newCount },
      { new: true, runValidators: true, upsert: true }
    ) as LeagueCountDocument;
    
    return JSON.parse(JSON.stringify(updatedLeagueCount));
  } catch (error) {
    console.error(`Error updating count for ${league}:`, error instanceof Error ? error.message : error);
    throw new Error(`Failed to update count for ${league}`);
  }
}