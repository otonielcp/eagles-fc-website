"use client";

import React, { useEffect, useState } from "react";
import useLeagueStore from "@/store/leaguestore";

// Import Placeholder Logos
const leagueLogo = "/leagues/usys-national-league.png";
const channelLogo = "/teams/ventura.png";

// Define countdown type
interface CountdownType {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface NextMatchFixtureProps {
  nextMatch: any | null;
  loading: boolean;
}

const NextMatchFixture: React.FC<NextMatchFixtureProps> = ({ nextMatch, loading }) => {
  const [countdown, setCountdown] = useState<CountdownType>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Get filter values from Zustand store
  const {
    selectedLeague,
    selectedSeason,
    selectedCompetition,
  } = useLeagueStore();

  // Function to parse date string as-is without timezone conversion
  const parseLocalDate = (dateString: string): Date => {
    // Parse the date string directly without timezone interpretation
    const date = new Date(dateString + 'T00:00:00');
    return date;
  };

  // Function to create countdown target date
  const createCountdownDate = (rawDate: string, timeString: string): Date => {
    const baseDate = parseLocalDate(rawDate);
    
    // Parse the time string (e.g., "07:42 PM")
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    
    if (!timeMatch) {
      console.warn('Could not parse time string:', timeString);
      return baseDate;
    }
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const meridiem = timeMatch[3].toUpperCase();
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Create new date with correct time
    const correctDate = new Date(baseDate);
    correctDate.setHours(hours, minutes, 0, 0);
    
    return correctDate;
  };

  useEffect(() => {
    if (!nextMatch) return;
    console.log(31, nextMatch);
    
    const calculateTimeLeft = (): CountdownType => {
      // Create the correct match date by combining rawDate and time
      const matchDate: Date = createCountdownDate(nextMatch.rawDate, nextMatch.time);
      const now: Date = new Date();
      const difference: number = matchDate.getTime() - now.getTime();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Initial calculation
    setCountdown(calculateTimeLeft());

    // Update countdown every second
    const timer: NodeJS.Timeout = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [nextMatch]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mt-12 mx-auto px-4 md:px-0">
        <h2 className="text-gray-300 text-sm font-medium mb-0">NEXT MATCH</h2>
        <div className="border-t border-gray-200 mb-4 w-full md:w-[900px]"></div>
        <div className="h-40 flex items-center justify-center">
          <p>Loading next match...</p>
        </div>
      </div>
    );
  }

  if (!nextMatch) {
    return (
      <div className="w-full max-w-4xl mt-12 mx-auto px-4 md:px-0">
        <h2 className="text-gray-300 text-sm font-medium mb-0">NEXT MATCH</h2>
        <div className="border-t border-gray-200 mb-4 w-full md:w-[900px]"></div>
        <div className="h-40 flex items-center justify-center">
          <p>No upcoming matches scheduled for {selectedLeague} {selectedCompetition !== "All competitions" ? `- ${selectedCompetition}` : ""} {selectedSeason !== "All" ? `(${selectedSeason})` : ""}</p>
        </div>
      </div>
    );
  }

  // Format date and time - use the original date as-is from database
  const formattedDate: string = nextMatch.date;
  const formattedTime: string = nextMatch.time;

  return (
    <div className="w-full max-w-4xl mt-12 mx-auto px-4 md:px-0">
      {/* Header */}
      <h2 className="text-gray-300 text-sm font-medium mb-0">
        NEXT MATCH
      </h2>
      <div className="border-t border-gray-200 mb-4 w-full md:w-[900px]"></div>

      <div className="relative pb-8">
        {/* Competition & Time Details */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-2">{nextMatch.competition}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate} — {formattedTime}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {nextMatch.stadium|| "TBD"}
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="flex gap-12 mb-4">
          {/* Teams */}
          <div className="flex flex-col gap-4 w-full">
            {/* Team 1 */}
            <div className="flex items-center gap-4">
              <img
                src={nextMatch.team1Logo}
                alt={nextMatch.team1}
                className="w-12 h-12"
              />
              <span className="text-md font-medium">{nextMatch.team1}</span>
            </div>

            {/* Border */}
            <div className="border-t border-gray-200 w-full md:w-[800px]"></div>

            {/* Team 2 */}
            <div className="flex items-center gap-4">
              <img
                src={nextMatch.team2Logo}
                alt={nextMatch.team2}
                className="w-12 h-12"
              />
              <span className="text-md font-medium">{nextMatch.team2}</span>
            </div>
          </div>
        </div>

        {/* Logos and Countdown Section */}
        <div className="static mt-8 sm:mt-0 sm:absolute sm:top-0 sm:right-0 flex flex-col items-end">
          {/* Logos */}
          <div className="flex items-center gap-2">
            <img src={nextMatch.channelLogo} alt="Channel logo" className="w-8 h-8 object-contain" />
            <div className="w-px h-4 bg-gray-300 mx-2"></div>
            <img src={nextMatch.leagueLogo} alt="Competition logo" className="w-8 h-8 object-contain" />
          </div>

          {/* Countdown */}
          <div className="mt-4">
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-4">
              <div className="flex items-center justify-end gap-1">
                <span className="text-lg p-5 bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full">{countdown.days}</span>
                <span className="text-xs text-gray-500">Day{countdown.days !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="text-lg p-5 bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full">{countdown.hours}</span>
                <span className="text-xs text-gray-500">HRS</span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="text-md p-5 bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full">{countdown.minutes}</span>
                <span className="text-xs text-gray-500">MIN</span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="text-lg p-5 bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full">{countdown.seconds}</span>
                <span className="text-xs text-gray-500">SEC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextMatchFixture;