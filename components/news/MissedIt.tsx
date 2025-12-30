'use client';

import { useEffect, useState } from 'react';
import { News } from '@/types/news';
import { getPublishedNews } from '@/actions/news';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow, subDays, isWithinInterval } from 'date-fns';

const MissedIt = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const allNews = await getPublishedNews();

        // Filter for news that's around a day old (between 16-32 hours old)
        const now = new Date();
        const yesterday = subDays(now, 1);
        const twoDaysAgo = subDays(now, 2);

        const dayOldNews = allNews.filter(item => {
          const publishDate = new Date(item.publishDate);
          return isWithinInterval(publishDate, {
            start: twoDaysAgo,
            end: yesterday
          });
        });

        // Use the filtered list if available, otherwise fallback to the most recent news
        setNews(dayOldNews.length > 0 ? dayOldNews : allNews.slice(0, 6));
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
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
        <p>No news from yesterday available.</p>
      </div>
    );
  }

  // Featured News Card (for first two items)
  const FeaturedNewsCard = ({ item }: { item: News }) => {
    const formattedDate = formatDistanceToNow(new Date(item.publishDate), { addSuffix: false });
    const timeDisplay = `${formattedDate} | ${item.category}`;

    // Split title into first word + rest of the sentence for styling
    const words = item.title.split(" ");
    const firstWord = words.shift() || "";
    const remainingTitle = words.join(" ");

    return (
      <Link href={`/news/${item._id}`} className="block">
        <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg overflow-hidden h-96">
          {/* Left Side - Image */}
          <div className="w-full h-48 sm:w-1/2 sm:h-full relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>

          {/* Right Side - Text */}
          <div className="w-full sm:w-1/2 p-4 flex flex-col justify-between">
            {/* Title with Accent Line */}
            <h3 className="text-black text-2xl font-bold uppercase">
              <span className="relative inline-block">
                <span className="absolute -top-1 left-0 w-full h-[2px] bg-[#C5A464]"></span>
                <span className="relative">{firstWord}</span>
              </span>{" "}
              {remainingTitle}
            </h3>
            <p
              className="text-gray-600 text-sm mt-2"
              dangerouslySetInnerHTML={{
                __html: item.summary.slice(0, 500) + "..."
              }}
            ></p>
            <p className="text-gray-400 text-xs mt-auto">
              {timeDisplay}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  // Small News Card (for remaining items)
  const SmallNewsCard = ({ item }: { item: News }) => {
    const formattedDate = formatDistanceToNow(new Date(item.publishDate), { addSuffix: false });
    const timeDisplay = `${formattedDate} | ${item.category}`;

    return (
      <Link href={`/news/${item._id}`} className="block">
        <div className="bg-white shadow-lg rounded-lg shadow-md overflow-hidden relative flex flex-col h-96">
          {/* Image */}
          <div className="w-full h-48 relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>

          {/* Content */}
          <div className="p-3 flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
              <p
                className="text-xs text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: item.summary
                }}
              ></p>
            </div>
          </div>

          {/* Time - Positioned in Bottom-Left */}
          <span className="text-xs text-gray-700 absolute bottom-2 left-2">
            {timeDisplay}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full px-4 md:px-28 py-12">
      {/* Header with Accent Line */}
      <div className="mb-6">
        <div className="w-16 h-[2px] bg-[#C5A464] mb-2"></div>
        <h2 className="text-2xl mb-6">IN CASE YOU MISSED IT</h2>
      </div>

      {/* Top Featured News */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {news.slice(0, 2).map((item) => (
          <FeaturedNewsCard key={item._id} item={item} />
        ))}
      </div>

      {/* Smaller News Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.slice(2, 6).map((item) => (
          <SmallNewsCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MissedIt;