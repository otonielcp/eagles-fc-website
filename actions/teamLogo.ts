'use server'

import connectDB from '@/lib/dbConnect';
import TeamLogo from '@/models/TeamLogo';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface TeamLogoData {
  _id: string;
  name: string;
  logo: string;
}

// Search teams by name (for autocomplete)
export async function searchTeams(query: string): Promise<TeamLogoData[]> {
  try {
    await connectDB();

    if (!query || query.length < 2) {
      return [];
    }

    const teams = await TeamLogo.find({
      name: { $regex: query.toLowerCase(), $options: 'i' }
    })
    .limit(10)
    .sort({ name: 1 });

    return teams.map(team => ({
      _id: team._id.toString(),
      name: team.name,
      logo: team.logo,
    }));
  } catch (error) {
    console.error("Error searching teams:", error);
    return [];
  }
}

// Get team logo by exact name
export async function getTeamLogoByName(name: string): Promise<TeamLogoData | null> {
  try {
    await connectDB();

    const team = await TeamLogo.findOne({
      name: name.toLowerCase().trim()
    });

    if (!team) {
      return null;
    }

    return {
      _id: team._id.toString(),
      name: team.name,
      logo: team.logo,
    };
  } catch (error) {
    console.error("Error getting team logo:", error);
    return null;
  }
}

// Save or update team logo
export async function saveTeamLogo(name: string, logoUrl: string): Promise<{ success: boolean; team?: TeamLogoData; message?: string }> {
  try {
    await connectDB();

    const normalizedName = name.toLowerCase().trim();

    // Check if team already exists
    const existingTeam = await TeamLogo.findOne({ name: normalizedName });

    if (existingTeam) {
      // Update existing team logo
      existingTeam.logo = logoUrl;
      await existingTeam.save();

      return {
        success: true,
        team: {
          _id: existingTeam._id.toString(),
          name: existingTeam.name,
          logo: existingTeam.logo,
        },
        message: "Team logo updated"
      };
    }

    // Create new team
    const team = await TeamLogo.create({
      name: normalizedName,
      logo: logoUrl,
    });

    return {
      success: true,
      team: {
        _id: team._id.toString(),
        name: team.name,
        logo: team.logo,
      },
      message: "Team logo saved"
    };
  } catch (error: any) {
    console.error("Error saving team logo:", error);
    return {
      success: false,
      message: error.message || "Failed to save team logo"
    };
  }
}

// Get all teams (for dropdown)
export async function getAllTeams(): Promise<TeamLogoData[]> {
  try {
    await connectDB();

    const teams = await TeamLogo.find({}).sort({ name: 1 });

    return teams.map(team => ({
      _id: team._id.toString(),
      name: team.name,
      logo: team.logo,
    }));
  } catch (error) {
    console.error("Error getting all teams:", error);
    return [];
  }
}

// Upload team logo to Cloudinary and save to database
export async function uploadAndSaveTeamLogo(
  formData: FormData
): Promise<{ success: boolean; url?: string; team?: TeamLogoData; message?: string }> {
  try {
    const file = formData.get('file') as File;
    const teamName = formData.get('teamName') as string;

    if (!file) {
      return { success: false, message: "No file provided" };
    }

    if (!teamName) {
      return { success: false, message: "No team name provided" };
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'eagles-fc/team-logos',
      resource_type: 'auto',
    });

    // Save to database
    const saveResult = await saveTeamLogo(teamName, result.secure_url);

    if (saveResult.success) {
      return {
        success: true,
        url: result.secure_url,
        team: saveResult.team,
        message: saveResult.message
      };
    }

    return {
      success: true,
      url: result.secure_url,
      message: "Logo uploaded but failed to save to database"
    };
  } catch (error: any) {
    console.error("Error uploading team logo:", error);
    return {
      success: false,
      message: error.message || "Failed to upload team logo"
    };
  }
}
