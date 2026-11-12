import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFixtureById } from '@/actions/fixture';
import { getFutbolCoreFixtureById } from '@/actions/futbolcore';
import { MatchReportHero } from '@/components/landing/MatchReportHero';
import { MatchReportTimeline } from '@/components/landing/MatchReportTimeline';
import { MatchReportSummary } from '@/components/landing/MatchReportSummary';
import MatchReportData from '@/components/landing/MatchReportData';

type MatchReportProps = {
  params: Promise<{
    id: string
  }>
};

// Try MongoDB first, then fall back to FutbolCore. Cached so generateMetadata
// and the page share one lookup per request.
const getMatch = cache(async (id: string) => {
  const fixture = await getFixtureById(id);
  return fixture ?? (await getFutbolCoreFixtureById(id));
});

export async function generateMetadata({ params }: MatchReportProps): Promise<Metadata> {
  const { id } = await params;
  const fixture = await getMatch(id);
  if (!fixture) return { title: 'Match Not Found' };

  const matchup = `${fixture.homeTeam} vs ${fixture.awayTeam}`;
  const date = fixture.date ? String(fixture.date).split('T')[0] : '';
  const details = [fixture.competition, date].filter(Boolean).join(', ');
  return {
    title: `${matchup} Match Report`,
    description: `Match report for ${matchup}${details ? ` (${details})` : ''}: score, timeline and stats from Eagles FC in Grand Island, Nebraska.`,
  };
}

const MatchReport = async ({ params }: MatchReportProps) => {
  const { id } = await params;

  const fixture = await getMatch(id);

  if (!fixture) {
    notFound();
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
