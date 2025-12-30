'use client';

import { useEffect, useState } from 'react';
import { News } from '@/types/news';
import { getFeaturedNews } from '@/actions/news';
import NewsCard from './NewsCard';

export default function FeaturedNewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedNews() {
      try {
        const newsData = await getFeaturedNews();
        setNews(newsData);
      } catch (err) {
        console.error('Error fetching featured news:', err);
        setError('Failed to load featured news');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p>No featured news available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-32 py-12">
      {/* Accent Line & Title */}
      <div className="w-16 h-[3px] bg-[#C5A464] mb-4"></div>
      <h2 className="text-2xl mb-6">FEATURED NEWS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((newsItem) => (
          <NewsCard key={newsItem._id} news={newsItem} />
        ))}
      </div>
    </div>
  );
} 