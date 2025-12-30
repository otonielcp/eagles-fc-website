'use server'

import connectDB from '@/lib/dbConnect';
import Player from '@/models/Player';
import { revalidatePath } from 'next/cache';
import { Player as PlayerType, PlayerFormData } from '@/types/team';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all players
export async function getAllPlayers(): Promise<PlayerType[]> {
  try {
    await connectDB();
    const players = await Player.find({}).sort({ lastName: 1, firstName: 1 }).populate('teamId');
    return JSON.parse(JSON.stringify(players));
  } catch (error) {
    console.error("Error fetching players:", error);
    throw new Error("Failed to fetch players");
  }
}

// Get team statistics average
export async function getTeamStats(teamId: string): Promise<{ 
  playerCount: number;
  averages: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutes: number;
    starts: number;
    substitutions: number;
    fouls: number;
    penalties: number;
    doubleYellowCards: number;
    shots: number;
    matchesPlayed: number;
  }
}> {
  try {
    await connectDB();
    const players = await Player.find({ teamId, isActive: true });
    
    if (!players.length) {
      return {
        playerCount: 0,
        averages: {
          appearances: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          minutes: 0,
          starts: 0,
          substitutions: 0,
          fouls: 0,
          penalties: 0,
          doubleYellowCards: 0,
          shots: 0,
          matchesPlayed: 0
        }
      };
    }

    // Calculate total stats
    const totals = players.reduce(
      (acc, player) => {
        Object.keys(player.stats).forEach((key) => {
          // TypeScript needs this check to ensure key is a valid stat property
          if (key in acc) {
            acc[key as keyof typeof acc] += player.stats[key as keyof typeof player.stats];
          }
        });
        return acc;
      },
      {
        appearances: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        minutes: 0,
        starts: 0,
        substitutions: 0,
        fouls: 0,
        penalties: 0,
        doubleYellowCards: 0,
        shots: 0,
        matchesPlayed: 0
      }
    );

    // Calculate averages
    const playerCount = players.length;
    const averages = Object.keys(totals).reduce((acc, key) => {
      acc[key as keyof typeof acc] = parseFloat(
        (totals[key as keyof typeof totals] / playerCount).toFixed(1)
      );
      return acc;
    }, { ...totals });

    return {
      playerCount,
      averages
    };
  } catch (error) {
    console.error("Error calculating team stats:", error);
    throw new Error("Failed to calculate team statistics");
  }
}

// Get players by team ID
export async function getPlayersByTeamId(teamId: string): Promise<PlayerType[]> {
  try {
    await connectDB();
    const players = await Player.find({ teamId }).sort({ position: 1, jerseyNumber: 1 });
    return JSON.parse(JSON.stringify(players));
  } catch (error) {
    console.error("Error fetching players by team ID:", error);
    throw new Error("Failed to fetch players");
  }
}

// Get player by ID
export async function getPlayerById(id: string): Promise<PlayerType | null> {
  try {
    await connectDB();
    const player = await Player.findById(id).populate('teamId');
    if (!player) return null;
    return JSON.parse(JSON.stringify(player));
  } catch (error) {
    console.error("Error fetching player:", error);
    throw new Error("Failed to fetch player");
  }
}

// Create player
export async function createPlayer(playerData: PlayerFormData): Promise<{ success: boolean; message: string; player?: PlayerType }> {
  try {
    await connectDB();

    // Check if jersey number is already taken in the team
    const existingPlayer = await Player.findOne({
      teamId: playerData.teamId,
      jerseyNumber: playerData.jerseyNumber
    });

    if (existingPlayer) {
      return {
        success: false,
        message: `Jersey number ${playerData.jerseyNumber} is already taken in this team`
      };
    }

    const newPlayer = await Player.create(playerData);

    revalidatePath('/admin/teams');
    revalidatePath(`/admin/teams/${playerData.teamId}/players`);
    revalidatePath('/teams');

    return {
      success: true,
      message: "Player created successfully",
      player: JSON.parse(JSON.stringify(newPlayer))
    };
  } catch (error: any) {
    console.error("Error creating player:", error);
    return {
      success: false,
      message: error.message || "Failed to create player"
    };
  }
}

// Update player
export async function updatePlayer(id: string, playerData: PlayerFormData): Promise<{ success: boolean; message: string; player?: PlayerType }> {
  try {
    await connectDB();

    // Check if player exists
    const existingPlayer = await Player.findById(id);
    if (!existingPlayer) {
      return { success: false, message: "Player not found" };
    }

    // Check if jersey number is already taken in the team (by another player)
    const duplicatePlayer = await Player.findOne({
      teamId: playerData.teamId,
      jerseyNumber: playerData.jerseyNumber,
      _id: { $ne: id }
    });

    if (duplicatePlayer) {
      return {
        success: false,
        message: `Jersey number ${playerData.jerseyNumber} is already taken in this team`
      };
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      playerData,
      { new: true, runValidators: true }
    );

    revalidatePath('/admin/teams');
    revalidatePath(`/admin/teams/${playerData.teamId}/players`);
    revalidatePath(`/admin/players/edit/${id}`);
    revalidatePath('/teams');

    return {
      success: true,
      message: "Player updated successfully",
      player: JSON.parse(JSON.stringify(updatedPlayer))
    };
  } catch (error: any) {
    console.error("Error updating player:", error);
    return {
      success: false,
      message: error.message || "Failed to update player"
    };
  }
}

// Delete player
export async function deletePlayer(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    // Check if player exists
    const player = await Player.findById(id);
    if (!player) {
      return { success: false, message: "Player not found" };
    }

    // Delete player image from Cloudinary if it exists
    if (player.image) {
      try {
        const publicId = player.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`eagles-fc/players/${publicId}`);
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue with player deletion even if image deletion fails
      }
    }

    const teamId = player.teamId;

    await Player.findByIdAndDelete(id);

    revalidatePath('/admin/teams');
    revalidatePath(`/admin/teams/${teamId}/players`);
    revalidatePath('/teams');

    return { success: true, message: "Player deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting player:", error);
    return {
      success: false,
      message: error.message || "Failed to delete player"
    };
  }
}

// Upload player image
export async function uploadPlayerImage(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'eagles-fc/players',
      resource_type: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      message: error.message || "Failed to upload image"
    };
  }
} 