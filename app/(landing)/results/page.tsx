import ResultsData from '@/components/landing/ResultsData';
import NavbarFix from '@/components/landing/NavbarFix';

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

export default function ResultsPage() {
  return (
    <div className="max-w-full overflow-hidden">
      {/* Navbar */}
      <NavbarFix />
      <ResultsData />
    </div>
  );
}
