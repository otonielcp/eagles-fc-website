"use client"

import React from "react";
import { Player, Team } from "@/types/team";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { calculateAge } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PlayerProfileProps {
  player: Player;
  team: Team;
  teamPlayers: Player[];
  teamAvg?: {
    [key: string]: number;
  };
}

import { Goal, Trophy, Timer, RotateCcw, FileText, ShieldAlert } from "lucide-react"; // Importing icons
const britishFlag = "/britishflag.png"; // Ensure this image exists
const goal = "/icons/goal.png"; // Ensure this image exists
const assist = "/icons/assist.png"; // Ensure this image exists
const yellowCard = "/icons/yellowcard.png"; // Ensure this image exists
const redCard = "/icons/redcard.png"; // Ensure this image exists
const doubleYellow = "/icons/doubleyellows.png"; // Ensure this image exists
const foul = "/icons/fouls.png"; // Ensure this image exists
const penalties = "/icons/penalties.png"; // Ensure this image exists
const starts = "/icons/starts.png"; // Ensure this image exists
const substitutions = "/icons/substitutions.png"; // Ensure this image exists


const PlayerProfile = ({ player, team, teamPlayers, teamAvg }: PlayerProfileProps) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(player._id);
  const router = useRouter();

  useEffect(() => {
    if (selectedPlayerId && selectedPlayerId !== player._id) {
      router.push(`/team/${team._id}/players/${selectedPlayerId}`);
    }
  }, [selectedPlayerId, team._id, router, player._id]);

  return (
    <div className="w-11/12 mx-auto px-6 md:px-12 py-10">
      {/* Player Profile Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Section - Player Info & Image */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-6">
            {/* Player Number */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-500">{player.jerseyNumber}</h1>
            <div className="w-full">
              <h2 className="text-xl md:text-lg font-bold text-gray-600">{player.firstName}</h2>
              <div className="w-[1700px] h-[1.5px] bg-gray-300 my-1"></div>
              <h2 className="text-3xl sm:text-4xl text-gray-500">{player.lastName}</h2>
            </div>
          </div>


          {/* Player Image */}
          <img src={player.image} alt="Isaiah Cortez" className="h-[450px] mx-auto" />

          {/* Player Bio */}
          <p className="text-gray-500 text-xs sm:text-sm mt-6 leading-6 text-center md:text-left">
            {player.biography}
          </p>
        </div>

        {/* Right Section - Player Details */}
        <div className="mt-4 md:-mt-5">
          {/* Dropdown Selector */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <select
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                value={player._id}
                className="appearance-none p-2 sm:p-3 px-10 sm:px-14 rounded-full bg-[#BD9B58] text-white shadow-md hover:shadow-lg focus:outline-none transition duration-300"
              >
                {teamPlayers.map((teamPlayer) => (
                  <option
                    key={teamPlayer._id}
                    value={teamPlayer._id}
                    className={teamPlayer._id === player._id ? "font-bold" : ""}
                  >
                    {teamPlayer.jerseyNumber}. {teamPlayer.firstName} {teamPlayer.lastName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Player Attributes */}
          <div className="mt-6 space-y-4">
            {[
              { title: "NATIONALITY", value: player.nationality, flag: britishFlag },
              { title: "POSITION", value: player.position },
              { title: "HEIGHT", value: player.height },
              { title: "WEIGHT", value: player.weight },
              { title: "CURRENT TEAM", value: team.name, className: "text-[#BD9B58]" },
            ].map((item, index) => (
              <div key={index} className="pb-3 border-b border-gray-300">
                <h3 className="text-base sm:text-lg text-gray-500 uppercase font-bebas">{item.title}</h3>
                <div className={`text-gray-500 text-xs sm:text-sm mt-1 ${item.className ? `${item.className}` : ""} flex items-center`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>


          {/* Statistics Table */}
          <div className="mt-8">
            <div className="flex justify-between text-[#C9A35D] items-center border-b pb-2">
              <h3 className="text-lg sm:text-xl font-bold">STATS</h3>
              {teamAvg && (
                <span className="text-xs text-gray-500">Showing team averages for {teamPlayers.filter(p => p.isActive).length} active players</span>
              )}
            </div>

            {/* Stats Grid - Now Styled as Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {[
                { icon: <img src={goal} alt="Goal" className="w-[18px] h-[18px] object-contain" />, label: "GOALS", value: player.stats.goals, key: "goals" },
                { icon: <img src={assist} alt="Assist" className="w-[18px] h-[18px] object-contain" />, label: "ASSISTS", value: player.stats.assists, key: "assists" },
                { icon: <Trophy size={18} />, label: "SHOTS", value: player.stats.shots, key: "shots" },
                { icon: <img src={goal} alt="Goal" className="w-[18px] h-[18px] object-contain" />, label: "MATCHES PLAYED", value: player.stats.matchesPlayed, key: "matchesPlayed" },
                { icon: <Timer size={18} />, label: "MINUTES", value: player.stats.minutes, key: "minutes" },
                { icon: <img src={starts} alt="Starts" className="w-[18px] h-[18px] object-contain" />, label: "STARTS", value: player.stats.starts, key: "starts" },
                { icon: <img src={substitutions} alt="Substitutions" className="w-[18px] h-[18px] object-contain" />, label: "SUBSTITUTIONS", value: player.stats.substitutions, key: "substitutions" },
                { icon: <img src={foul} alt="Fouls" className="w-[18px] h-[18px] object-contain" />, label: "FOULS", value: player.stats.fouls, key: "fouls" },
                { icon: <img src={penalties} alt="Penalties" className="w-[18px] h-[18px] object-contain" />, label: "PENALTIES", value: player.stats.penalties, key: "penalties" },
                { icon: <img src={yellowCard} alt="Yellow Card" className="w-[18px] h-[18px] object-contain" />, label: "YELLOW CARDS", value: player.stats.yellowCards, key: "yellowCards" },
                { icon: <img src={redCard} alt="Red Card" className="w-[18px] h-[18px] object-contain" />, label: "RED CARDS", value: player.stats.redCards, key: "redCards" },
                { icon: <img src={doubleYellow} alt="Double Yellow" className="w-[18px] h-[18px] object-contain" />, label: "DOUBLE YELLOW", value: player.stats.doubleYellowCards, key: "doubleYellowCards" },
              ].map((stat, index) => {
                // Get team average for this stat
                const teamAverage = teamAvg ? teamAvg[stat.key as keyof typeof teamAvg] : null;
                
                // Calculate comparison to team average
                const comparedToAvg = teamAverage !== null && teamAverage > 0 
                  ? Math.round((stat.value / teamAverage) * 100 - 100) 
                  : 0;
                
                // Determine color based on comparison
                const comparisonColor = comparedToAvg > 0 
                  ? 'text-green-600' 
                  : comparedToAvg < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600';

                return (
                  <div key={index} className="bg-gray-100 p-4 inline-block rounded-lg w-auto">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">{stat.label}</span>
                      <span className="flex-shrink-0">{stat.icon}</span>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {teamAvg && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">Team avg: {teamAverage?.toFixed(1)}</span>
                        {comparedToAvg !== 0 && (
                          <span className={`text-xs ${comparisonColor}`}>
                            {comparedToAvg > 0 ? '+' : ''}{comparedToAvg}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlayerProfile;