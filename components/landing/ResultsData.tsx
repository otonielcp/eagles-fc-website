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
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {Object.entries(groupedResults).map(([month, matches]) => (
        <div key={month} className="mb-20">
          {/* Month Header - Premium Style */}
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="w-12 h-[2px] bg-[#C5A464]"></div>
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-[#C5A464]">
              {month}
            </h2>
            <div className="w-12 h-[2px] bg-[#C5A464]"></div>
          </div>

          {/* Match Cards - Clean Premium Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match: IFixture, idx: number) => {
              const matchDate = new Date(match.date);
              const formattedDate = format(matchDate, "EEE d MMMM").toUpperCase();
              const formattedTime = formatTime(match.time);
              
              // Determine winner for styling
              const homeWinner = match.homeScore > match.awayScore;
              const awayWinner = match.awayScore > match.homeScore;

              return (
                <Link 
                  key={idx} 
                  href={`/matchreport/${match._id}`}
                  className="group block"
                >
                  <div className="relative bg-white hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-200 hover:border-[#C5A464]">
                    
                    {/* League Logo - Top */}
                    <div className="h-20 flex items-center justify-center bg-white border-b border-gray-100">
                      <img
                        src={match.leagueLogo || leagueLogo}
                        alt="League"
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      
                      {/* Date & Time */}
                      <div className="text-center mb-8">
                        <p className="text-sm font-bold text-gray-900 mb-1">
                          {formattedDate}
                        </p>
                        <p className="text-xs text-[#C5A464] font-semibold">
                          {formattedTime}
                        </p>
                      </div>

                      {/* Teams - Horizontal */}
                      <div className="flex items-center justify-center gap-4 mb-6">
                        {/* Team 1 Logo & Score */}
                        <div className="flex flex-col items-center">
                          <img
                            src={match.homeTeamLogo || teamLogo}
                            alt={match.homeTeam}
                            className="w-16 h-16 object-contain mb-2"
                          />
                          <span className={`text-3xl font-black ${homeWinner ? 'text-green-600' : 'text-gray-400'}`}>
                            {match.homeScore || 0}
                          </span>
                        </div>

                        {/* Vertical Divider Line */}
                        <div className="h-24 w-[2px] bg-gray-200"></div>

                        {/* Team 2 Logo & Score */}
                        <div className="flex flex-col items-center">
                          <img
                            src={match.awayTeamLogo || teamLogo}
                            alt={match.awayTeam}
                            className="w-16 h-16 object-contain mb-2"
                          />
                          <span className={`text-3xl font-black ${awayWinner ? 'text-green-600' : 'text-gray-400'}`}>
                            {match.awayScore || 0}
                          </span>
                        </div>
                      </div>

                      {/* Team Names */}
                      <div className="flex items-center justify-center gap-3 text-center mb-6">
                        <span className={`text-xs font-bold flex-1 text-right ${homeWinner ? 'text-gray-900' : 'text-gray-600'}`}>
                          {match.homeTeam}
                        </span>
                        <span className="text-gray-300 px-2">-</span>
                        <span className={`text-xs font-bold flex-1 text-left ${awayWinner ? 'text-gray-900' : 'text-gray-600'}`}>
                          {match.awayTeam}
                        </span>
                      </div>

                      {/* Stadium */}
                      <div className="pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                          📍 {match.stadium || "TBD"}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Gold Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A464] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsData;