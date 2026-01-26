'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, TrendingUp } from 'lucide-react';
import { IFixture } from '@/types/fixtures';
import Link from 'next/link';

interface MatchReportSummaryProps {
  fixture: IFixture;
}

export function MatchReportSummary({ fixture }: MatchReportSummaryProps) {
  // For now, we'll use placeholder stats
  // TODO: Add statistics fields to the IFixture interface
  const stats = [
    { label: 'Possession', away: 42, home: 58 },
    { label: 'Shots on Target', away: 3, home: 8 },
    { label: 'Shots', away: 12, home: 18 },
    { label: 'Corners', away: 4, home: 6 },
    { label: 'Fouls', away: 9, home: 7 },
    { label: 'Offsides', away: 2, home: 3 },
  ];

  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <div className="inline-block px-4 py-1.5 bg-white rounded-full mb-4 shadow-sm">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Analysis</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tight mb-3">Match Statistics</h2>
            <p className="text-lg text-zinc-600">Complete performance breakdown</p>
          </div>

          {/* Stats Container */}
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
            {/* Team Headers */}
            <div className="bg-gradient-to-br from-zinc-50 to-white px-8 py-8 border-b border-zinc-200">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-zinc-200 overflow-hidden">
                    <img
                      src={fixture.awayTeamLogo}
                      alt={fixture.awayTeam}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 text-base uppercase tracking-tight">{fixture.awayTeam}</p>
                    <p className="text-sm text-zinc-500 font-semibold">Away</p>
                  </div>
                </div>

                <div className="px-6 py-2 bg-zinc-100 rounded-full">
                  <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">vs</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-black text-zinc-900 text-base uppercase tracking-tight">{fixture.homeTeam}</p>
                    <p className="text-sm text-zinc-500 font-semibold">Home</p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-zinc-200 overflow-hidden">
                    <img
                      src={fixture.homeTeamLogo}
                      alt={fixture.homeTeam}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats List */}
            <div className="p-8">
              <div className="max-w-4xl mx-auto space-y-8">
                {stats.map((stat, index) => {
                  const total = stat.away + stat.home;
                  const awayWidth = (stat.away / total) * 100;
                  const homeWidth = (stat.home / total) * 100;

                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, duration: 0.5 }}
                    >
                      {/* Stat Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-zinc-900 w-20 text-left">
                          {stat.away}
                        </span>
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-zinc-400" />
                          <span className="text-sm font-bold text-zinc-600 uppercase tracking-wider">
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-2xl font-black text-zinc-900 w-20 text-right">
                          {stat.home}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-1 h-3 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${awayWidth}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 + 0.2 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${homeWidth}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 + 0.2 }}
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-gradient-to-br from-zinc-50 to-white px-8 py-8 border-t border-zinc-200">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">
                      {new Date(fixture.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">{fixture.stadium} • {fixture.competition}</span>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/fixtures"
                    className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors shadow-lg inline-block"
                  >
                    View All Fixtures
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
