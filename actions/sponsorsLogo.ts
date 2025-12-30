'use server'

import connectDB from '@/lib/dbConnect';
import PortfolioLogo from '@/models/SponsorsLogo';
import { revalidatePath } from 'next/cache';
import { PortfolioLogo as PortfolioLogoType, PortfolioLogoFormData } from '@/types/sponsorsLogo';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all portfolio logos
export async function getAllPortfolioLogos(): Promise<PortfolioLogoType[]> {
  try {
    await connectDB();
    const logos = await PortfolioLogo.find({}).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(logos));
  } catch (error) {
    console.error("Error fetching portfolio logos:", error);
    throw new Error("Failed to fetch portfolio logos");
  }
}

// Get active portfolio logos
export async function getActivePortfolioLogos(): Promise<PortfolioLogoType[]> {
  try {
    await connectDB();
    const logos = await PortfolioLogo.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(logos));
  } catch (error) {
    console.error("Error fetching active portfolio logos:", error);
    return [];
  }
}

// Get portfolio logos by category
export async function getPortfolioLogosByCategory(category: string): Promise<PortfolioLogoType[]> {
  try {
    await connectDB();
    const logos = await PortfolioLogo.find({ category, isActive: true }).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(logos));
  } catch (error) {
    console.error(`Error fetching portfolio logos for category ${category}:`, error);
    return [];
  }
}

// Get portfolio logo by ID
export async function getPortfolioLogoById(id: string): Promise<PortfolioLogoType | null> {
  try {
    await connectDB();
    const logo = await PortfolioLogo.findById(id);
    
    if (!logo) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(logo));
  } catch (error) {
    console.error("Error fetching portfolio logo:", error);
    return null;
  }
}

// Create portfolio logo
export async function createPortfolioLogo(data: PortfolioLogoFormData): Promise<{ success: boolean; message: string; logo?: PortfolioLogoType }> {
  try {
    await connectDB();
    
    const logo = await PortfolioLogo.create(data);
    
    revalidatePath('/admin/sponsors');
    revalidatePath('/');
    
    return {
      success: true,
      message: "Portfolio logo created successfully",
      logo: JSON.parse(JSON.stringify(logo)),
    };
  } catch (error: any) {
    console.error("Error creating portfolio logo:", error);
    return {
      success: false,
      message: error.message || "Failed to create portfolio logo",
    };
  }
}

// Update portfolio logo
export async function updatePortfolioLogo(id: string, data: PortfolioLogoFormData): Promise<{ success: boolean; message: string; logo?: PortfolioLogoType }> {
  try {
    await connectDB();
    
    const logo = await PortfolioLogo.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!logo) {
      return {
        success: false,
        message: "Portfolio logo not found",
      };
    }
    
    revalidatePath('/admin/sponsors');
    revalidatePath('/');
    
    return {
      success: true,
      message: "Portfolio logo updated successfully",
      logo: JSON.parse(JSON.stringify(logo)),
    };
  } catch (error: any) {
    console.error("Error updating portfolio logo:", error);
    return {
      success: false,
      message: error.message || "Failed to update portfolio logo",
    };
  }
}

// Delete portfolio logo
export async function deletePortfolioLogo(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();
    
    const logo = await PortfolioLogo.findByIdAndDelete(id);
    
    if (!logo) {
      return {
        success: false,
        message: "Portfolio logo not found",
      };
    }
    
    // Delete image from Cloudinary if it exists
    if (logo.image && logo.image.includes('cloudinary')) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = logo.image.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `eagles-fc/sponsors/${filenameWithExtension.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    revalidatePath('/admin/sponsors');
    revalidatePath('/');
    
    return {
      success: true,
      message: "Portfolio logo deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting portfolio logo:", error);
    return {
      success: false,
      message: error.message || "Failed to delete portfolio logo",
    };
  }
}

// Upload logo image to Cloudinary
export async function uploadLogoImage(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'eagles-fc/sponsors',
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