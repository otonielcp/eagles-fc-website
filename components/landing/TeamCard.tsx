'use client';

import { Eye, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Team } from '@/types/team';

interface TeamCardProps {
  team: Team & {
    totalPlayers: number;
    coaches: number;
  };
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* Card Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={team.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop'}
          alt={team.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
            {team.category}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {[...Array(Math.min(4, team.totalPlayers))].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-white flex items-center justify-center"
              >
                <span className="text-white text-xs font-semibold">E</span>
              </div>
            ))}
          </div>
          {team.totalPlayers > 4 && (
            <span className="text-sm text-gray-500">+{team.totalPlayers - 4}</span>
          )}
          <div className="ml-auto">
            <span className="text-sm font-medium text-gray-900">Total Players</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{team.totalPlayers}</span>
            </div>
          </div>
        </div>

        {/* Leagues */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <Trophy className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Leagues</span>
          <div className="ml-auto">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
          </div>
        </div>

        {/* Upcoming Games */}
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-600">Upcoming</span>
          <span className="ml-auto text-sm text-gray-900">No upcoming games</span>
        </div>

        {/* View Button */}
        <Link
          href={`/team/${team._id}`}
          className="block w-full"
        >
          <button className="w-full bg-white border-2 border-amber-500 text-amber-600 py-2.5 rounded-lg font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            View
          </button>
        </Link>
      </div>
    </div>
  );
}
