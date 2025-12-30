import MatchReportData from '@/components/landing/MatchReportData';
import MatchTimeline from '@/components/landing/MatchTimeline';
import { getFixtureById } from '@/actions/fixture';
import GameResultHero from '@/components/landing/GameResultHero';

const MatchReport = async ({
  params
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params;
  const fixture = await getFixtureById(id);

  if (!fixture) {
    return <div className="text-center text-2xl h-[80vh] flex items-center justify-center font-bold">Fixture not found</div>;
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* <GameResult /> */}
      <GameResultHero result={fixture} />

      <MatchTimeline fixture={fixture} />

      <MatchReportData fixture={fixture} />
    </div>
  );
};

export default MatchReport;
