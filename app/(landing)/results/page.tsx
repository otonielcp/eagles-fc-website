import ResultsData from '@/components/landing/ResultsData';
import NavbarFix from '@/components/landing/NavbarFix';

export const metadata = {
  title: 'Results | Eagles FC',
  description: 'View recent match results for Eagles FC',
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
