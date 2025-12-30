'use server'

import connectDB from '@/lib/dbConnect';
import News from '@/models/News';
import { revalidatePath } from 'next/cache';
import { News as NewsType, NewsFormData } from '@/types/news';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all news
export async function getAllNews(): Promise<NewsType[]> {
  try {
    await connectDB();
    const news = await News.find({}).sort({ publishDate: -1 });
    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news");
  }
}

// Get published news
export async function getPublishedNews(): Promise<NewsType[]> {
  try {
    await connectDB();
    const news = await News.find({ isPublished: true }).sort({ publishDate: -1 });
    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error("Error fetching published news:", error);
    throw new Error("Failed to fetch published news");
  }
}

// Get featured news
export async function getFeaturedNews(): Promise<NewsType[]> {
  try {
    await connectDB();
    const news = await News.find({ isPublished: true, isFeatured: true }).sort({ publishDate: -1 });
    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error("Error fetching featured news:", error);
    throw new Error("Failed to fetch featured news");
  }
}

// Get news by category
export async function getNewsByCategory(category: string): Promise<NewsType[]> {
  try {
    await connectDB();
    const news = await News.find({ isPublished: true, category }).sort({ publishDate: -1 });
    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error(`Error fetching news in category ${category}:`, error);
    throw new Error(`Failed to fetch news in category ${category}`);
  }
}

// Get a single news by ID
export async function getNewsById(id: string): Promise<NewsType | null> {
  try {
    await connectDB();
    const news = await News.findById(id);

    if (!news) {
      return null;
    }

    return {
      _id: news._id.toString(),
      title: news.title,
      content: news.content,
      summary: news.summary,
      image: news.image,
      author: news.author,
      category: news.category,
      isPublished: news.isPublished,
      isFeatured: news.isFeatured,
      publishDate: news.publishDate.toISOString(),
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    return null;
  }
}

// Upload image to Cloudinary
export async function uploadNewsImage(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
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
      folder: 'eagles-fc/news',
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

// Create a new news article
export async function createNews(data: NewsFormData): Promise<{ success: boolean; message: string; news?: NewsType }> {
  try {
    await connectDB();

    const news = await News.create(data);

    revalidatePath('/admin/news');
    revalidatePath('/news');

    return {
      success: true,
      message: "News created successfully",
      news: JSON.parse(JSON.stringify(news))
    };
  } catch (error: any) {
    console.error("Error creating news:", error);
    return {
      success: false,
      message: error.message || "Failed to create news"
    };
  }
}

// Update a news article
export async function updateNews(id: string, data: Partial<NewsFormData>): Promise<{ success: boolean; message: string; news?: NewsType }> {
  try {
    await connectDB();

    const news = await News.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    );

    if (!news) {
      return {
        success: false,
        message: "News not found"
      };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    revalidatePath(`/news/${id}`);

    return {
      success: true,
      message: "News updated successfully",
      news: JSON.parse(JSON.stringify(news))
    };
  } catch (error: any) {
    console.error(`Error updating news with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to update news with ID ${id}`
    };
  }
}

// Delete a news article
export async function deleteNews(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    // Get the news to find the image URL
    const news = await News.findById(id);

    if (!news) {
      return { success: false, message: "News not found" };
    }

    // Extract public_id from Cloudinary URL if it exists
    if (news.image && news.image.includes('cloudinary')) {
      try {
        const urlParts = news.image.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `eagles-fc/news/${filenameWithExtension.split('.')[0]}`;

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with news deletion even if image deletion fails
      }
    }

    // Delete the news
    await News.findByIdAndDelete(id);

    revalidatePath('/admin/news');
    revalidatePath('/news');

    return { success: true, message: "News deleted successfully" };
  } catch (error: any) {
    console.error(`Error deleting news with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to delete news with ID ${id}`
    };
  }
}

// Get related news
export async function getRelatedNews(newsId: string, category: string, limit: number = 3): Promise<NewsType[]> {
  try {
    await connectDB();

    // Find news in the same category, excluding the current news
    const relatedNews = await News.find({
      _id: { $ne: newsId },
      category: category,
      isPublished: true
    })
      .limit(limit)
      .sort({ publishDate: -1 });

    return relatedNews.map(news => ({
      _id: news._id.toString(),
      title: news.title,
      content: news.content,
      summary: news.summary,
      image: news.image,
      author: news.author,
      category: news.category,
      isPublished: news.isPublished,
      isFeatured: news.isFeatured,
      publishDate: news.publishDate.toISOString(),
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching related news:", error);
    return [];
  }
}

// Get latest news
export async function getLatestNews(limit: number = 6): Promise<NewsType[]> {
  try {
    await connectDB();
    const news = await News.find({ isPublished: true })
      .sort({ publishDate: -1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }
} 