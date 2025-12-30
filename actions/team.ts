'use server'

import connectDB from '@/lib/dbConnect';
import Team from '@/models/Team';
import Player from '@/models/Player';
import Staff from '@/models/Staff';
import { revalidatePath } from 'next/cache';
import { Team as TeamType, TeamFormData } from '@/types/team';
import { v2 as cloudinary } from 'cloudinary';

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

// Delete team
export async function deleteTeam(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();
    
    // Check if team exists
    const team = await Team.findById(id);
    if (!team) {
      return { success: false, message: "Team not found" };
    }
    
    // Check if team has players or staff
    const playersCount = await Player.countDocuments({ teamId: id });
    const staffCount = await Staff.countDocuments({ teamId: id });
    
    if (playersCount > 0 || staffCount > 0) {
      return { 
        success: false, 
        message: `Cannot delete team with associated players or staff. Please remove ${playersCount} players and ${staffCount} staff members first.` 
      };
    }
    
    // Delete team image from Cloudinary if it exists
    if (team.image) {
      try {
        const publicId = team.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`eagles-fc/teams/${publicId}`);
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue with team deletion even if image deletion fails
      }
    }
    
    await Team.findByIdAndDelete(id);
    
    revalidatePath('/admin/teams');
    revalidatePath('/teams');
    
    return { success: true, message: "Team deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting team:", error);
    return { 
      success: false, 
      message: error.message || "Failed to delete team" 
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