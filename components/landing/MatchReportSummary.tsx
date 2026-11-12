'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { IFixture } from '@/types/fixtures';
import Link from 'next/link';
import { parseLocalDate } from './landingUtils';
import SafeImg from './SafeImg';

interface MatchReportSummaryProps {
  fixture: IFixture;
}

// Fixtures carry no per-match statistics (possession, shots, corners…), so this
// section only shows the match details we actually have. Add a stats block here
// once real statistics fields exist on IFixture.
export function MatchReportSummary({ fixture }: MatchReportSummaryProps) {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <div className="inline-block px-4 py-1.5 bg-white rounded-full mb-4 shadow-sm">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Details</span>
            </div>
            <h2 className="text-5xl font-bebas text-zinc-900 mb-3">Match Information</h2>
          </div>

          {/* Details Container */}
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
            {/* Team Headers */}
            <div className="bg-gradient-to-br from-zinc-50 to-white px-8 py-8 border-b border-zinc-200">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-zinc-200 overflow-hidden">
                    <SafeImg
                      src={fixture.awayTeamLogo}
                      alt={fixture.awayTeam}
                      fallbackSrc={null}
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
                    <SafeImg
                      src={fixture.homeTeamLogo}
                      alt={fixture.homeTeam}
                      fallbackSrc={null}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-gradient-to-br from-zinc-50 to-white px-8 py-8">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">
                      {parseLocalDate(fixture.date).toLocaleDateString('en-US', {
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
                    <span className="text-sm font-semibold text-zinc-700">
                      {[fixture.stadium, fixture.competition].filter(Boolean).join(' • ')}
                    </span>
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
