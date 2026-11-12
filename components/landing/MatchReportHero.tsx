'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { IFixture } from '@/types/fixtures';
import { hasRealScore, isMatchFinished, parseLocalDate } from './landingUtils';
import SafeImg from './SafeImg';

interface MatchReportHeroProps {
  fixture: IFixture;
}

export function MatchReportHero({ fixture }: MatchReportHeroProps) {
  // Only show a score for matches that have actually kicked off; an unplayed
  // fixture's 0-0 defaults are not a result.
  const showScore = hasRealScore(fixture.status);
  const finished = isMatchFinished(fixture.status);

  // Determine winner (only meaningful once the match is over)
  const homeWins = finished && fixture.homeScore > fixture.awayScore;
  const awayWins = finished && fixture.awayScore > fixture.homeScore;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <SafeImg
          src={fixture.matchImage || "/gameresultbg.jpeg"}
          fallbackSrc="/gameresultbg.jpeg"
          alt="Stadium background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* League Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            {fixture.leagueLogo ? (
              <SafeImg src={fixture.leagueLogo} alt={fixture.competition} fallbackSrc={null} className="h-28 w-auto object-contain drop-shadow-lg" />
            ) : (
              <p className="text-white/70 text-sm uppercase tracking-wider font-medium">{fixture.competition}</p>
            )}
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
                <SafeImg
                  src={fixture.homeTeamLogo}
                  alt={fixture.homeTeam}
                  fallbackSrc={null}
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
              {showScore ? (
                <>
                  <div className={`text-7xl lg:text-9xl font-black ${homeWins ? 'text-amber-500' : 'text-white'}`}>
                    {fixture.homeScore}
                  </div>
                  <div className="text-5xl lg:text-7xl font-light text-white/30">-</div>
                  <div className={`text-7xl lg:text-9xl font-black ${awayWins ? 'text-amber-500' : 'text-white'}`}>
                    {fixture.awayScore}
                  </div>
                </>
              ) : (
                <div className="text-5xl lg:text-7xl font-black text-white/70">VS</div>
              )}
            </motion.div>

            {/* Away Team - RIGHT SIDE */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center text-center lg:flex-row lg:gap-6"
            >
              <div className="lg:order-2 w-32 h-32 lg:w-40 lg:h-40 mb-4 lg:mb-0 flex items-center justify-center">
                <SafeImg
                  src={fixture.awayTeamLogo}
                  alt={fixture.awayTeam}
                  fallbackSrc={null}
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
                {parseLocalDate(fixture.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {!finished && fixture.time ? ` · ${fixture.time}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <MapPin size={20} className="text-amber-500" />
              <span className="text-white text-sm font-medium">{fixture.stadium}</span>
            </div>
          </motion.div>

          {/* Match Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <span className="inline-flex items-center px-8 py-3 rounded-full bg-amber-500 text-black text-sm font-black tracking-widest uppercase">
              {finished ? 'FULL TIME' : (fixture.status || 'SCHEDULED')}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
