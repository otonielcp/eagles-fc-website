import ResultsData from '@/components/landing/ResultsData';
import NavbarFix from '@/components/landing/NavbarFix';
import { getClubResults } from '@/lib/clubGames';

export const metadata = {
  title: 'Results',
  description:
    'View recent match results and scores for Eagles FC youth soccer teams in Grand Island, Nebraska. Full results from league, tournament, and friendly matches.',
  openGraph: {
    title: 'Results | Eagles FC - Grand Island, NE',
    description:
      'View recent match results and scores for Eagles FC youth soccer teams in Grand Island, Nebraska.',
  },
};

// Finished games from FutbolCore for every club team (cached five minutes).
export const revalidate = 300;

export default async function ResultsPage() {
  const results = await getClubResults();

  return (
    <div className="max-w-full overflow-hidden">
      {/* Navbar */}
      <NavbarFix />
      <ResultsData results={results} />
    </div>
  );
}
