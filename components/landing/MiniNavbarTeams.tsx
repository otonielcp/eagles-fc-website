"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Team } from '@/types/team';

interface MiniNavbarTeamsProps {
  currentTeam: Team;
  similarTeams: Team[];
}

const label = (team: Team) => team.shortName || team.name;

const MiniNavbarTeams = ({ currentTeam, similarTeams }: MiniNavbarTeamsProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close after navigating to another team.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // The club runs 17 teams, which is far too many for a flat list — group by age
  // bracket so the eye can jump straight to it. Sort on the number rather than
  // the string, or "U10" lands before "U7".
  const groups = useMemo(() => {
    const ageOf = (category: string) => {
      const match = (category || '').match(/\d+/);
      return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
    };

    const byCategory = new Map<string, Team[]>();
    for (const team of similarTeams) {
      const key = team.category || 'Other';
      const bucket = byCategory.get(key);
      if (bucket) bucket.push(team);
      else byCategory.set(key, [team]);
    }

    return [...byCategory.entries()]
      .sort(([a], [b]) => ageOf(a) - ageOf(b) || a.localeCompare(b))
      .map(([category, teams]) => ({
        category,
        teams: [...teams].sort((a, b) => label(a).localeCompare(label(b))),
      }));
  }, [similarTeams]);

  return (
    <div className="border-b border-gray-200 bg-gray-50 w-full">
      <div className="px-4 py-3 md:pl-80 lg:pl-96 xl:pl-[28rem]">
        <div className="relative inline-block text-left" ref={containerRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 shadow-sm transition-colors duration-200 hover:border-[#BD9B58] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BD9B58]/50"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Team
            </span>
            <span className="max-w-[60vw] truncate text-sm font-semibold text-gray-900 sm:max-w-none">
              {label(currentTeam)}
            </span>
            <svg
              className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div
              role="menu"
              aria-label="Select a team"
              className="absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-lg py-2 shadow-2xl"
              style={{ backgroundColor: '#1f1f20' }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent" />

              {groups.map(({ category, teams }) => (
                <div key={category} className="py-1">
                  <div className="px-5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {category}
                  </div>
                  {teams.map((team) => {
                    const isCurrent = team._id === currentTeam._id;
                    return (
                      <Link
                        key={team._id}
                        href={`/team/${team._id}`}
                        role="menuitem"
                        aria-current={isCurrent ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                        className={`group/item flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200 hover:bg-white/5 ${
                          isCurrent ? 'text-white' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full bg-[#BD9B58] transition-opacity duration-200 ${
                            isCurrent ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'
                          }`}
                        />
                        <span className={`tracking-wide ${isCurrent ? 'font-semibold' : 'font-medium'}`}>
                          {label(team)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniNavbarTeams;
