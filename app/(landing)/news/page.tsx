import { Suspense } from 'react';
import DynamicLatestNews from '@/components/news/DynamicLatestNews';
import MainSponsorBanner from '@/components/landing/MainSponsorBanner';
import LatestVideos from '@/components/landing/LatestVideos';
import NewsHero from '@/components/news/NewsHero';

export const metadata = {
  title: 'News | Eagles Football Club',
  description: 'Latest news and updates from Eagles Football Club',
};

export default function NewsPage() {
  return (
    <div className="bg-white">
      <NewsHero />
      <DynamicLatestNews />
      <LatestVideos />
      <Suspense fallback={
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 py-16">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD9B58]"></div>
          </div>
        </div>
      }>
        <MainSponsorBanner />
      </Suspense>
    </div>
  );
}
  