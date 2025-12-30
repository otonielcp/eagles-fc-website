import DynamicLatestNews from '@/components/news/DynamicLatestNews';
import FeaturedNewsList from '@/components/news/FeaturedNewsList';
import NewsletterBanner from '@/components/landing/NewsLetterBanner';
import LatestVideos from '@/components/landing/LatestVideos';
import MissedIt from '@/components/news/MissedIt';

export const metadata = {
  title: 'News | Eagles Football Club',
  description: 'Latest news and updates from Eagles Football Club',
};

export default function NewsPage() {
  return (
    <div>
      <DynamicLatestNews />
      <NewsletterBanner />
      <LatestVideos />
      <MissedIt />
    </div>
  );
}
  