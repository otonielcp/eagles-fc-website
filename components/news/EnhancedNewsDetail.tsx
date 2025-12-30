"use client"
import { useEffect, useState } from 'react';
import { News } from '@/types/news';
import { Facebook, Twitter, Mail, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import DynamicLatestNews from './DynamicLatestNews';
import Head from 'next/head';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton
} from 'react-share';
import RichTextUser from "@/components/richtexteditor/RichTextUser"; // Import the reusable component

export default function EnhancedNewsDetail({ news }: { news: News }) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const publishDate = format(new Date(news.publishDate), 'dd MMMM yyyy');
  const contentParagraphs = news.content.split('\n').filter(p => p.trim() !== '');

  const NewsHero = () => {
    return (
      <div
        className="relative w-full h-[755px] bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${news.image})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 opacity-0"></div>

        {/* Vignette (Gradient Fade from Bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>

        {/* Text Content */}
        <div className="relative mb-12 w-full px-8 py-6 text-center text-white">
          <h1 className="text-7xl md:text-5xl font-bebas uppercase">{news.title}</h1>
        </div>
      </div>
    );
  };

  // Article Content
  const NewsContent = () => (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar with Share */}
        <div className="md:w-16 flex flex-row md:flex-col gap-4 mb-6 md:mb-0 order-2 md:order-1">
          <div className="text-xs text-gray-500 uppercase hidden md:block mb-2">SHARE</div>
          <div className="flex md:flex-col gap-4">
            <FacebookShareButton url={currentUrl}>
              <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#181819' }}>
                <Facebook size={18} className="text-white" />
              </button>
            </FacebookShareButton>
            <TwitterShareButton url={currentUrl} title={`${news.title} - Eagles Football Club`}>
              <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#181819' }}>
                <Twitter size={18} className="text-white" />
              </button>
            </TwitterShareButton>
            <EmailShareButton
              url={currentUrl}
              subject={`Check out this article: ${news.title}`}
              body={`I thought you might be interested in this article from Eagles Football Club:\n\n${news.title}\n\n${news.summary}\n\n${currentUrl}\n\nPublished on ${publishDate} by ${news.author}`}
            >
              <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Mail size={18} className="text-gray-600" />
              </button>
            </EmailShareButton>
            <LinkedinShareButton url={currentUrl} title={news.title} summary={news.summary}>
              <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#181819' }}>
                <Linkedin size={18} className="text-white" />
              </button>
            </LinkedinShareButton>
          </div>
        </div>

        {/* Main Article Content */}
        <article className="flex-1 order-1 md:order-2">
          {/* Content */}
          {/* Replace this entire div block */}
          <RichTextUser
            content={contentParagraphs.join('<br><br>')}
            className="prose prose-lg max-w-none" />
          {/* Author info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-2">About the Author</h3>
            <p className="text-sm text-gray-600">
              Articles by {news.author} cover the latest news and insights for Eagles Football Club.
            </p>
          </div>
        </article>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.summary} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={news.image || '/default.jpg'} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Eagles Football Club" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={news.summary} />
        <meta name="twitter:image" content={news.image || '/default.jpg'} />
      </Head>
      <div className="bg-gray-50">
        <NewsHero />
        <NewsContent />
        <DynamicLatestNews />
      </div>
    </>
  );
}