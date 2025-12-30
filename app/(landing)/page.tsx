import HeroSection from '@/components/landing/HeroSection';
import DynamicLatestNews from '@/components/news/DynamicLatestNews';
import CoreValues from '@/components/landing/CoreValues';
import Program from '@/components/landing/Program';
import GameResult from '@/components/landing/GameResult';
import Standing from '@/components/landing/Standing';
import TopProducts from '@/components/landing/TopProducts';
import Matches from '@/components/landing/Matches';

const HomePage = () => {
  return (
    <div className="max-w-full overflow-hidden">

      <HeroSection />

      <Matches />
      <DynamicLatestNews />

      <CoreValues />
      <Program />
      <GameResult />
      <Standing isHomePage={true} />
      <TopProducts />

    </div>
  );
};

export default HomePage;
