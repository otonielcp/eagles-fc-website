import ResultsData from '@/components/landing/ResultsData';
import NavbarFix from '@/components/landing/NavbarFix';

const Results = () => {
  return (
    <div className="max-w-full overflow-hidden">
      {/* Navbar */}
      <NavbarFix />
      <ResultsData />
    </div>
  );
};

export default Results;
