'use client';

import { useEffect, useState } from 'react';
import { News } from '@/types/news';
import { getLatestNews } from '@/actions/news';
import NewsCard from './NewsCard';

export default function LatestNewsList({ limit = 6 }: { limit?: number }) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const newsData = await getLatestNews(limit);
        setNews(newsData);
      } catch (err) {
        console.error('Error fetching latest news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    fetchLatestNews();
  }, [limit]);

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
        <p>No news articles available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-32 py-12">
      {/* Accent Line & Title */}
      <div className="w-16 h-[3px] bg-[#C5A464] mb-4"></div>
      <h2 className="text-2xl mb-6">LATEST NEWS</h2>

      {/* Upper News Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {news.slice(0, 2).map((newsItem) => (
          <NewsCard key={newsItem._id} news={newsItem} variant="large" />
        ))}
      </div>

      {/* Lower News Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.slice(2).map((newsItem) => (
          <NewsCard key={newsItem._id} news={newsItem} variant="small" />
        ))}
      </div>
    </div>
  );
} 