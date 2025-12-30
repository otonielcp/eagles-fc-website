// Updated ResultsData component
"use client";

import { useEffect, useState } from "react";
import { getFilteredFullTimeMatches } from "@/actions/fixture";
import { format } from "date-fns";
import { IFixture } from "@/types/fixtures";
import Link from "next/link";
import useLeagueStore from "@/store/leaguestore";

// Import Placeholder Logos
const teamLogo = "/teams/ventura.png"
const leagueLogo = "/leagues/usys-national-league.png"

const ResultsData = () => {
  const [results, setResults] = useState<IFixture[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get filter values from store
  const { selectedLeague, selectedSeason, selectedCompetition } = useLeagueStore();

  // Helper function to format time by removing leading zeros from hours
  const formatTime = (timeString: string) => {
    if (!timeString) return timeString;
    
    // Check if time is in 12-hour format (contains AM/PM)
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const meridiem = timeMatch[3];
      
      // Remove leading zero from hours
      return `${hours}:${minutes} ${meridiem}`;
    }
    
    // If it's 24-hour format, convert to 12-hour and remove leading zeros
    const time24Match = timeString.match(/(\d{1,2}):(\d{2})/);
    if (time24Match) {
      let hours = parseInt(time24Match[1]);
      const minutes = time24Match[2];
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
      
      return `${hours}:${minutes} ${ampm}`;
    }
    
    return timeString; // Return as-is if format is unrecognized
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Only pass values if they're meaningful (not empty, default, or "All" options)
        const effectiveLeague = selectedLeague && selectedLeague !== "" && selectedLeague !== "All leagues" ? selectedLeague : undefined;
        const effectiveSeason = selectedSeason && selectedSeason !== "" && selectedSeason !== "All seasons" ? selectedSeason : undefined;
        const effectiveCompetition = selectedCompetition && selectedCompetition !== "All competitions" ? selectedCompetition : undefined;

        // Fetch filtered full-time matches
        const latestMatches = await getFilteredFullTimeMatches(
          effectiveLeague,
          effectiveSeason,
          effectiveCompetition
        );
        
        console.log("Filtered results data:", latestMatches);
        console.log("Applied results filters:", { 
          effectiveLeague, 
          effectiveSeason, 
          effectiveCompetition,
          original: { selectedLeague, selectedSeason, selectedCompetition }
        });

        if (latestMatches) {
          setResults(latestMatches);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedLeague, selectedSeason, selectedCompetition]); // Re-fetch when filters change

  // Group results by month
  const groupedResults = results.reduce((acc: Record<string, IFixture[]>, match: IFixture) => {
    // Format the month from the date
    const matchDate = new Date(match.date);
    const month = format(matchDate, "MMMM yyyy").toUpperCase();

    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(match);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="max-w-5xl mx-4 md:mx-auto py-8 md:py-12">
        <h2 className="text-gray-300 text-sm font-medium mb-4 md:mb-6 px-2 md:px-0">
          RECENT RESULTS
        </h2>
        <div className="h-40 flex items-center justify-center">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-5xl mx-4 md:mx-auto py-8 md:py-12">
        <h2 className="text-gray-300 text-sm font-medium mb-4 md:mb-6 px-2 md:px-0">
          RECENT RESULTS
        </h2>
        <div className="h-40 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No results found</p>
            {(selectedLeague && selectedLeague !== "All leagues" || selectedSeason && selectedSeason !== "All seasons" || (selectedCompetition && selectedCompetition !== "All competitions")) && (
              <p className="text-sm text-gray-400">
                Try adjusting your filters to see more results
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-4 md:mx-auto py-8 md:py-12">
      {/* Show active filters if any */}
      {(selectedLeague && selectedLeague !== "All leagues" || selectedSeason && selectedSeason !== "All seasons" || (selectedCompetition && selectedCompetition !== "All competitions")) && (
        <div className="mb-6 px-2 md:px-0">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-gray-500">Filtered by:</span>
            {selectedLeague && selectedLeague !== "All leagues" && (
              <span className="text-gray-200 px-2 py-1 rounded" style={{ backgroundColor: '#181819' }}>
                {selectedLeague}
              </span>
            )}
            {selectedSeason && selectedSeason !== "All seasons" && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {selectedSeason}
              </span>
            )}
            {selectedCompetition && selectedCompetition !== "All competitions" && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {selectedCompetition}
              </span>
            )}
          </div>
        </div>
      )}

      {Object.entries(groupedResults).map(([month, matches]) => (
        <div key={month} className="mb-8 md:mb-12">
          {/* Month Header */}
          <h2 className="text-gray-300 text-sm font-medium mb-4 md:mb-6 px-2 md:px-0">
            {month}
          </h2>

          {/* Match List */}
          <div className="space-y-2">
            {matches.map((match: IFixture, idx: number) => {
              // Format date and time
              const matchDate = new Date(match.date);
              const formattedDate = format(matchDate, "EEE d MMMM").toUpperCase();
              const formattedTime = formatTime(match.time);

              return (
                <div key={idx} className="border-t border-gray-200">
                  <div className="relative pt-6 pb-8 px-2 md:px-0">
                    {/* Competition Name */}
                    <div className="absolute top-4 left-2 md:left-0">
                      <p className="text-xs font-bold uppercase text-gray-900">{match.competition}</p>
                      <p className="text-xs font-barlow text-gray-500 mt-1">
                        {formattedDate} - {formattedTime} - {match.stadium || "TBD"}
                      </p>
                    </div>

                    {/* Competition Logo */}
                    <div className="absolute top-4 right-2 md:right-0">
                      <img
                        src={match.leagueLogo || leagueLogo}
                        alt="Competition logo"
                        className="w-6 h-6 md:w-8 md:h-8 object-contain"
                      />
                    </div>

                    {/* Match Result */}
                    <div className="flex items-center justify-between mt-12">
                      {/* Team 1 */}
                      <span className="text-xs md:text-sm font-medium w-20 md:w-32 text-left truncate">{match.homeTeam}</span>

                      {/* Central Score Section */}
                      <div className="flex items-center gap-3 md:gap-6">
                        <img
                          src={match.homeTeamLogo || teamLogo}
                          alt={match.homeTeam}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />

                        <div className="flex items-center gap-1">
                          <div className="bg-gray-100 px-2 md:px-3 py-1 md:py-2 text-base md:text-lg">
                            {match.homeScore || 0}
                          </div>
                          <div className="bg-gray-100 px-2 md:px-3 py-1 md:py-2 text-base md:text-lg">
                            {match.awayScore || 0}
                          </div>
                        </div>

                        <img
                          src={match.awayTeamLogo || teamLogo}
                          alt={match.awayTeam}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                      </div>

                      {/* Team 2 */}
                      <span className="text-xs md:text-sm font-medium w-20 md:w-32 text-right truncate">{match.awayTeam}</span>
                    </div>

                    {/* Match Report Link */}
                    <div className="absolute -bottom-0 right-2 md:right-0">
                      <Link href={`/matchreport/${match._id}`} className="text-xs font-semibold text-gray-500 hover:text-gray-700">
                        MATCH REPORT →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsData;