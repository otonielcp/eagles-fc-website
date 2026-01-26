"use client"
import { useState, useEffect } from "react";
import { getAllStandings } from "@/actions/standings";

// TypeScript interfaces
interface TeamStanding {
  rank?: number;
  teamName: string;
  gamesPlayed: number;
  wins: number;
  ties: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  totalPoints: number;
  teamLogo?: string; // Added team logo field
  clubInfo?: string;
  bracketCode?: string;
}

interface FormattedTeam {
  position: number;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: string;
  pts: number;
  form: string[];
  logo: string; // Added logo field to store the logo URL
  clubInfo?: string;
}

interface StandingMetadata {
  league: string;
  group: string;
  season: string;
  lastUpdated?: Date;
}

interface StandingDocument {
  _id: string;
  metadata: StandingMetadata;
  standings: TeamStanding[];
}

interface LeagueStandings {
  leagueInfo: string;
  standings: FormattedTeam[];
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
    <span className="ml-3 text-gray-700">Loading standings...</span>
  </div>
);

// Add isHomePage prop to control display behavior
const Standing = ({ isHomePage = false }) => {
  const [leaguesData, setLeaguesData] = useState<LeagueStandings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch standings data when component mounts
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const data = await getAllStandings();

        if (data && data.length > 0) {
          // Process all standing documents - works with any number of leagues
          const formattedLeagues = data.map((standingDoc: StandingDocument) => {
            // Format standings data for each league
            const formattedStandings = standingDoc.standings.map((team, index) => {
              // Generate form based on team's actual record
              const form = [];

              // Get total matches played
              const totalMatches = team.gamesPlayed;

              // Add wins
              for (let i = 0; i < team.wins; i++) {
                form.push("W");
              }

              // Add losses
              for (let i = 0; i < team.losses; i++) {
                form.push("L");
              }

              // Add draws
              for (let i = 0; i < team.ties; i++) {
                form.push("D");
              }

              return {
                position: team.rank || index + 1,
                club: team.teamName,
                played: team.gamesPlayed,
                won: team.wins,
                drawn: team.ties,
                lost: team.losses,
                gf: team.goalsFor,
                ga: team.goalsAgainst,
                gd: team.goalDifference > 0 ? `+${team.goalDifference}` : `${team.goalDifference}`,
                pts: team.totalPoints,
                form: form, // Show all form results without limiting to 5
                logo: team.teamLogo,
                clubInfo: team.clubInfo
              };
            });

            // Create league info string from metadata
            const { league, group, season } = standingDoc.metadata;
            const leagueInfo = `${league || "LEAGUE"} - ${group || "CONFERENCE"} ${season || "2025"}`;

            return {
              leagueInfo,
              standings: formattedStandings
            };
          });

          // If on home page, only show the first league
          if (isHomePage) {
            setLeaguesData([formattedLeagues[0]]);
          } else {
            setLeaguesData(formattedLeagues);
          }
        } else {
          // Handle case when no data is returned
          setError("No standings data available");
        }
      } catch (err) {
        setError("Failed to load standings data");
        console.error("Error fetching standings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [isHomePage]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!leaguesData || leaguesData.length === 0) {
    return <div className="text-center p-4">No standings data available</div>;
  }

  // Render a standings table for each league dynamically
  return (
    <div className="max-w-7xl mx-auto my-12 md:my-16 px-4 sm:px-6 lg:px-8">
      {leaguesData.map((league, leagueIndex) => (
        <div key={leagueIndex} className={leagueIndex > 0 ? "mt-20" : ""}>
          {/* League Title Banner - Clean Centered Style */}
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="w-12 h-[2px] bg-[#C5A464]"></div>
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-gray-900">
              {league.leagueInfo}
            </h2>
            <div className="w-12 h-[2px] bg-[#C5A464]"></div>
          </div>

          {/* Table Container - Clean & Simple */}
          <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full border-collapse">
              {/* Table Header - Clean Dark Header */}
              <thead>
                <tr className="bg-gray-900 text-white border-b-2 border-gray-700">
                  <th className="px-3 md:px-4 py-3 text-left text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    POS
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-[10px] md:text-xs font-bold uppercase tracking-wider" colSpan={2}>
                    CLUB
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:table-cell">
                    P
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:table-cell">
                    W
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:table-cell">
                    D
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:table-cell">
                    L
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                    GF
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                    GA
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                    GD
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#C5A464]">
                    PTS
                  </th>
                  <th className="px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider hidden lg:table-cell">
                    FORM
                  </th>
                </tr>
              </thead>

              {/* Table Body - Clean Rows */}
              <tbody>
                {league.standings.map((team, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Position */}
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        {team.position}
                      </span>
                    </td>

                    {/* Team Logo */}
                    <td className="px-2 md:px-3 py-3 whitespace-nowrap">
                      <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded bg-white border border-gray-200">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={`${team.club} logo`}
                            className="h-full w-full object-contain p-1"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400 font-bold">
                              {team.club.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Club Name */}
                    <td className="px-3 md:px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {team.club}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700 hidden sm:table-cell">
                      {team.played}
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700 hidden sm:table-cell">
                      {team.won}
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700 hidden sm:table-cell">
                      {team.drawn}
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700 hidden sm:table-cell">
                      {team.lost}
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700 hidden md:table-cell">
                      {team.gf}
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700 hidden md:table-cell">
                      {team.ga}
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-gray-900 hidden md:table-cell">
                      {team.gd}
                    </td>
                    
                    {/* Points - Bold */}
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center">
                      <span className="text-sm font-black text-gray-900">
                        {team.pts}
                      </span>
                    </td>

                    {/* Form Indicators */}
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {team.form.length > 0 ? (
                          team.form.slice(0, 5).map((result, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 flex items-center justify-center rounded-sm text-[10px] font-bold ${
                                result === "W" 
                                  ? "bg-green-500 text-white" 
                                  : result === "L" 
                                    ? "bg-red-500 text-white"
                                    : "bg-gray-400 text-white"
                              }`}
                            >
                              {result}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Standing;