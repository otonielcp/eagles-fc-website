'use server'

import connectDB from '@/lib/dbConnect';
import News from '@/models/News';
import Slider from '@/models/Slider';

export async function migrateFeaturedNewsToSliders(): Promise<{ success: boolean; message: string; count: number }> {
  try {
    await connectDB();

    // Get all featured news
    const featuredNews = await News.find({ isPublished: true, isFeatured: true }).sort({ publishDate: -1 });

    if (featuredNews.length === 0) {
      return {
        success: false,
        message: "No featured news found to migrate",
        count: 0
      };
    }

    // Check if sliders already exist
    const existingSliders = await Slider.countDocuments();
    if (existingSliders > 0) {
      return {
        success: false,
        message: `Sliders collection already has ${existingSliders} items. Clear them first if you want to migrate.`,
        count: existingSliders
      };
    }

    // Convert featured news to sliders
    const sliderData = featuredNews.map((news, index) => ({
      title: news.title,
      content: news.summary || news.content.substring(0, 500),
      image: news.image,
      link: `/news/${news._id}`,
      buttonText: "READ MORE",
      order: index,
      isActive: true,
    }));

    // Insert sliders
    await Slider.insertMany(sliderData);

    return {
      success: true,
      message: `Successfully migrated ${sliderData.length} featured news articles to sliders`,
      count: sliderData.length
    };
  } catch (error: any) {
    console.error("Error migrating featured news to sliders:", error);
    return {
      success: false,
      message: error.message || "Failed to migrate featured news to sliders",
      count: 0
    };
  }
}
