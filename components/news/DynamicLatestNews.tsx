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
  const titleRef = useRef<HTMLDivElement>(null);
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
    if (!loading && news.length > 0 && titleRef.current && cardsRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power3.out"
      });

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
      <div className="w-full pb-20 pt-24 relative overflow-hidden" style={{ backgroundColor: '#282829' }}>
        <div className="relative z-10 flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD9B58]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pb-20 pt-24 relative overflow-hidden" style={{ backgroundColor: '#282829' }}>
        <div className="relative z-10 text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="w-full pb-20 pt-24 relative overflow-hidden" style={{ backgroundColor: '#282829' }}>
        <div className="relative z-10 text-center py-12">
          <p className="text-gray-300">No news articles available.</p>
        </div>
      </div>
    );
  }

  // Featured News Component - Full-width banner with text overlay
  const FeaturedNews = ({ item }: { item: News }) => {
    const formattedDate = formatDistanceToNow(new Date(item.publishDate), { addSuffix: false });
    return (
      <Link href={`/news/${item._id}`} className="block group news-card">
        <div className="rounded-3xl overflow-hidden transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12),0_0_0_1px_rgba(189,155,88,0.1)] h-full min-h-[500px] border hover:border-[#BD9B58]/50 group relative" style={{ backgroundColor: '#181819', borderColor: '#181819' }}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={item.image}
              alt={item.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 opacity-60"
            />
          </div>

          {/* Text Overlay at Bottom-Left */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <div className="max-w-4xl">
              {/* Title - Large bold white text */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bebas uppercase mb-4 text-white leading-tight drop-shadow-2xl">
                {item.title}
              </h3>
              
              {/* Description - White text */}
              <p
                className="text-white/90 text-base md:text-lg leading-relaxed mb-6 line-clamp-2 drop-shadow-lg"
                dangerouslySetInnerHTML={{
                  __html: item.summary.slice(0, 150) + "..."
                }}
              ></p>

              {/* Metadata at bottom */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/75 font-semibold uppercase tracking-wide">
                  {formattedDate} | {item.category}
                </span>
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-gradient-to-r group-hover:from-[#BD9B58] group-hover:to-[#d4b068] border border-white/20 group-hover:border-transparent flex items-center justify-center transition-all duration-500">
                  <svg className="w-5 h-5 text-white group-hover:text-white transform translate-x-0 group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Small News Card Component - Dark header with gold accents, white content section
  const SmallNewsCard = ({ item }: { item: News }) => {
    const formattedDate = formatDistanceToNow(new Date(item.publishDate), { addSuffix: false });

    return (
      <Link href={`/news/${item._id}`} className="block group news-card">
        <div className="backdrop-blur-sm rounded-t-3xl overflow-hidden flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#BD9B58]/20 border hover:border-[#BD9B58]/60 h-full group relative" style={{ backgroundColor: 'rgba(24, 24, 25, 0.8)', borderColor: '#181819' }}>
          {/* Dark Header Section */}
          <div className="relative w-full h-56 overflow-hidden" style={{ backgroundColor: '#181819' }}>
            {/* Background Image */}
            <div className="absolute inset-0">
            <img
              src={item.image}
              alt={item.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 opacity-70"
            />
          </div>
          </div>

          {/* Dark Content Section */}
          <div className="backdrop-blur-sm p-6 flex flex-col flex-grow relative" style={{ backgroundColor: 'rgba(24, 24, 25, 0.8)' }}>
            {/* Category Badge */}
            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#BD9B58]">
                {item.category}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-bold mb-3 text-white group-hover:text-[#BD9B58] transition-colors duration-300 line-clamp-2 leading-tight">
              {item.title}
            </h3>
            
            {/* Description */}
            <p
              className="text-sm text-gray-300 line-clamp-2 leading-relaxed mb-4 flex-grow"
              dangerouslySetInnerHTML={{ __html: item.summary }}
            ></p>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t" style={{ borderColor: '#181819' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  {formattedDate}
                </span>
                <div className="w-8 h-8 rounded-full group-hover:bg-gradient-to-r group-hover:from-[#BD9B58] group-hover:to-[#d4b068] border group-hover:border-transparent flex items-center justify-center transition-all duration-500" style={{ backgroundColor: '#181819', borderColor: '#181819' }}>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transform translate-x-0 group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full pb-20 pt-24 relative overflow-hidden" style={{ backgroundColor: '#282829' }}>
      {/* Three.js Soccer Scene Background - Temporarily disabled */}
      {/* <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ zIndex: 0, height: '100%', width: '100%' }}>
        <div style={{ height: '100%', width: '100%' }}>
          <SoccerScene />
        </div>
      </div> */}
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#BD9B58]/5 via-transparent to-[#BD9B58]/5" style={{ zIndex: 1 }}></div>
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent" style={{ zIndex: 10 }}></div>

      {/* Section Title */}
      <div className="relative text-center mb-16 px-4" style={{ zIndex: 10 }} ref={titleRef}>
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-white uppercase tracking-tight">Latest News</h2>
          <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
        </div>
        <p className="text-gray-300 text-sm uppercase tracking-widest font-medium">Club News & Announcements</p>
      </div>

      <div className="w-full px-4 md:px-6 lg:px-8 relative" style={{ zIndex: 10 }} ref={cardsRef}>

        {/* Top featured news (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-[1600px] mx-auto">
          {news.slice(0, 2).map(newsItem => (
            <FeaturedNews key={newsItem._id} item={newsItem} />
          ))}
        </div>

        {/* Smaller news grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-[1600px] mx-auto">
          {news.slice(2, 6).map(newsItem => (
            <SmallNewsCard key={newsItem._id} item={newsItem} />
          ))}
        </div>

        {/* More News Link */}
        <div className="text-center max-w-7xl mx-auto">
          <a href="/news" className="inline-flex items-center gap-2 text-[#BD9B58] hover:text-[#d4b068] font-bold transition-colors duration-300 group uppercase tracking-wider text-sm">
            <span>View All News</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
