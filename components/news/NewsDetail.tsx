'use client';

import { useEffect, useState } from 'react';
import { News } from '@/types/news';
import { getNewsById, getRelatedNews } from '@/actions/news';
import Image from 'next/image';
import { Facebook, Twitter, Mail, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import NewsCard from './NewsCard';

interface NewsDetailProps {
  id: string;
}

export default function NewsDetail({ id }: NewsDetailProps) {
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsData() {
      try {
        const newsData = await getNewsById(id);
        if (!newsData) {
          setError('News article not found');
          return;
        }

        setNews(newsData);

        // Fetch related news
        if (newsData.category) {
          const related = await getRelatedNews(id, newsData.category);
          setRelatedNews(related);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news article');
      } finally {
        setLoading(false);
      }
    }

    fetchNewsData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'News article not found'}</p>
      </div>
    );
  }

  const publishDate = format(new Date(news.publishDate), 'dd MMMM yyyy');

  // Split content into paragraphs
  const contentParagraphs = news.content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-16 py-8">
      {/* Hero Image */}
      <div className="w-full h-[400px] relative mb-8">
        <img
          src={news.image}
          alt={news.title}
          className="object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar with Metadata and Share */}
        <div className="md:w-48 flex flex-col gap-4">
          {/* Metadata */}
          <div className="text-xs text-gray-500 uppercase">
            <p>PUBLISHED · {publishDate}</p>
            <p>by {news.author}</p>
          </div>

          {/* Borderline */}
          <div className="border-t mt-8 border-gray-200"></div>

          {/* Share Buttons */}
          <div>
            <p className="text-xs text-gray-500 uppercase mb-2">SHARE</p>
            <div className="flex gap-4 flex-wrap">
              <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#181819' }}>
                <Facebook size={16} className="text-white" />
              </button>
              <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#181819' }}>
                <Twitter size={16} className="text-white" />
              </button>
              <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <Mail size={16} className="text-gray-600" />
              </button>
              <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#181819' }}>
                <Linkedin size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Article Content */}
        <article className="flex-1">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {news.title}
          </h1>

          {/* Content */}
          <div className="space-y-4 mb-8">
            {contentParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-700 mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: paragraph,
                }}
              ></p>

            ))}
          </div>
        </article>
      </div>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <div className="mt-16">
          <div className="w-16 h-[3px] bg-[#C5A464] mb-4"></div>
          <h2 className="text-2xl mb-6">RELATED NEWS</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map(newsItem => (
              <NewsCard key={newsItem._id} news={newsItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 