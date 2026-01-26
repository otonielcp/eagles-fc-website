import { getFixtureById } from '@/actions/fixture';
import { MatchReportHero } from '@/components/landing/MatchReportHero';
import { MatchReportTimeline } from '@/components/landing/MatchReportTimeline';
import { MatchReportSummary } from '@/components/landing/MatchReportSummary';
import MatchReportData from '@/components/landing/MatchReportData';

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
      {/* Modern Hero Section */}
      <MatchReportHero fixture={fixture} />

      {/* Vertical Timeline */}
      <MatchReportTimeline fixture={fixture} />

      {/* Match Statistics */}
      <MatchReportSummary fixture={fixture} />

      {/* Match Report Content (keep existing component for written report) */}
      <MatchReportData fixture={fixture} />
    </div>
  );
};

export default MatchReport;
