import HeroSection from '@/components/landing/HeroSection';
import LatestNews from '@/components/landing/LatestNews';
import CoreValues from '@/components/landing/CoreValues';
import Program from '@/components/landing/Program';
import GameResult from '@/components/landing/GameResult';
import Standing from '@/components/landing/Standing';
import TopProducts from '@/components/landing/TopProducts';
import Matches from '@/components/landing/Matches';
import { getActiveSliders } from '@/actions/slider';
import { getFeaturedNews } from '@/actions/news';

export default async function HomePage() {
  const [sliders, featuredNews] = await Promise.all([
    getActiveSliders(),
    getFeaturedNews(),
  ]);

  const sliderSlides = sliders.map((s) => ({
    type: (s.type || 'text') as 'text' | 'game',
    title: (s.title ?? '').toUpperCase(),
    content: s.content ?? '',
    image: s.image?.trim() ?? '',
    link: s.link ?? '/',
    buttonText: s.buttonText ?? 'READ MORE',
    _id: s._id,
    gameData: s.gameData,
  }));

  // Featured news articles automatically become hero slides
  const featuredNewsSlides = featuredNews.map((n) => ({
    type: 'text' as const,
    title: (n.title ?? '').toUpperCase(),
    content: n.summary ?? '',
    image: (n.image ?? '').trim(),
    link: `/news/${n._id}`,
    buttonText: 'READ MORE',
    _id: String(n._id),
  }));

  const initialSlides = [...sliderSlides, ...featuredNewsSlides];

  return (
    <div className="max-w-full overflow-hidden">

      <HeroSection initialSlides={initialSlides} />

      <Matches />
      <LatestNews />

      <CoreValues />
      <Program />
      <GameResult />
      <Standing isHomePage={true} />
      <TopProducts />

    </div>
  );
}
