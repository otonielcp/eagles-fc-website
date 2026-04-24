'use server'

import connectDB from '@/lib/dbConnect';
import Team from '@/models/Team';
import Player from '@/models/Player';
import Staff from '@/models/Staff';
import { revalidatePath } from 'next/cache';
import { Team as TeamType, TeamFormData } from '@/types/team';
import { v2 as cloudinary } from 'cloudinary';
import { getClubTeams } from '@/actions/futbolcore';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all teams
export async function getAllTeams(): Promise<TeamType[]> {
  try {
    await connectDB();
    const teams = await Team.find({}).sort({ order: 1, category: 1, name: 1 });
    return JSON.parse(JSON.stringify(teams));
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
}

// Get active teams
export async function getActiveTeams(): Promise<TeamType[]> {
  try {
    await connectDB();
    const teams = await Team.find({ isActive: true }).sort({ order: 1, category: 1, name: 1 });
    return JSON.parse(JSON.stringify(teams));
  } catch (error) {
    console.error("Error fetching active teams:", error);
    throw new Error("Failed to fetch active teams");
  }
}

// Get team by ID
export async function getTeamById(id: string): Promise<TeamType | null> {
  try {
    await connectDB();
    console.log("Fetching team by ID:", id);
    const team = await Team.findById(id);
    if (!team) return null;
    return JSON.parse(JSON.stringify(team));
  } catch (error) {
    console.error("Error fetching team:", error);
    throw new Error("Failed to fetch team");
  }
}

// Create team
export async function createTeam(teamData: TeamFormData): Promise<{ success: boolean; message: string; team?: TeamType }> {
  try {
    await connectDB();
    
    // Check if team with same name already exists
    const existingTeam = await Team.findOne({ name: teamData.name });
    if (existingTeam) {
      return { success: false, message: "A team with this name already exists" };
    }
    
    const newTeam = await Team.create(teamData);
    revalidatePath('/admin/teams');
    revalidatePath('/teams');
    
    return { 
      success: true, 
      message: "Team created successfully", 
      team: JSON.parse(JSON.stringify(newTeam)) 
    };
  } catch (error: any) {
    console.error("Error creating team:", error);
    return { 
      success: false, 
      message: error.message || "Failed to create team" 
    };
  }
}

// Update team
export async function updateTeam(id: string, teamData: TeamFormData): Promise<{ success: boolean; message: string; team?: TeamType }> {
  try {
    await connectDB();
    
    // Check if team exists
    const existingTeam = await Team.findById(id);
    if (!existingTeam) {
      return { success: false, message: "Team not found" };
    }
    
    // Check if another team with the same name exists
    const duplicateTeam = await Team.findOne({ name: teamData.name, _id: { $ne: id } });
    if (duplicateTeam) {
      return { success: false, message: "Another team with this name already exists" };
    }
    
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      teamData,
      { new: true, runValidators: true }
    );
    
    revalidatePath('/admin/teams');
    revalidatePath(`/admin/teams/${id}`);
    revalidatePath('/teams');
    revalidatePath(`/teams/${id}`);
    
    return { 
      success: true, 
      message: "Team updated successfully", 
      team: JSON.parse(JSON.stringify(updatedTeam)) 
    };
  } catch (error: any) {
    console.error("Error updating team:", error);
    return { 
      success: false, 
      message: error.message || "Failed to update team" 
    };
  }
}

// Delete team (cascades to players and staff)
export async function deleteTeam(id: string): Promise<{
  success: boolean;
  message: string;
  playersDeleted?: number;
  staffDeleted?: number;
}> {
  try {
    await connectDB();

    const team = await Team.findById(id);
    if (!team) {
      return { success: false, message: "Team not found" };
    }

    const [playersResult, staffResult] = await Promise.all([
      Player.deleteMany({ teamId: id }),
      Staff.deleteMany({ teamId: id }),
    ]);

    if (team.image) {
      try {
        const publicId = team.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`eagles-fc/teams/${publicId}`);
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    await Team.findByIdAndDelete(id);

    revalidatePath('/admin/teams');
    revalidatePath('/teams');

    const playersDeleted = playersResult.deletedCount ?? 0;
    const staffDeleted = staffResult.deletedCount ?? 0;

    return {
      success: true,
      message:
        playersDeleted || staffDeleted
          ? `Deleted team, ${playersDeleted} player(s), ${staffDeleted} staff`
          : "Team deleted successfully",
      playersDeleted,
      staffDeleted,
    };
  } catch (error: any) {
    console.error("Error deleting team:", error);
    return {
      success: false,
      message: error.message || "Failed to delete team"
    };
  }
}

// Count players/staff for a set of team ids — used for confirm dialogs
export async function countTeamDependencies(ids: string[]): Promise<{
  teams: number;
  players: number;
  staff: number;
}> {
  try {
    await connectDB();
    if (!Array.isArray(ids) || ids.length === 0) {
      return { teams: 0, players: 0, staff: 0 };
    }
    const [players, staff] = await Promise.all([
      Player.countDocuments({ teamId: { $in: ids } }),
      Staff.countDocuments({ teamId: { $in: ids } }),
    ]);
    return { teams: ids.length, players, staff };
  } catch (error) {
    console.error("Error counting team dependencies:", error);
    return { teams: 0, players: 0, staff: 0 };
  }
}

// Bulk delete teams (cascades to players and staff)
export async function deleteTeams(ids: string[]): Promise<{
  success: boolean;
  deletedCount: number;
  playersDeleted: number;
  staffDeleted: number;
  message: string;
}> {
  try {
    await connectDB();

    if (!Array.isArray(ids) || ids.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        playersDeleted: 0,
        staffDeleted: 0,
        message: "No teams selected",
      };
    }

    const teams = await Team.find({ _id: { $in: ids } });

    for (const team of teams) {
      if (!team.image) continue;
      try {
        const publicId = team.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`eagles-fc/teams/${publicId}`);
        }
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    const [playersResult, staffResult, teamsResult] = await Promise.all([
      Player.deleteMany({ teamId: { $in: ids } }),
      Staff.deleteMany({ teamId: { $in: ids } }),
      Team.deleteMany({ _id: { $in: ids } }),
    ]);

    revalidatePath('/admin/teams');
    revalidatePath('/teams');

    const deletedCount = teamsResult.deletedCount ?? 0;
    const playersDeleted = playersResult.deletedCount ?? 0;
    const staffDeleted = staffResult.deletedCount ?? 0;

    return {
      success: true,
      deletedCount,
      playersDeleted,
      staffDeleted,
      message: `Deleted ${deletedCount} team(s), ${playersDeleted} player(s), ${staffDeleted} staff`,
    };
  } catch (error: any) {
    console.error("Error bulk deleting teams:", error);
    return {
      success: false,
      deletedCount: 0,
      playersDeleted: 0,
      staffDeleted: 0,
      message: error.message || "Failed to delete teams",
    };
  }
}

// Sync teams from FutbolCore API
export async function syncTeamsFromFutbolCore(): Promise<{
  success: boolean;
  created: number;
  updated: number;
  skipped: { name: string; reason: string }[];
  message: string;
}> {
  try {
    await connectDB();

    const remoteTeams = await getClubTeams();
    if (remoteTeams.length === 0) {
      return {
        success: false,
        created: 0,
        updated: 0,
        skipped: [],
        message: "No teams returned from FutbolCore",
      };
    }

    let created = 0;
    let updated = 0;
    const skipped: { name: string; reason: string }[] = [];

    for (const remote of remoteTeams) {
      const imageUrl =
        remote.teamImage?.secure_url || remote.logo?.secure_url || '';

      const baseFields = {
        name: remote.name,
        shortName: remote.shortName || remote.name.slice(0, 20),
        description: remote.description || remote.name,
        category: remote.category || 'Senior',
        image: imageUrl,
        isActive: remote.isActive ?? true,
        order: remote.displayOrder ?? 0,
        futbolcoreId: remote._id,
      };

      try {
        // Match by futbolcoreId first, then by name as fallback for legacy rows
        const existing = await Team.findOne({
          $or: [{ futbolcoreId: remote._id }, { name: remote.name }],
        });

        if (existing) {
          // Preserve sponsor and any manual overrides; only update remote-sourced fields
          existing.shortName = baseFields.shortName;
          existing.description = existing.description || baseFields.description;
          existing.category = baseFields.category;
          if (baseFields.image) existing.image = baseFields.image;
          existing.isActive = baseFields.isActive;
          existing.order = baseFields.order;
          existing.futbolcoreId = baseFields.futbolcoreId;
          await existing.save();
          updated++;
        } else {
          await Team.create({
            ...baseFields,
            sponsor: { name: '', logo: '', website: '', isActive: false },
          });
          created++;
        }
      } catch (err: any) {
        skipped.push({
          name: remote.name,
          reason: err?.message || 'unknown error',
        });
      }
    }

    revalidatePath('/admin/teams');
    revalidatePath('/teams');

    const message =
      skipped.length === 0
        ? `Synced ${created} new, ${updated} updated`
        : `Synced ${created} new, ${updated} updated; ${skipped.length} skipped`;

    return { success: true, created, updated, skipped, message };
  } catch (error: any) {
    console.error("Error syncing teams from FutbolCore:", error);
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: [],
      message: error?.message || "Failed to sync teams",
    };
  }
}

// Upload team image
export async function uploadTeamImage(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
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
      folder: 'eagles-fc/teams',
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

// Add this new function to get similar teams
export async function getSimilarTeams(teamName: string): Promise<TeamType[]> {
  try {
    await connectDB();
    
    // Extract the base name (remove age groups, gender, etc.)
    const baseName = teamName.split(/[UW]\d+|MEN'S|WOMEN'S|BOYS|GIRLS/i)[0].trim();
    
    // Find teams with similar names that are active
    const teams = await Team.find({
      name: { $regex: baseName, $options: 'i' },
      isActive: true,
    }).sort({ order: 1, category: 1, name: 1 });
    
    return JSON.parse(JSON.stringify(teams));
  } catch (error) {
    console.error("Error fetching similar teams:", error);
    throw new Error("Failed to fetch similar teams");
  }
} 