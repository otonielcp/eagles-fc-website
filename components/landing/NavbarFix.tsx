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
    <div className="w-full border-b border-[#BD9B58]" style={{ backgroundColor: '#181819' }}>
      <div className="py-2 flex flex-col sm:flex-row items-center sm:justify-between px-6 md:pl-44 lg:pl-56 xl:pl-64 md:pr-20 lg:pr-32" style={{ backgroundColor: '#181819' }}>

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

        {/* Second Row - Dropdowns */}
        <div className="flex justify-center sm:justify-end space-x-2 text-white text-xs mt-2 sm:mt-0">
          {/* League Dropdown */}
          <select
            className="bg-transparent focus:outline-none cursor-pointer border border-white/30 px-3 py-2 rounded-md text-white"
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
            className="bg-transparent focus:outline-none cursor-pointer border border-white/30 px-3 py-2 rounded-md text-white"
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
            className="bg-transparent focus:outline-none cursor-pointer border border-white/30 px-3 py-2 rounded-md text-white"
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