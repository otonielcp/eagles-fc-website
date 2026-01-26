'use client';

import { motion } from 'framer-motion';
import { IFixture, ITimelineEvent } from '@/types/fixtures';

interface MatchReportTimelineProps {
  fixture: IFixture;
}

export function MatchReportTimeline({ fixture }: MatchReportTimelineProps) {
  const timelineEvents = fixture.timeline || [];

  // Filter only goal events for the vertical timeline
  const goalEvents: Array<ITimelineEvent & { team: 'home' | 'away' }> = timelineEvents
    .filter(event => event.type.toLowerCase() === 'goal')
    .map(event => ({
      ...event,
      team: event.team === fixture.homeTeam ? 'home' as const : 'away' as const
    }));

  if (goalEvents.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-20 text-center">
              <div className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full mb-4">
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Timeline</span>
              </div>
              <h2 className="text-5xl font-black text-zinc-900 tracking-tight">Match Events</h2>
            </div>
            <div className="py-8 text-center">
              <p className="text-gray-500">No timeline events available for this match yet.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <div className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full mb-4">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Timeline</span>
            </div>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tight">Match Events</h2>
          </div>

          {/* Vertical Timeline */}
          <div className="relative py-4">
            {/* Vertical Line with gradient */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-200 -translate-x-1/2" />

            {/* Timeline Events */}
            <div className="space-y-16">
              {goalEvents.map((event, index) => {
                const isHome = event.team === 'home';

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex items-center"
                  >
                    {/* Left Side (Away Team) */}
                    <div className={`w-1/2 ${isHome ? '' : 'pr-12 flex justify-end'}`}>
                      {!isHome && (
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-sm shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="8" />
                              </svg>
                            </div>
                            <div className="text-3xl font-black text-zinc-900">{event.time}&apos;</div>
                          </div>
                          <p className="text-lg font-bold text-zinc-900 mb-1">{event.player}</p>
                          {event.assistedBy && (
                            <p className="text-sm text-zinc-600 mb-2">Assist: {event.assistedBy}</p>
                          )}
                          <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                            {fixture.awayTeam}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Center Dot with pulse effect */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.12 + 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                        className="relative"
                      >
                        <div className={`w-5 h-5 rounded-full ${
                          isHome ? 'bg-amber-500' : 'bg-blue-600'
                        } ring-4 ring-white shadow-lg`} />
                        <div className={`absolute inset-0 rounded-full ${
                          isHome ? 'bg-amber-500' : 'bg-blue-600'
                        } animate-ping opacity-20`} />
                      </motion.div>
                    </div>

                    {/* Right Side (Home Team) */}
                    <div className={`w-1/2 ${isHome ? 'pl-12' : ''}`}>
                      {isHome && (
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-sm shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="8" />
                              </svg>
                            </div>
                            <div className="text-3xl font-black text-zinc-900">{event.time}&apos;</div>
                          </div>
                          <p className="text-lg font-bold text-zinc-900 mb-1">{event.player}</p>
                          {event.assistedBy && (
                            <p className="text-sm text-zinc-600 mb-2">Assist: {event.assistedBy}</p>
                          )}
                          <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                            {fixture.homeTeam}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full Time Marker */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: goalEvents.length * 0.12 + 0.4, type: 'spring', stiffness: 200 }}
              className="relative mt-16 pt-12"
            >
              <div className="absolute left-1/2 -translate-x-1/2">
                <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center shadow-lg ring-4 ring-white">
                  <span className="text-base font-black text-white">FT</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
