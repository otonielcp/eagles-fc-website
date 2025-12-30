import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  news: News;
  variant?: 'large' | 'medium' | 'small';
}

export default function NewsCard({ news, variant = 'medium' }: NewsCardProps) {
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(news.publishDate), { addSuffix: false });
  const timeDisplay = `${formattedDate} | ${news.category}`;

  if (variant === 'large') {
    return (
      <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image */}
        <div className="w-full sm:w-1/2 relative h-64 sm:h-auto">
          <img
            src={news.image}
            alt={news.title}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="w-full sm:w-1/2 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bebas uppercase mb-2">{news.title}</h3>
            <p
              className="text-sm text-gray-600 mb-2"
              dangerouslySetInnerHTML={{ __html: news.summary }}
            ></p>
          </div>
          <span className="text-xs text-gray-700">{timeDisplay}</span>
        </div>
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden relative flex flex-col h-80">
        {/* Image */}
        <div className="w-full h-44 sm:h-28 relative">
          <img
            src={news.image}
            alt={news.title}
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-sm font-semibold mb-1">{news.title}</h3>
            <p
              className="text-xs text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: news.summary }}
            ></p>
          </div>
        </div>

        {/* Time - Positioned in Bottom-Left */}
        <span className="text-xs text-gray-700 absolute bottom-2 left-2">
          {timeDisplay}
        </span>
      </div>
    );
  }

  // Default medium variant
  return (
    <Link href={`/news/${news._id}`} className="block">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48">
          <img
            src={news.image}
            alt={news.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {news.isFeatured && (
            <span className="absolute top-2 right-2 bg-[#C5A464] text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-medium mb-2">{news.title}</h3>
          <p
            className="text-sm text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: news.summary }}
          ></p>
          <span className="text-xs text-gray-500 mt-auto">{timeDisplay}</span>
        </div>
      </div>
    </Link>
  );
} 