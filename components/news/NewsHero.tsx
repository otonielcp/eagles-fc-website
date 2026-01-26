'use client';

import { useEffect, useState } from 'react';
import { getPublishedNews } from '@/actions/news';
import { News } from '@/types/news';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function NewsHero() {
  const [news, setNews] = useState<News[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const newsData = await getPublishedNews();
        setNews(newsData.slice(0, 5)); // Get top 5 news for slider
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % news.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [news.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  if (loading) {
    return (
      <div className="relative w-full h-[600px] bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD9B58]"></div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="relative w-full bg-black py-20 md:py-28">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bebas font-black uppercase tracking-wider leading-none text-white">
            LATEST NEWS
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black">
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent z-30"></div>

      {/* Slides */}
      {news.map((item, index) => (
        <div
          key={item._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={item.image || '/footerimage.jpeg'}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center z-20">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-3xl">
                {/* Category */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
                  <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">
                    {item.category || 'News'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-black text-white uppercase tracking-wider leading-tight mb-6">
                  {item.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 line-clamp-3">
                  {item.summary}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-8 text-gray-400 text-sm">
                  <span className="uppercase tracking-wider">
                    {formatDistanceToNow(new Date(item.publishDate || item.createdAt), { addSuffix: true })}
                  </span>
                  {item.author && (
                    <>
                      <span>•</span>
                      <span className="uppercase tracking-wider">By {item.author}</span>
                    </>
                  )}
                </div>

                {/* Read More Button */}
                <Link
                  href={`/news/${item.slug}`}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black font-bold text-lg px-8 py-4 transition-all duration-500 shadow-[0_0_30px_rgba(189,155,88,0.3)] hover:shadow-[0_0_50px_rgba(189,155,88,0.6)] uppercase tracking-wider"
                >
                  Read Full Story
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {news.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-[#BD9B58] border border-[#BD9B58]/30 hover:border-[#BD9B58] transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-[#BD9B58] border border-[#BD9B58]/30 hover:border-[#BD9B58] transition-all duration-300 group"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {news.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-12 h-2 bg-[#BD9B58]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom gold accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent z-30"></div>
    </div>
  );
}
