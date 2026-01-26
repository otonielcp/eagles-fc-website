'use server'

import connectDB from '@/lib/dbConnect';
import Slider from '@/models/Slider';
import { revalidatePath } from 'next/cache';
import { Slider as SliderType, SliderFormData } from '@/types/slider';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to format matchDate for datetime-local input and countdown
function formatMatchDate(matchDate: Date | string | null | undefined): string {
  if (!matchDate) return "";

  if (matchDate instanceof Date) {
    // Format as ISO string and slice to get YYYY-MM-DDTHH:mm format
    return matchDate.toISOString().slice(0, 16);
  }

  if (typeof matchDate === 'string') {
    // If already in correct format or close to it
    if (matchDate.includes('T')) {
      return matchDate.slice(0, 16);
    }
    // Try to parse and reformat
    const parsed = new Date(matchDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 16);
    }
  }

  return matchDate.toString();
}

// Get all sliders
export async function getAllSliders(): Promise<SliderType[]> {
  try {
    await connectDB();
    const sliders = await Slider.find({}).sort({ order: 1 });
    return JSON.parse(JSON.stringify(sliders));
  } catch (error) {
    console.error("Error fetching sliders:", error);
    throw new Error("Failed to fetch sliders");
  }
}

// Get active sliders
export async function getActiveSliders(): Promise<SliderType[]> {
  try {
    await connectDB();
    
    // Get all sliders first
    const allSliders = await Slider.find({}).sort({ order: 1 });
    console.log("🔍 [getActiveSliders] Total sliders in DB:", allSliders.length);
    
    if (allSliders.length === 0) {
      console.log("⚠️ [getActiveSliders] No sliders found in database");
      return [];
    }
    
    // Log all isActive values for debugging
    console.log("🔍 [getActiveSliders] All sliders isActive values:", 
      allSliders.map(s => ({ 
        title: s.title?.substring(0, 30), 
        isActive: s.isActive, 
        isActiveType: typeof s.isActive,
        isActiveRaw: JSON.stringify(s.isActive)
      }))
    );
    
    // Try the standard query first
    let sliders = await Slider.find({ isActive: true }).sort({ order: 1 });
    console.log("🔍 [getActiveSliders] Found active sliders (boolean true query):", sliders.length);
    
    // If no results, filter manually from all sliders (handles any data type)
    if (sliders.length === 0) {
      console.log("⚠️ [getActiveSliders] Standard query returned 0, filtering all sliders manually...");
      sliders = allSliders.filter(s => {
        const isActive = s.isActive;
        // Comprehensive check for active status
        const isActiveValue = 
          isActive === true || 
          isActive === "true" || 
          isActive === 1 || 
          String(isActive).toLowerCase() === "true" ||
          (typeof isActive === 'string' && isActive.toLowerCase().trim() === 'true') ||
          (isActive !== false && isActive !== "false" && isActive !== 0 && isActive !== null && isActive !== undefined);
        
        if (!isActiveValue) {
          console.log(`❌ [getActiveSliders] Excluding slider "${s.title?.substring(0, 30)}": isActive=${isActive} (type: ${typeof isActive})`);
        }
        return isActiveValue;
      });
      console.log("✅ [getActiveSliders] Filtered active sliders:", sliders.length);
      
      // If still no results, return all sliders as fallback (so something shows)
      if (sliders.length === 0 && allSliders.length > 0) {
        console.warn("⚠️ [getActiveSliders] No sliders matched active criteria, returning ALL sliders as fallback");
        sliders = allSliders;
      }
    } else {
      console.log("✅ [getActiveSliders] Standard query worked, found", sliders.length, "active sliders");
    }

    console.log("🎯 [getActiveSliders] Final result: returning", sliders.length, "sliders");
    
    // Properly serialize each slider to ensure matchDate is in ISO format
    const result = sliders.map(slider => ({
      _id: slider._id.toString(),
      type: slider.type || "text",
      title: slider.title,
      content: slider.content,
      image: slider.image,
      link: slider.link,
      buttonText: slider.buttonText,
      order: slider.order,
      isActive: slider.isActive,
      gameData: slider.gameData ? {
        homeTeamName: slider.gameData.homeTeamName || "",
        homeTeamLogo: slider.gameData.homeTeamLogo || "",
        awayTeamName: slider.gameData.awayTeamName || "",
        awayTeamLogo: slider.gameData.awayTeamLogo || "",
        leagueLogo: slider.gameData.leagueLogo || "",
        matchDate: formatMatchDate(slider.gameData.matchDate),
        matchTime: slider.gameData.matchTime || "",
        matchLocation: slider.gameData.matchLocation || "",
        leftPlayerImage: slider.gameData.leftPlayerImage || "",
        rightPlayerImage: slider.gameData.rightPlayerImage || "",
      } : undefined,
      fixtureId: slider.fixtureId?.toString(),
      createdAt: slider.createdAt.toISOString(),
      updatedAt: slider.updatedAt.toISOString(),
    }));
    
    console.log("✅ [getActiveSliders] Successfully serialized", result.length, "sliders");
    return result;
  } catch (error) {
    console.error("❌ [getActiveSliders] Error fetching active sliders:", error);
    throw new Error("Failed to fetch active sliders");
  }
}

// Get a single slider by ID
export async function getSliderById(id: string): Promise<SliderType | null> {
  try {
    await connectDB();
    const slider = await Slider.findById(id);

    if (!slider) {
      return null;
    }

    return {
      _id: slider._id.toString(),
      type: slider.type || "text",
      title: slider.title,
      content: slider.content,
      image: slider.image,
      link: slider.link,
      buttonText: slider.buttonText,
      order: slider.order,
      isActive: slider.isActive,
      gameData: slider.gameData ? {
        homeTeamName: slider.gameData.homeTeamName || "",
        homeTeamLogo: slider.gameData.homeTeamLogo || "",
        awayTeamName: slider.gameData.awayTeamName || "",
        awayTeamLogo: slider.gameData.awayTeamLogo || "",
        leagueLogo: slider.gameData.leagueLogo || "",
        matchDate: formatMatchDate(slider.gameData.matchDate),
        matchTime: slider.gameData.matchTime || "",
        matchLocation: slider.gameData.matchLocation || "",
        leftPlayerImage: slider.gameData.leftPlayerImage || "",
        rightPlayerImage: slider.gameData.rightPlayerImage || "",
      } : undefined,
      fixtureId: slider.fixtureId?.toString(),
      createdAt: slider.createdAt.toISOString(),
      updatedAt: slider.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching slider by ID:", error);
    return null;
  }
}

// Upload background image to Cloudinary
export async function uploadSliderImage(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
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
      folder: 'eagles-fc/sliders',
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

// Upload logo (team/league) to Cloudinary
export async function uploadSliderLogo(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
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
      folder: 'eagles-fc/sliders/logos',
      resource_type: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Error uploading logo:", error);
    return {
      success: false,
      message: error.message || "Failed to upload logo"
    };
  }
}

// Create a new slider
export async function createSlider(data: SliderFormData): Promise<{ success: boolean; message: string; slider?: SliderType }> {
  try {
    await connectDB();

    const slider = await Slider.create(data);

    revalidatePath('/admin/sliders');
    revalidatePath('/');

    return {
      success: true,
      message: "Slider created successfully",
      slider: JSON.parse(JSON.stringify(slider))
    };
  } catch (error: any) {
    console.error("Error creating slider:", error);
    return {
      success: false,
      message: error.message || "Failed to create slider"
    };
  }
}

// Update a slider
export async function updateSlider(id: string, data: Partial<SliderFormData>): Promise<{ success: boolean; message: string; slider?: SliderType }> {
  try {
    await connectDB();

    // Build the update object with dot notation for nested gameData fields
    // This ensures MongoDB properly updates nested subdocument fields
    const updateData: Record<string, unknown> = {};

    // Copy top-level fields
    if (data.type !== undefined) updateData.type = data.type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.link !== undefined) updateData.link = data.link;
    if (data.buttonText !== undefined) updateData.buttonText = data.buttonText;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Handle gameData with dot notation for each field
    if (data.gameData) {
      updateData["gameData.homeTeamName"] = data.gameData.homeTeamName || "";
      updateData["gameData.homeTeamLogo"] = data.gameData.homeTeamLogo || "";
      updateData["gameData.awayTeamName"] = data.gameData.awayTeamName || "";
      updateData["gameData.awayTeamLogo"] = data.gameData.awayTeamLogo || "";
      updateData["gameData.leagueLogo"] = data.gameData.leagueLogo || "";
      updateData["gameData.matchDate"] = data.gameData.matchDate || null;
      updateData["gameData.matchTime"] = data.gameData.matchTime || "";
      updateData["gameData.matchLocation"] = data.gameData.matchLocation || "";
      updateData["gameData.leftPlayerImage"] = data.gameData.leftPlayerImage || "";
      updateData["gameData.rightPlayerImage"] = data.gameData.rightPlayerImage || "";
    }

    const slider = await Slider.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!slider) {
      return {
        success: false,
        message: "Slider not found"
      };
    }

    revalidatePath('/admin/sliders');
    revalidatePath('/');

    return {
      success: true,
      message: "Slider updated successfully",
      slider: JSON.parse(JSON.stringify(slider))
    };
  } catch (error: any) {
    console.error(`Error updating slider with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to update slider with ID ${id}`
    };
  }
}

// Delete a slider
export async function deleteSlider(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    // Get the slider to find the image URL
    const slider = await Slider.findById(id);

    if (!slider) {
      return { success: false, message: "Slider not found" };
    }

    // Extract public_id from Cloudinary URL if it exists
    if (slider.image && slider.image.includes('cloudinary')) {
      try {
        const urlParts = slider.image.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `eagles-fc/sliders/${filenameWithExtension.split('.')[0]}`;

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with slider deletion even if image deletion fails
      }
    }

    // Delete the slider
    await Slider.findByIdAndDelete(id);

    revalidatePath('/admin/sliders');
    revalidatePath('/');

    return { success: true, message: "Slider deleted successfully" };
  } catch (error: any) {
    console.error(`Error deleting slider with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to delete slider with ID ${id}`
    };
  }
}

// Update slider order
export async function updateSliderOrder(id: string, order: number): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    await Slider.findByIdAndUpdate(id, { order });

    revalidatePath('/admin/sliders');
    revalidatePath('/');

    return { success: true, message: "Slider order updated successfully" };
  } catch (error: any) {
    console.error(`Error updating slider order:`, error);
    return {
      success: false,
      message: error.message || "Failed to update slider order"
    };
  }
}
