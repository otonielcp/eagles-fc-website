'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { IFixture } from '@/types/fixtures';

interface MatchReportHeroProps {
  fixture: IFixture;
}

export function MatchReportHero({ fixture }: MatchReportHeroProps) {
  // Determine winner
  const homeWins = fixture.homeScore > fixture.awayScore;
  const awayWins = fixture.awayScore > fixture.homeScore;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={fixture.matchImage || "https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBtYXRjaCUyMHN0YWRpdW18ZW58MXx8fHwxNzY4NTgzMDc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
          alt="Stadium background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Match Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <span className="inline-flex items-center px-8 py-3 rounded-full bg-amber-500 text-black text-sm font-black tracking-widest uppercase">
              {fixture.status || 'FULL TIME'}
            </span>
          </motion.div>

          {/* Score Display - Horizontal Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-16"
          >
            {/* Home Team - LEFT SIDE */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center text-center lg:flex-row lg:gap-6"
            >
              <div className="w-32 h-32 lg:w-40 lg:h-40 mb-4 lg:mb-0 flex items-center justify-center">
                <img
                  src={fixture.homeTeamLogo}
                  alt={fixture.homeTeam}
                  className="w-32 h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
                />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-white text-2xl lg:text-4xl font-black mb-2 leading-tight">
                  {fixture.homeTeam}
                </h2>
                <p className={`${homeWins ? 'text-amber-500' : 'text-white/60'} text-sm uppercase tracking-wider font-bold`}>
                  Home Team{homeWins ? ' • Winner' : ''}
                </p>
              </div>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="flex items-center justify-center gap-8 lg:gap-12 px-8"
            >
              <div className={`text-7xl lg:text-9xl font-black ${homeWins ? 'text-amber-500' : 'text-white'}`}>
                {fixture.homeScore}
              </div>
              <div className="text-5xl lg:text-7xl font-light text-white/30">-</div>
              <div className={`text-7xl lg:text-9xl font-black ${awayWins ? 'text-amber-500' : 'text-white'}`}>
                {fixture.awayScore}
              </div>
            </motion.div>

            {/* Away Team - RIGHT SIDE */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center text-center lg:flex-row lg:gap-6"
            >
              <div className="lg:order-2 w-32 h-32 lg:w-40 lg:h-40 mb-4 lg:mb-0 flex items-center justify-center">
                <img
                  src={fixture.awayTeamLogo}
                  alt={fixture.awayTeam}
                  className="w-32 h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
                />
              </div>
              <div className="lg:order-1 text-center lg:text-right">
                <h2 className="text-white text-2xl lg:text-4xl font-black mb-2 leading-tight">
                  {fixture.awayTeam}
                </h2>
                <p className="text-white/60 text-sm uppercase tracking-wider">Away Team{awayWins ? ' • Winner' : ''}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Match Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Calendar size={20} className="text-amber-500" />
              <span className="text-white text-sm font-medium">
                {new Date(fixture.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <MapPin size={20} className="text-amber-500" />
              <span className="text-white text-sm font-medium">{fixture.stadium}</span>
            </div>
          </motion.div>

          {/* League Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <div className="px-6 py-3 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
              <p className="text-white/70 text-sm uppercase tracking-wider font-medium">{fixture.competition}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
