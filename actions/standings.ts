// actions/standings.ts
'use server'

import { requireAdmin } from '@/lib/requireAdmin';

import connectDB from '@/lib/dbConnect';
import Standing from '@/models/Standings';
import { revalidatePath } from 'next/cache';

// Public pages that show standings. Not exported, so not a server action.
function revalidateStandingsPages() {
  revalidatePath('/tables');
  revalidatePath('/');
}

export async function getAllStandings(): Promise<any> {
  try {
    await connectDB();

    // Fetch all standings from the database
    const standings = await Standing.find({})
      .sort({ "createdAt": -1 })  // Sort by creation date, newest first
      .lean();  // Use lean() for better performance with large datasets

    return JSON.parse(JSON.stringify(standings));
  } catch (error) {
    console.error("Error fetching all standings:", error);
    throw new Error("Failed to fetch standings data");
  }
}

export async function getStandingById(id: string): Promise<any> {
  try {
    await connectDB();

    const standing = await Standing.findById(id).lean();

    if (!standing) {
      throw new Error("Standing not found");
    }

    return JSON.parse(JSON.stringify(standing));
  } catch (error) {
    console.error("Error fetching standing by ID:", error);
    throw new Error("Failed to fetch standing data");
  }
}

export async function updateStanding(id: string, data: any): Promise<any> {
  await requireAdmin();
  try {
    await connectDB();

    // New rows mean new standings: record when, for the "Updated" line on /tables.
    const update =
      data && typeof data === 'object' && 'standings' in data && !('metadata' in data)
        ? { ...data, 'metadata.lastUpdated': new Date() }
        : data;

    const updatedStanding = await Standing.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedStanding) {
      throw new Error("Standing not found");
    }

    revalidateStandingsPages();
    return JSON.parse(JSON.stringify(updatedStanding));
  } catch (error) {
    console.error("Error updating standing:", error);
    throw new Error("Failed to update standing data");
  }
}

export async function updateTeamInStanding(
  standingId: string,
  teamIndex: number,
  teamData: any
): Promise<any> {
  await requireAdmin();
  try {
    await connectDB();

    // First, get the current standing document
    const standing = await Standing.findById(standingId);

    if (!standing) {
      throw new Error("Standing not found");
    }

    // Update the specific team in the standings array
    if (standing.standings && standing.standings[teamIndex]) {
      // Update team data
      Object.assign(standing.standings[teamIndex], teamData);

      // Save the updated document
      standing.set('metadata.lastUpdated', new Date());
      await standing.save();
      revalidateStandingsPages();

      return JSON.parse(JSON.stringify(standing));
    } else {
      throw new Error("Team not found in standings");
    }
  } catch (error) {
    console.error("Error updating team in standing:", error);
    throw new Error("Failed to update team data");
  }
}

export async function deleteStanding(id: string): Promise<boolean> {
  await requireAdmin();
  try {
    await connectDB();
    
    // Find and delete the standing by ID
    const result = await Standing.findByIdAndDelete(id);
    
    if (!result) {
      throw new Error("Standing not found");
    }
    
    revalidateStandingsPages();
    return true;
  } catch (error) {
    console.error("Error deleting standing:", error);
    throw new Error("Failed to delete standing");
  }
}

export async function createStanding(data: { 
  metadata: { 
    league: string; 
    group: string; 
    season: string; 
    teamId?: string;
  };
  standings?: any[];
}): Promise<any> {
  await requireAdmin();
  try {
    await connectDB();
    
    // Create a new standing document
    const newStanding = await Standing.create({
      metadata: { ...data.metadata, lastUpdated: new Date() },
      standings: data.standings || [] // Default to empty array if not provided
    });
    revalidateStandingsPages();
    
    return JSON.parse(JSON.stringify(newStanding));
  } catch (error) {
    console.error("Error creating standing:", error);
    throw new Error("Failed to create standing data");
  }
}
