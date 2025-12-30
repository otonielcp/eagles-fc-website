// Updated NavbarFix component
"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useLeagueStore from "@/store/leaguestore";
import { getDistinctCompetitionTypes, getDistinctCompetitions, getDistinctSeasons } from "@/actions/fixture";

interface DropdownData {
  competitionTypes: string[];
  competitions: string[];
  seasons: string[];
}

const NavbarFix = () => {
  const currentPath = usePathname();
  const [dropdownData, setDropdownData] = useState<DropdownData>({
    competitionTypes: [],
    competitions: [],
    seasons: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Get state and setters from Zustand store
  const { 
    selectedLeague, 
    selectedSeason, 
    selectedCompetition,
    setSelectedLeague,
    setSelectedSeason,
    setSelectedCompetition,
  } = useLeagueStore();

  // Fetch dropdown data on component mount only
  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      
      try {
        const [competitionTypes, competitions, seasons] = await Promise.all([
          getDistinctCompetitionTypes(),
          getDistinctCompetitions(),
          getDistinctSeasons()
        ]);

        setDropdownData({
          competitionTypes: competitionTypes || [],
          competitions: competitions || [],
          seasons: seasons || []
        });

        // Set default values to "All" options if none selected
        if (!selectedLeague) {
          setSelectedLeague("All leagues");
        }
        
        if (!selectedSeason) {
          setSelectedSeason("All seasons");
        }
        
        if (!selectedCompetition) {
          setSelectedCompetition("All competitions");
        }

      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        // Set empty arrays on error
        setDropdownData({
          competitionTypes: [],
          competitions: [],
          seasons: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []); // Empty dependency array - only runs once on mount

  return (
    <div className="border-b border-gray-200 shadow-lg w-full px-20">
      <div className="max-w-[1400px] mx-auto py-0 flex flex-col sm:flex-row items-center sm:justify-between">

        {/* First Row - Links (Stacked Horizontally on Small Screens) */}
        <div className="flex justify-center sm:justify-start space-x-6 text-gray-500 uppercase text-sm font-medium tracking-wide">
          <Link href="/fixtures">
            <button
              className={`py-2 sm:py-3 relative ${
                currentPath === "/fixtures" ? "text-black" : "hover:text-gray-700"
              }`}
            >
              Fixtures
              {currentPath === "/fixtures" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
              )}
            </button>
          </Link>

          <Link href="/results">
            <button
              className={`py-2 sm:py-3 relative ${
                currentPath === "/results" ? "text-black" : "hover:text-gray-700"
              }`}
            >
              Results
              {currentPath === "/results" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
              )}
            </button>
          </Link>

          <Link href="/tables">
            <button
              className={`py-2 sm:py-3 relative ${
                currentPath === "/tables" ? "text-black" : "hover:text-gray-700"
              }`}
            >
              Tables
              {currentPath === "/tables" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
              )}
            </button>
          </Link>
        </div>

        {/* Second Row - Dropdowns (Stacked Horizontally on Small Screens) */}
        <div className="flex justify-center sm:justify-end space-x-1 text-gray-500 text-xs mt-2 sm:mt-0">
          {/* League Dropdown (Competition Types) */}
          <select
            className="bg-transparent focus:outline-none cursor-pointer border border-gray-300 px-1 py-1 rounded-md"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            disabled={isLoading}
          >
            {isLoading ? (
              <option value="">Loading...</option>
            ) : (
              <>
                <option value="All leagues">All leagues</option>
                {dropdownData.competitionTypes.length === 0 ? (
                  <option value="">No leagues found</option>
                ) : (
                  dropdownData.competitionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))
                )}
              </>
            )}
          </select>

          {/* Season Dropdown */}
          <select
            className="bg-transparent focus:outline-none cursor-pointer border border-gray-300 px-1 py-1 rounded-md"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            disabled={isLoading}
          >
            {isLoading ? (
              <option value="">Loading...</option>
            ) : (
              <>
                <option value="All seasons">All seasons</option>
                {dropdownData.seasons.length === 0 ? (
                  <option value="">No seasons found</option>
                ) : (
                  dropdownData.seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))
                )}
              </>
            )}
          </select>

          {/* Competition Dropdown */}
          <select
            className="bg-transparent focus:outline-none cursor-pointer border border-gray-300 px-1 py-1 rounded-md"
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            disabled={isLoading}
          >
            <option value="All competitions">All competitions</option>
            {!isLoading && dropdownData.competitions.map((competition) => (
              <option key={competition} value={competition}>
                {competition}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default NavbarFix;