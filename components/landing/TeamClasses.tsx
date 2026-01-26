'use client';

import { Eye, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Team } from '@/types/team';

interface PlayerAvatar {
  id: string;
  image: string;
  name: string;
}

interface Competition {
  name: string;
  logo: string | null;
}

interface TeamWithCounts extends Team {
  totalPlayers: number;
  coaches: number;
  playerAvatars: PlayerAvatar[];
  competitions: Competition[];
  upcomingGames: number;
}

interface TeamClassesProps {
  teams: TeamWithCounts[];
}

const TeamClasses = ({ teams }: TeamClassesProps) => {
  // If no teams are provided, show a placeholder message
  if (!teams || teams.length === 0) {
    return (
      <div className="w-9/12 mx-auto py-12 text-center">
        <h3 className="text-xl font-semibold">No active teams found</h3>
        <p className="text-gray-500 mt-2">Check back later for updated team information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            {/* Card Image */}
            <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src={team.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop'}
                alt={team.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  {team.category}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <button className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                  {team.coaches} Coach{team.coaches !== 1 ? 'es' : ''}
                </div>
              </div>

              {/* Player Avatars */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {team.playerAvatars && team.playerAvatars.length > 0 ? (
                    team.playerAvatars.map((player) => (
                      <div
                        key={player.id}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                        title={player.name}
                      >
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    [...Array(Math.min(4, team.totalPlayers))].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-semibold">E</span>
                      </div>
                    ))
                  )}
                </div>
                {team.totalPlayers > team.playerAvatars.length && (
                  <span className="text-sm text-gray-500">+{team.totalPlayers - team.playerAvatars.length}</span>
                )}
                <div className="ml-auto">
                  <span className="text-sm font-medium text-gray-900">Total Players</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{team.totalPlayers}</span>
                  </div>
                </div>
              </div>

              {/* Leagues */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Leagues</span>
                  {team.competitions.length === 0 && (
                    <span className="ml-auto text-xs text-gray-400">No leagues</span>
                  )}
                </div>
                {team.competitions.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {team.competitions.slice(0, 2).map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <span className="text-xs font-medium text-gray-700 truncate flex-1">
                          {comp.name}
                        </span>
                        {comp.logo && (
                          <div className="w-6 h-6 rounded overflow-hidden bg-white border border-gray-200 flex items-center justify-center ml-2 flex-shrink-0">
                            <img
                              src={comp.logo}
                              alt={comp.name}
                              className="w-full h-full object-contain p-0.5"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {team.competitions.length > 2 && (
                      <p className="text-xs text-gray-500 ml-2">+{team.competitions.length - 2} more</p>
                    )}
                  </div>
                )}
              </div>

              {/* Upcoming Games */}
              <div className="flex items-center gap-2 mb-5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">Upcoming</span>
                <span className="ml-auto text-sm text-gray-900">
                  {team.upcomingGames > 0 ? `${team.upcomingGames} game${team.upcomingGames !== 1 ? 's' : ''}` : 'No upcoming games'}
                </span>
              </div>

              {/* View Button */}
              <Link
                href={`/team/${team._id}`}
                className="block w-full"
              >
                <button
                  className="w-full bg-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{
                    border: '2px solid #CEB27D',
                    color: '#CEB27D'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#CEB27D10'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamClasses;
