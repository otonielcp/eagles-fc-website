'use server'

import connectDB from '@/lib/dbConnect';
import Video from '@/models/Videos';
import { revalidatePath } from 'next/cache';
import { Video as VideoType, VideoFormData } from '@/types/video';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all videos
export async function getAllVideos(): Promise<VideoType[]> {
  try {
    await connectDB();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Failed to fetch videos");
  }
}

// Get active videos
export async function getActiveVideos(): Promise<VideoType[]> {
  try {
    await connectDB();
    const videos = await Video.find({ isActive: true }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Error fetching active videos:", error);
    throw new Error("Failed to fetch active videos");
  }
}

// Get a single video by ID
export async function getVideoById(id: string): Promise<VideoType | null> {
  try {
    await connectDB();
    const video = await Video.findById(id);

    if (!video) {
      return null;
    }

    return {
      _id: video._id.toString(),
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      isActive: video.isActive,
      createdAt: video.createdAt.toISOString(),
      updatedAt: video.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching video by ID:", error);
    return null;
  }
}

// Upload thumbnail to Cloudinary
export async function uploadVideoThumbnail(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
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
      folder: 'eagles-fc/videos',
      resource_type: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Error uploading thumbnail:", error);
    return {
      success: false,
      message: error.message || "Failed to upload thumbnail"
    };
  }
}

// Create a new video
export async function createVideo(data: VideoFormData): Promise<{ success: boolean; message: string; video?: VideoType }> {
  try {
    await connectDB();

    const video = await Video.create(data);

    revalidatePath('/admin/videos');
    revalidatePath('/videos');

    return {
      success: true,
      message: "Video created successfully",
      video: JSON.parse(JSON.stringify(video))
    };
  } catch (error: any) {
    console.error("Error creating video:", error);
    return {
      success: false,
      message: error.message || "Failed to create video"
    };
  }
}

// Update a video
export async function updateVideo(id: string, data: Partial<VideoFormData>): Promise<{ success: boolean; message: string; video?: VideoType }> {
  try {
    await connectDB();

    const video = await Video.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!video) {
      return {
        success: false,
        message: "Video not found"
      };
    }

    revalidatePath('/admin/videos');
    revalidatePath('/videos');
    revalidatePath(`/videos/${id}`);

    return {
      success: true,
      message: "Video updated successfully",
      video: JSON.parse(JSON.stringify(video))
    };
  } catch (error: any) {
    console.error(`Error updating video with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to update video with ID ${id}`
    };
  }
}

// Delete a video
export async function deleteVideo(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    // Get the video to find the thumbnail URL
    const video = await Video.findById(id);

    if (!video) {
      return { success: false, message: "Video not found" };
    }

    // Extract public_id from Cloudinary URL if it exists
    if (video.thumbnailUrl && video.thumbnailUrl.includes('cloudinary')) {
      try {
        const urlParts = video.thumbnailUrl.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `eagles-fc/videos/${filenameWithExtension.split('.')[0]}`;

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting thumbnail from Cloudinary:", cloudinaryError);
        // Continue with video deletion even if thumbnail deletion fails
      }
    }

    // Delete the video
    await Video.findByIdAndDelete(id);

    revalidatePath('/admin/videos');
    revalidatePath('/videos');

    return { success: true, message: "Video deleted successfully" };
  } catch (error: any) {
    console.error(`Error deleting video with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to delete video with ID ${id}`
    };
  }
}

// Get latest videos
export async function getLatestVideos(limit: number = 6): Promise<VideoType[]> {
  try {
    await connectDB();
    const videos = await Video.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Error fetching latest videos:", error);
    return [];
  }
}
