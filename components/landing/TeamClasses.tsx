'use client';

import { Trophy, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { Team } from '@/types/team';
import { useState } from 'react';
import SafeImg from './SafeImg';


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
  nextOpponent?: string;
  leagueLogos?: { url: string }[];
  season?: string;
  formation?: string;
  tier?: string;
  colors?: { primary: string; secondary: string };
  logo?: { secure_url: string; url: string };
  coach?: { _id: string; firstName: string; lastName: string };
}

interface TeamClassesProps {
  teams: TeamWithCounts[];
}

// Team image with fallback
const TeamImage = ({ src, category }: { src: string; category: string }) => {
  // Remote images, or photos uploaded in the admin (served from /api/images).
  const hasValidSrc = src && src.length > 1 && (src.startsWith('http') || src.startsWith('/'));

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100">
      {hasValidSrc && (
        <SafeImg
          src={src}
          alt=""
          fallbackSrc={null}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Category badge */}
      <div className="absolute bottom-3 left-3">
        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
          {category}
        </span>
      </div>
    </div>
  );
};

const TeamClasses = ({ teams }: TeamClassesProps) => {
  if (!teams || teams.length === 0) {
    return (
      <div className="w-9/12 mx-auto py-12 text-center">
        <h3 className="text-xl font-semibold">No active teams found</h3>
        <p className="text-gray-500 mt-2">Check back later for updated team information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase leading-none">Our Teams</h2>
          <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
        </div>
        <p className="text-gray-500 text-sm uppercase tracking-widest font-medium">Eagles FC Squads</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {teams.map((team) => {
          return (
            <Link key={team._id} href={`/team/${team._id}`} className="group block">
              <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_1px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-100">

                {/* Card Image */}
                <TeamImage src={team.image} category={team.category} />

                {/* Card Body */}
                <div className="p-5">

                  {/* Team Name + Coaches Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight pr-3">{team.name}</h3>
                    {team.coaches > 0 && (
                      <span className="flex-shrink-0 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                        {team.coaches} Coach{team.coaches !== 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>

                  {/* Players Row */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Players</span>
                    </div>
                    {team.totalPlayers > 0 ? (
                      <span className="text-lg font-bold text-gray-900">{team.totalPlayers}</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </div>

                  {/* Leagues Row */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Leagues</span>
                    </div>
                    {team.leagueLogos && team.leagueLogos.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        {team.leagueLogos.slice(0, 3).map((logo, idx) => (
                          <div key={idx} className="w-9 h-9 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                            <SafeImg
                              src={logo.url}
                              alt=""
                              fallbackSrc={null}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </div>

                  {/* Upcoming Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Upcoming</span>
                    </div>
                    {team.upcomingGames > 0 && team.nextOpponent ? (
                      <span className="text-sm font-semibold text-gray-800 text-right truncate max-w-[60%]" title={team.nextOpponent}>{team.nextOpponent}</span>
                    ) : (
                      <span className="text-sm text-gray-400">None scheduled</span>
                    )}
                  </div>

                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeamClasses;
