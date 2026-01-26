"use client";

import Link from "next/link";

interface FixturesDataProps {
  fixtures: any[];
  loading: boolean;
}

const FixturesData: React.FC<FixturesDataProps> = ({ fixtures, loading }) => {
  // Group fixtures by month
  const groupedFixtures = fixtures.reduce((acc: Record<string, any>, match: any) => {
    if (!acc[match.month]) {
      acc[match.month] = [];
    }
    acc[match.month].push(match);
    return acc;
  }, {});

  if (loading) {
    return <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">Loading...</div>;
  }

  if (fixtures.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
        <p className="text-center text-gray-500">No additional upcoming fixtures</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-black uppercase tracking-tight mb-16 text-gray-900 text-center">
        Upcoming Fixtures
      </h2>
      
      {Object.entries(groupedFixtures).map(([month, matches]) => (
        <div key={month} className="mb-20">
          {/* Month Header - Premium Style */}
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="w-12 h-[2px] bg-[#C5A464]"></div>
            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-[#C5A464]">
              {month}
            </h3>
            <div className="w-12 h-[2px] bg-[#C5A464]"></div>
          </div>

          {/* Match Cards - Clean Premium Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match: any, idx: number) => (
              <Link 
                key={idx} 
                href={`/matchreport/${match._id}`}
                className="group block"
              >
                <div className="relative bg-white border-2 border-gray-200 hover:border-[#BD9B58] hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  
                  {/* League Logo - Top */}
                  <div className="h-20 flex items-center justify-center bg-white border-b border-gray-100">
                    <img
                      src={match.leagueLogo}
                      alt="League"
                      className="w-12 h-12 object-contain"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    
                    {/* Date & Time */}
                    <div className="text-center mb-8">
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {match.date}
                      </p>
                      <p className="text-xs text-[#C5A464] font-semibold">
                        {match.time}
                      </p>
                    </div>

                    {/* Teams - Horizontal */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      {/* Team 1 Logo */}
                      <img
                        src={match.team1Logo}
                        alt={match.team1}
                        className="w-16 h-16 object-contain"
                      />

                      {/* VS */}
                      <span className="text-xs font-bold text-gray-400 px-2">VS</span>

                      {/* Team 2 Logo */}
                      <img
                        src={match.team2Logo}
                        alt={match.team2}
                        className="w-16 h-16 object-contain"
                      />
                    </div>

                    {/* Team Names */}
                    <div className="flex items-center justify-center gap-3 text-center mb-6">
                      <span className="text-xs font-bold text-gray-900 flex-1 text-right">
                        {match.team1}
                      </span>
                      <span className="text-gray-300 px-2">-</span>
                      <span className="text-xs font-bold text-gray-900 flex-1 text-left">
                        {match.team2}
                      </span>
                    </div>

                    {/* Stadium */}
                    <div className="pt-4 border-t border-gray-100 text-center">
                      <p className="text-xs text-gray-500">
                        📍 {match.stadium}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Gold Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A464] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FixturesData;