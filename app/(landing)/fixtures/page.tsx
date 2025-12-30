// Updated Fixtures component
"use client";

import { useEffect, useState } from 'react';
import FixturesData from '@/components/landing/FixturesData';
import NextMatchFixture from '@/components/landing/NextMatchFixture';
import NavbarFix from '@/components/landing/NavbarFix';
import { getFilteredUpcomingMatches } from "@/actions/fixture";
import useLeagueStore from "@/store/leaguestore";

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedLeague, selectedSeason, selectedCompetition } = useLeagueStore();

  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
      try {
        // Pass filter values to the server action
        const data = await getFilteredUpcomingMatches(
          selectedLeague,
          selectedSeason,
          selectedCompetition
        );
        
        console.log("Filtered fixtures data:", data);
        console.log("Applied filters:", { selectedLeague, selectedSeason, selectedCompetition });

        // Helper function to parse date without timezone issues
        const parseLocalDate = (dateString: string) => {
          const date = new Date(dateString + 'T00:00:00');
          return date;
        };

        // Helper function to format date as-is without timezone conversion
        const formatDateAsIs = (dateString: string) => {
          const date = parseLocalDate(dateString);
          const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                         'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          
          const dayName = days[date.getDay()];
          const dayNum = date.getDate();
          const monthName = months[date.getMonth()];
          
          return `${dayName} ${dayNum} ${monthName}`;
        };

        const formatMonthYearAsIs = (dateString: string) => {
          const date = parseLocalDate(dateString);
          const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                         'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          
          const monthName = months[date.getMonth()];
          const year = date.getFullYear();
          
          return `${monthName} ${year}`;
        };

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

        // Transform the data to match our display format
        const transformedData = data.map((fixture: any) => ({
          date: formatDateAsIs(fixture.date),
          time: formatTime(fixture.time),
          stadium: fixture.stadium.toUpperCase(),
          competition: fixture.competition.toUpperCase(),
          homeTeam: fixture.homeTeam,
          awayTeam: fixture.awayTeam,
          homeTeamLogo: fixture.homeTeamLogo || "/teams/ventura.png",
          awayTeamLogo: fixture.awayTeamLogo || "/teams/ventura.png",
          month: formatMonthYearAsIs(fixture.date),
          leagueLogo: fixture.leagueLogo || "/leagues/usys-national-league.png",
          channelLogo: fixture.channelLogo || "/teams/ventura.png",
          team1: fixture.homeTeam,
          team2: fixture.awayTeam,
          team1Logo: fixture.homeTeamLogo || "/teams/ventura.png",
          team2Logo: fixture.awayTeamLogo || "/teams/ventura.png",
          _id: fixture._id,
          // Add the raw date for sorting and countdown (keep as string to avoid timezone issues)
          rawDate: fixture.date,
          // Include original data elements
          season: fixture.season,
          league: fixture.league,
          // Add fields needed for filtering display
          competitionType: fixture.competitionType,
          originalCompetition: fixture.competition,
        }));

        // Sort by date (ascending) - parse dates for sorting
        const sortedData = transformedData.sort((a: any, b: any) => {
          const dateA = new Date(a.rawDate + 'T00:00:00');
          const dateB = new Date(b.rawDate + 'T00:00:00');
          return dateA.getTime() - dateB.getTime();
        });

        setFixtures(sortedData);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
        setFixtures([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [selectedLeague, selectedSeason, selectedCompetition]);

  // Get the next match (first in the sorted array)
  const nextMatch = fixtures.length > 0 ? fixtures[0] : null;
  // Get the remaining matches (all except the first one)
  const remainingFixtures = fixtures.length > 0 ? fixtures.slice(1) : [];

  return (
    <>
      {/* Navbar */}
      <NavbarFix />
      
      {/* Next Match Fixture */}
      <NextMatchFixture 
        nextMatch={nextMatch} 
        loading={loading}
      />
      
      {/* Fixtures Data */}
      <FixturesData 
        fixtures={remainingFixtures}
        loading={loading}
      />
    </>
  );
};

export default Fixtures;