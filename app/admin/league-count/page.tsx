'use client';

import React, { useState, useEffect } from 'react';
import { getLeagueCountNumber, updateLeagueCountNumber } from '@/actions/leaguecount';

const LeagueManager: React.FC = () => {
  const [leagueCounts, setLeagueCounts] = useState<{
    Tournament: number;
    NYSL: number;
  }>({
    Tournament: 0,
    NYSL: 0
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<{
    Tournament: boolean;
    NYSL: boolean;
  }>({
    Tournament: false,
    NYSL: false
  });
  const [status, setStatus] = useState<{
    type: string;
    message: string;
  }>({ type: '', message: '' });

  // Fetch current counts on load
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);

        // Fetch counts for both leagues
        const tournamentCount = await getLeagueCountNumber('Tournament');
        const nyslCount = await getLeagueCountNumber('NYSL');

        setLeagueCounts({
          Tournament: tournamentCount,
          NYSL: nyslCount
        });
      } catch (err) {
        setStatus({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to fetch league counts'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Handle count change
  const handleCountChange = (league: 'Tournament' | 'NYSL', newCount: number | string): void => {
    const count = Math.max(0, parseInt(String(newCount)) || 0);
    setLeagueCounts(prev => ({
      ...prev,
      [league]: count
    }));
  };

  // Update a specific league count
  const handleUpdateLeague = async (league: 'Tournament' | 'NYSL'): Promise<void> => {
    try {
      // Set saving state for this specific league
      setIsSaving(prev => ({ ...prev, [league]: true }));
      setStatus({ type: '', message: '' });

      // Call the server action to update the count
      await updateLeagueCountNumber(league, leagueCounts[league]);

      setStatus({
        type: 'success',
        message: `${league} trophies count updated successfully!`
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 3000);

    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : `Failed to update ${league}`
      });
    } finally {
      setIsSaving(prev => ({ ...prev, [league]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#C5A464] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading league data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#C5A464] px-6 py-4">
          <h1 className="text-xl font-bold text-white">Trophies Manager</h1>
        </div>

        <div className="px-6 py-6">
          {status.message && (
            <div className={`p-4 mb-6 rounded-md ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Tournament League Card */}
            <div className="border border-gray-200 p-5 rounded-md hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Tournament</h2>
                  <p className="text-sm text-gray-500 mt-1">Championship tournaments count</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleCountChange('Tournament', leagueCounts.Tournament - 1)}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    disabled={isSaving.Tournament}
                  >
                    <span className="text-lg font-medium">-</span>
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={leagueCounts.Tournament}
                    onChange={(e) => handleCountChange('Tournament', e.target.value)}
                    className="w-16 h-10 text-center border rounded-md px-2 py-1 text-lg font-medium"
                    disabled={isSaving.Tournament}
                  />

                  <button
                    onClick={() => handleCountChange('Tournament', leagueCounts.Tournament + 1)}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    disabled={isSaving.Tournament}
                  >
                    <span className="text-lg font-medium">+</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleUpdateLeague('Tournament')}
                  disabled={isSaving.Tournament}
                  className="px-5 py-2 bg-[#C5A464] text-white rounded-md text-sm font-medium hover:bg-[#b69347] transition-colors disabled:bg-[#e0cda4] disabled:cursor-not-allowed"
                >
                  {isSaving.Tournament ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* NYSL League Card */}
            <div className="border border-gray-200 p-5 rounded-md hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">NYSL</h2>
                  <p className="text-sm text-gray-500 mt-1">NYSL league tournaments count</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleCountChange('NYSL', leagueCounts.NYSL - 1)}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    disabled={isSaving.NYSL}
                  >
                    <span className="text-lg font-medium">-</span>
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={leagueCounts.NYSL}
                    onChange={(e) => handleCountChange('NYSL', e.target.value)}
                    className="w-16 h-10 text-center border rounded-md px-2 py-1 text-lg font-medium"
                    disabled={isSaving.NYSL}
                  />

                  <button
                    onClick={() => handleCountChange('NYSL', leagueCounts.NYSL + 1)}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    disabled={isSaving.NYSL}
                  >
                    <span className="text-lg font-medium">+</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleUpdateLeague('NYSL')}
                  disabled={isSaving.NYSL}
                  className="px-5 py-2 bg-[#C5A464] text-white rounded-md text-sm font-medium hover:bg-[#b69347] transition-colors disabled:bg-[#e0cda4] disabled:cursor-not-allowed"
                >
                  {isSaving.NYSL ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueManager;