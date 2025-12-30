'use client';

import { useState, useEffect } from 'react';
import { getLeagueCountNumber } from '@/actions/leaguecount';

const nysl = "/icons/nysl.png";
const tournaments = "/icons/tournament.png";

const HistoryBar = () => {
  type LeagueCounts = {
    NYSL: number | null;
    Tournament: number | null;
  };
  
  const [counts, setCounts] = useState<LeagueCounts>({
    NYSL: null,
    Tournament: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null> (null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        // Fetch counts for both leagues
        const nyslCount = await getLeagueCountNumber('NYSL');
        const tournamentCount = await getLeagueCountNumber('Tournament');
        
        setCounts({
          NYSL: nyslCount,
          Tournament: tournamentCount
        });
      } catch (err) {
        console.error('Error fetching league counts:', err);
        setError('Failed to load league counts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="w-full bg-[#C5A464] py-8 md:py-16">
      <div className="max-w-4xl mx-auto flex justify-evenly md:gap-80 gap-20">
        {/* NYSL Stats */}
        <div className="flex flex-col items-center">
          <img src={nysl} alt="NYSL Trophy" className="w-12 h-12 md:w-16 md:h-16 mb-2" />
          {isLoading ? (
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
          ) : (
            <span className="text-sm md:text-md font-bold text-white mb-1">
              {counts.NYSL}
            </span>
          )}
          <span className="text-white text-sm md:text-base font-semibold tracking-wider">NYSL</span>
        </div>

        {/* Tournaments Stats */}
        <div className="flex flex-col items-center">
          <img src={tournaments} alt="Tournaments Trophy" className="w-12 h-12 md:w-16 md:h-16 mb-2" />
          {isLoading ? (
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
          ) : (
            <span className="text-sm md:text-md font-bold text-white mb-1">
              {counts.Tournament}
            </span>
          )}
          <span className="text-white text-sm md:text-base font-semibold tracking-wider">TOURNAMENTS</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryBar;