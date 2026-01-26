'use client';

import { useEffect, useState, useRef } from 'react';
import { News } from '@/types/news';
import { getPublishedNews } from '@/actions/news';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import gsap from 'gsap';
// Temporarily disabled Three.js to fix 500 error
// import dynamic from 'next/dynamic';
// const SoccerScene = dynamic(() => import('@/components/news/SoccerScene'), {
//   ssr: false,
//   loading: () => null
// });

export default function DynamicLatestNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const newsData = await getPublishedNews();
        setNews(newsData);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // GSAP Animation on mount
  useEffect(() => {
    if (!loading && news.length > 0 && cardsRef.current) {
      gsap.from(cardsRef.current.querySelectorAll('.news-card'), {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3
      });
    }
  }, [loading, news]);

  if (loading) {
    return (
      <div className="w-full py-16 relative overflow-hidden bg-gray-50">
        <div className="relative z-10 flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD9B58]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 relative overflow-hidden bg-gray-50">
        <div className="relative z-10 text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="w-full py-16 relative overflow-hidden bg-gray-50">
        <div className="relative z-10 text-center py-12">
          <p className="text-gray-600">No news articles available.</p>
        </div>
      </div>
    );
  }

  // Featured News Component - Full-width banner with text overlay
  const FeaturedNews = ({ item }: { item: News }) => {
    const formattedDate = formatDistanceToNow(new Date(item.publishDate), { addSuffix: false });
    return (
      <Link href={`/news/${item._id}`} className="block group news-card">
        <div className="overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl h-full min-h-[450px] group relative bg-black">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={item.image}
              alt={item.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>

          {/* Top gold accent line */}
          <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] transition-all duration-500 group-hover:w-full z-20"></div>

          {/* Text Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <div className="max-w-4xl">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#BD9B58] bg-[#BD9B58]/10 px-3 py-1 backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              {/* Title - Large bold white text */}
              <h3 className="text-3xl md:text-4xl font-bebas font-black uppercase mb-4 text-white leading-tight tracking-wider">
                {item.title}
              </h3>

              {/* Description - White text */}
              <p
                className="text-white/90 text-base leading-relaxed mb-6 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: item.summary.slice(0, 150) + "..."
                }}
              ></p>

              {/* Metadata at bottom */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80 font-semibold uppercase tracking-wide">
                  {formattedDate}
                </span>
                <div className="w-12 h-12 bg-[#BD9B58] group-hover:bg-[#D4AF37] flex items-center justify-center transition-all duration-300">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#BD9B58] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
        </div>
      </Link>
    );
  };

  // Small News Card Component - Clean white card design
  const SmallNewsCard = ({ item }: { item: News }) => {
    const formattedDate = formatDistanceToNow(new Date(item.publishDate), { addSuffix: false });

    return (
      <Link href={`/news/${item._id}`} className="block group news-card">
        <div className="bg-white overflow-hidden flex flex-col transition-all duration-500 shadow-lg hover:shadow-2xl border border-gray-200 hover:border-[#BD9B58] h-full group relative">
          {/* Top gold accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] w-0 group-hover:w-full transition-all duration-500"></div>

          {/* Image Section */}
          <div className="relative w-full h-56 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            {/* Category Badge Overlay */}
            <div className="absolute top-4 left-4">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-[#BD9B58] px-3 py-1">
                {item.category}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="text-xl font-bebas font-bold uppercase mb-3 text-black group-hover:text-[#BD9B58] transition-colors duration-300 line-clamp-2 leading-tight tracking-wider">
              {item.title}
            </h3>

            {/* Description */}
            <p
              className="text-sm text-gray-700 line-clamp-3 leading-relaxed mb-4 flex-grow"
              dangerouslySetInnerHTML={{ __html: item.summary }}
            ></p>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  {formattedDate}
                </span>
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#BD9B58] flex items-center justify-center transition-all duration-300">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom corner accent */}
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#BD9B58] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>
    );
  };

  // Skip first 5 articles (they're in the slider)
  const remainingNews = news.slice(5);

  if (remainingNews.length === 0) {
    return null; // Don't show this section if no remaining news
  }

  return (
    <div className="w-full py-20 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6" ref={cardsRef}>
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
            <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">More Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas font-black text-black uppercase tracking-wider">
            ALL <span className="text-[#BD9B58]">NEWS</span>
          </h2>
        </div>

        {/* Remaining Articles in Clean 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingNews.map(newsItem => (
            <SmallNewsCard key={newsItem._id} item={newsItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
