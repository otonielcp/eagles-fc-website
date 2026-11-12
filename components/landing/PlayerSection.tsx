'use client';

import { Player } from '@/types/team';
import Link from 'next/link';
import SafeImg from './SafeImg';

const DEFAULT_CLUB_LOGO = '/EAGLES-CREST.png';

interface PlayerSectionProps {
  title: string;
  players: Player[];
  fallbackImage?: string;
  cardBackground?: string;
}

const PlayerSection = ({ title, players, fallbackImage, cardBackground }: PlayerSectionProps) => {
  const fallback = fallbackImage || DEFAULT_CLUB_LOGO;

  const cardStyle = cardBackground
    ? {
        backgroundImage: `url(${cardBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'radial-gradient(circle, #474747 0%, #000000 100%)',
      };

  return (
    <div className="max-w-[1400px] w-9/12 mx-auto my-8">
      <h2 className="text-xs sm:text-sm uppercase font-semibold text-[#C5A464] mb-3">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <Link key={player._id} href={`/team/${player.teamId}/players/${player._id}`}>
            <div
              className="rounded-md overflow-hidden aspect-square relative bg-black"
              style={cardStyle}
            >
              {/* Players are minors (U7–U15): never render player.image, only the club logo. */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <SafeImg
                  src={fallback}
                  alt=""
                  className="w-3/5 h-3/5 object-contain"
                />
              </div>

              <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent z-20">
                <div className="flex flex-col">
                  <span className="text-white underline underline-offset-[10px] decoration-[2px] decoration-[#C5A464] text-lg font-bold">{player.jerseyNumber}</span>
                  <div className="pt-1.5 mt-1">
                    <h3 className="text-white text-2xl font-bold uppercase tracking-tight">{player.displayName.split(' ').pop()}</h3>
                    <h3 className="text-white text-2xl font-bold uppercase tracking-tight">{player.displayName.split(' ').slice(0, -1).join(' ')}</h3>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlayerSection;
