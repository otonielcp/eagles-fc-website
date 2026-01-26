import HeroSection from '@/components/landing/HeroSection';
import LatestNews from '@/components/landing/LatestNews';
import CoreValues from '@/components/landing/CoreValues';
import Program from '@/components/landing/Program';
import GameResult from '@/components/landing/GameResult';
import Standing from '@/components/landing/Standing';
import TopProducts from '@/components/landing/TopProducts';
import Matches from '@/components/landing/Matches';
import { getActiveSliders } from '@/actions/slider';

export default async function HomePage() {
  const sliders = await getActiveSliders();
  const initialSlides = sliders.map((s) => ({
    type: (s.type || 'text') as 'text' | 'game',
    title: (s.title ?? '').toUpperCase(),
    content: s.content ?? '',
    image: s.image?.trim() ?? '',
    link: s.link ?? '/',
    buttonText: s.buttonText ?? 'READ MORE',
    _id: s._id,
    gameData: s.gameData,
  }));

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
