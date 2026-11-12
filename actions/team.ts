'use server'

import { requireAdmin } from '@/lib/requireAdmin';

import connectDB from '@/lib/dbConnect';
import Team from '@/models/Team';
import Player from '@/models/Player';
import Staff from '@/models/Staff';
import { revalidatePath } from 'next/cache';
import { Team as TeamType, TeamFormData } from '@/types/team';
import { getClubTeams } from '@/actions/futbolcore';
import { deleteStoredImage, saveUploadedImage } from '@/lib/imageStore';

// Every public page that lists teams. Not exported, so not a server action.
function revalidateTeamPages() {
  revalidatePath('/admin/teams');
  revalidatePath('/teams');
  revalidatePath('/teams-overview');
  revalidatePath('/team/[teamId]', 'page');
  revalidatePath('/team/[teamId]/players/[playerId]', 'page');
  revalidatePath('/sitemap.xml');
}

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
  await requireAdmin();
  try {
    await connectDB();
    
    // Check if team with same name already exists
    const existingTeam = await Team.findOne({ name: teamData.name });
    if (existingTeam) {
      return { success: false, message: "A team with this name already exists" };
    }
    
    const newTeam = await Team.create(teamData);
    revalidateTeamPages();
    
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
  await requireAdmin();
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
    
    // Replaced photos/logos that were uploaded here are no longer used.
    if (existingTeam.image !== teamData.image) await deleteStoredImage(existingTeam.image);
    if (existingTeam.sponsor?.logo !== teamData.sponsor?.logo) await deleteStoredImage(existingTeam.sponsor?.logo);

    revalidatePath(`/admin/teams/${id}`);
    revalidateTeamPages();
    
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

// Show or hide a team on the public Teams page
export async function setTeamVisibility(id: string, visible: boolean): Promise<{ success: boolean; message: string }> {
  await requireAdmin();
  try {
    await connectDB();
    const team = await Team.findByIdAndUpdate(id, { isActive: visible === true }, { new: true });
    if (!team) return { success: false, message: "Team not found" };
    revalidateTeamPages();
    return {
      success: true,
      message: visible ? `${team.name} is now shown on the Teams page` : `${team.name} is now hidden from the Teams page`,
    };
  } catch (error: any) {
    console.error("Error changing team visibility:", error);
    return { success: false, message: error.message || "Failed to update the team" };
  }
}

// Delete team (cascades to players and staff)
export async function deleteTeam(id: string): Promise<{
  success: boolean;
  message: string;
  playersDeleted?: number;
  staffDeleted?: number;
}> {
  await requireAdmin();
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

    await Team.findByIdAndDelete(id);
    await deleteStoredImage(team.image);
    await deleteStoredImage(team.sponsor?.logo);

    revalidateTeamPages();

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
  await requireAdmin();
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
  await requireAdmin();
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

    const [playersResult, staffResult, teamsResult] = await Promise.all([
      Player.deleteMany({ teamId: { $in: ids } }),
      Staff.deleteMany({ teamId: { $in: ids } }),
      Team.deleteMany({ _id: { $in: ids } }),
    ]);

    for (const team of teams) {
      await deleteStoredImage(team.image);
      await deleteStoredImage(team.sponsor?.logo);
    }

    revalidateTeamPages();

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
  await requireAdmin();
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
        // Team.shortName has maxlength 20; FutbolCore's can be longer, which
        // used to fail validation and silently skip the whole team.
        shortName: (remote.shortName?.trim() || remote.name.trim()).slice(0, 20),
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
          // Keep what the admin chose: shown/hidden, photo, order and sponsor.
          // A team FutbolCore has retired is hidden; a hidden one is never re-shown.
          existing.shortName = baseFields.shortName;
          existing.description = existing.description || baseFields.description;
          existing.category = baseFields.category;
          if (!existing.image && baseFields.image) existing.image = baseFields.image;
          if (baseFields.isActive === false) existing.isActive = false;
          existing.futbolcoreId = baseFields.futbolcoreId;
          await existing.save();
          updated++;
        } else {
          // New (or previously deleted) teams start hidden: nothing appears on
          // the public Teams page until the admin switches it on.
          await Team.create({
            ...baseFields,
            isActive: false,
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

    revalidateTeamPages();

    const added = created > 0 ? `${created} new (hidden until you switch them on)` : '0 new';
    const message =
      skipped.length === 0
        ? `Synced ${added}, ${updated} updated`
        : `Synced ${added}, ${updated} updated; ${skipped.length} skipped`;

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
  await requireAdmin();
  try {
    // Stored in MongoDB and served from /api/images (the club does not use Cloudinary).
    return await saveUploadedImage(file);
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