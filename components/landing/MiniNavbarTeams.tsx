"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Team } from '@/types/team';

interface MiniNavbarTeamsProps {
  currentTeam: Team;
  similarTeams: Team[];
}

const MiniNavbarTeams = ({ currentTeam, similarTeams }: MiniNavbarTeamsProps) => {
  const currentPath = usePathname();

  return (
    <div className="border-b border-gray-200 bg-gray-50 shadow-lg w-full overflow-x-auto">
      <div className="flex justify-start ml-20 space-x-8 text-gray-500 uppercase text-sm tracking-wide px-6 py-3 whitespace-nowrap">
        {similarTeams.map((team) => (
          <Link key={team._id} href={`/team/${team._id}`}>
            <button
              className={`relative py-2 ${
                team._id === currentTeam._id
                  ? "text-black"
                  : "hover:text-gray-700"
              }`}
            >
              {team.shortName}
              {team._id === currentTeam._id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A464]"></div>
              )}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MiniNavbarTeams;
