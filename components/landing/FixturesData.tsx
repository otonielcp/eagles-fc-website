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
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      <h2 className="text-3xl font-bebas uppercase tracking-wide mb-8 text-gray-900">
        Upcoming Fixtures
      </h2>
      
      {Object.entries(groupedFixtures).map(([month, matches]) => (
        <div key={month} className="mb-16">
          {/* Month Header */}
          <h3 className="text-xl font-bebas uppercase tracking-wider mb-6 text-gray-700 border-b-2 border-[#BD9B58] pb-2">
            {month}
          </h3>

          {/* Match Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match: any, idx: number) => (
              <Link 
                key={idx} 
                href={`/matchreport/${match._id}`}
                className="group"
              >
                <div className="bg-white border-2 border-gray-200 hover:border-[#BD9B58] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                  {/* Header with Competition and Logos */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-black uppercase text-gray-900 tracking-wider">{match.competition}</p>
                      <div className="flex items-center gap-2">
                        <img
                          src={match.leagueLogo}
                          alt="League"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="font-semibold">{match.date}</span>
                      <span>{match.time}</span>
                    </div>
                  </div>

                  {/* Teams Section */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={match.team1Logo}
                          alt={match.team1}
                          className="w-14 h-14 object-contain"
                        />
                        <span className="text-base font-bold text-gray-900 truncate">{match.team1}</span>
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center my-4">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="px-4 text-sm font-black text-[#BD9B58]">VS</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={match.team2Logo}
                          alt={match.team2}
                          className="w-14 h-14 object-contain"
                        />
                        <span className="text-base font-bold text-gray-900 truncate">{match.team2}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Stadium and Action */}
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate font-medium">{match.stadium}</span>
                      </div>
                      <span className="text-xs font-bold text-[#BD9B58] group-hover:text-gray-900 transition-colors">
                        DETAILS →
                      </span>
                    </div>
                  </div>
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