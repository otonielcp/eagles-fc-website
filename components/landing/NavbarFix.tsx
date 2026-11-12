// Fixtures / Results / Tables sub-navigation with the league, season and
// competition filters. Filter options come from the club's FutbolCore games.
"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useLeagueStore from "@/store/leaguestore";
import { getClubGameFilters } from "@/actions/futbolcore";
import { ALL_COMPETITIONS, ALL_LEAGUES, ALL_SEASONS, type GameFilterOptions } from "@/lib/gameFilters";

const selectClass =
  "bg-transparent focus:outline-none cursor-pointer border border-white/30 px-3 py-2 rounded-md text-white [&>option]:text-gray-900";

const NavbarFix = () => {
  const currentPath = usePathname();
  const [options, setOptions] = useState<GameFilterOptions>({ leagues: [], seasons: [], competitions: [] });
  const [isLoading, setIsLoading] = useState(true);

  const {
    selectedLeague,
    selectedSeason,
    selectedCompetition,
    setSelectedLeague,
    setSelectedSeason,
    setSelectedCompetition,
  } = useLeagueStore();

  // Tables show season records, which can't be split by league or season.
  const showFilters = currentPath !== "/tables";

  useEffect(() => {
    if (!showFilters) return;
    let cancelled = false;
    getClubGameFilters()
      .then((data) => {
        if (cancelled) return;
        setOptions(data);
        // A remembered choice that no longer exists would hide every game.
        if (!data.leagues.includes(useLeagueStore.getState().selectedLeague)) setSelectedLeague(ALL_LEAGUES);
        if (!data.seasons.includes(useLeagueStore.getState().selectedSeason)) setSelectedSeason(ALL_SEASONS);
        if (!data.competitions.includes(useLeagueStore.getState().selectedCompetition)) setSelectedCompetition(ALL_COMPETITIONS);
      })
      .catch((error) => console.error("Error fetching filter options:", error))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [showFilters, setSelectedLeague, setSelectedSeason, setSelectedCompetition]);

  return (
    <div className="w-full border-b border-[#BD9B58]" style={{ backgroundColor: '#181819' }}>
      <div className="py-2 flex flex-col sm:flex-row items-center sm:justify-between px-6 md:pl-80 lg:pl-96 xl:pl-[28rem] md:pr-20 lg:pr-32" style={{ backgroundColor: '#181819' }}>

        {/* First Row - Links */}
        <div className="flex justify-center sm:justify-start space-x-8 text-white/70 uppercase text-sm font-medium tracking-wide">
          <Link href="/fixtures">
            <button
              className={`py-3 relative transition-colors duration-300 ${
                currentPath === "/fixtures" ? "text-white" : "hover:text-[#BD9B58]"
              }`}
            >
              Fixtures
              {currentPath === "/fixtures" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#BD9B58]"></div>
              )}
            </button>
          </Link>

          <Link href="/results">
            <button
              className={`py-3 relative transition-colors duration-300 ${
                currentPath === "/results" ? "text-white" : "hover:text-[#BD9B58]"
              }`}
            >
              Results
              {currentPath === "/results" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#BD9B58]"></div>
              )}
            </button>
          </Link>

          <Link href="/tables">
            <button
              className={`py-3 relative transition-colors duration-300 ${
                currentPath === "/tables" ? "text-white" : "hover:text-[#BD9B58]"
              }`}
            >
              Tables
              {currentPath === "/tables" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#BD9B58]"></div>
              )}
            </button>
          </Link>
        </div>

        {/* Second Row - Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 text-white text-xs mt-2 sm:mt-0">
            <select
              aria-label="Filter by league"
              className={selectClass}
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              disabled={isLoading}
            >
              <option value={ALL_LEAGUES}>{isLoading ? "Loading..." : ALL_LEAGUES}</option>
              {options.leagues.map((league) => (
                <option key={league} value={league}>{league}</option>
              ))}
            </select>

            <select
              aria-label="Filter by season"
              className={selectClass}
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              disabled={isLoading}
            >
              <option value={ALL_SEASONS}>{isLoading ? "Loading..." : ALL_SEASONS}</option>
              {options.seasons.map((season) => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>

            <select
              aria-label="Filter by competition"
              className={selectClass}
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              disabled={isLoading}
            >
              <option value={ALL_COMPETITIONS}>{isLoading ? "Loading..." : ALL_COMPETITIONS}</option>
              {options.competitions.map((competition) => (
                <option key={competition} value={competition}>{competition}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarFix;