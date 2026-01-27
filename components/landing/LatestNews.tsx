'use client';

import { useEffect, useState } from 'react';
import { News } from '@/types/news';
import { getPublishedNews } from '@/actions/news';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const LatestNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const newsData = await getPublishedNews();
        // Only get first 6 articles for home page preview
        setNews(newsData.slice(0, 6));
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="relative bg-white py-20 overflow-hidden">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }
  return (
    <div className="relative bg-white py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A464' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-8 sm:w-16 h-[2px] bg-gradient-to-r from-transparent to-[#C5A464]"></div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tight">
              Latest News
            </h2>
            <div className="w-8 sm:w-16 h-[2px] bg-gradient-to-l from-transparent to-[#C5A464]"></div>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base uppercase tracking-widest font-semibold">
            Club News & Announcements
          </p>
        </div>

        {/* Featured News - Top 2 Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {news.slice(0, 2).map((newsItem) => {
            const formattedDate = formatDistanceToNow(new Date(newsItem.publishDate), { addSuffix: true });
            return (
              <Link 
                href={`/news/${newsItem._id}`}
                key={newsItem._id}
                className="group bg-white shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 border border-gray-200 hover:border-[#C5A464] transform hover:-translate-y-2"
              >
                <div className="relative">
                  {/* Image */}
                  <div className="relative overflow-hidden h-64 md:h-80">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <h3 className="text-white text-2xl md:text-3xl font-bold uppercase mb-3 leading-tight group-hover:text-[#C5A464] transition-colors duration-300">
                        {newsItem.title}
                      </h3>
                      <p 
                        className="text-white/90 text-sm md:text-base mb-4 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: newsItem.summary.slice(0, 150) + '...' }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-bold text-[#C5A464] uppercase tracking-wider">
                          {formattedDate} | {newsItem.category}
                        </span>
                        <svg className="w-6 h-6 text-[#C5A464] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Grid News - Bottom 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.slice(2).map((newsItem) => {
            const formattedDate = formatDistanceToNow(new Date(newsItem.publishDate), { addSuffix: true });
            return (
              <Link 
                href={`/news/${newsItem._id}`}
                key={newsItem._id}
                className="group bg-white shadow-lg hover:shadow-2xl rounded-xl overflow-hidden transition-all duration-500 border border-gray-200 hover:border-[#C5A464] transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={newsItem.image} 
                    alt={newsItem.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 right-3 w-2 h-2 bg-[#C5A464] rounded-full animate-pulse shadow-lg"></div>
                </div>

                {/* Content */}
                <div className="p-5 bg-gradient-to-b from-white to-gray-50">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#C5A464] transition-colors duration-300 mb-2 line-clamp-2 uppercase">
                    {newsItem.title}
                  </h3>
                  <p 
                    className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: newsItem.summary }}
                  />
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {formattedDate} | {newsItem.category}
                    </span>
                    <svg className="w-5 h-5 text-[#C5A464] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All News Button */}
        <div className="text-center mt-12">
          <a 
            href="/news" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C5A464] to-[#D4B574] hover:from-[#B39355] hover:to-[#C5A464] text-white font-bold text-base md:text-lg px-10 py-4 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            View All News
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
