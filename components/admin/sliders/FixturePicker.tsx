"use client";

import { useEffect, useMemo, useState } from "react";
import { getClubFixtures } from "@/actions/futbolcore";
import { Loader2, Search, Calendar, MapPin, X } from "lucide-react";

export interface PickedFixture {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  leagueLogo: string;
  date: string;
  time: string;
  stadium: string;
  field?: string;
  matchDateISO: string;
  matchTimeDisplay: string;
  matchLocation: string;
}

interface FixturePickerProps {
  onSelect: (fixture: PickedFixture) => void;
}

function buildDateTimeLocal(dateStr: string, timeStr: string): string {
  if (!dateStr) return "";
  const time = (timeStr || "00:00:00").slice(0, 5);
  return `${dateStr}T${time}`;
}

function formatTimeLabel(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, m] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function FixturePicker({ onSelect }: FixturePickerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open || fixtures.length > 0) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getClubFixtures();
        if (cancelled) return;
        const sorted = [...data].sort((a: any, b: any) => {
          const ka = `${a.date}T${a.time || "00:00:00"}`;
          const kb = `${b.date}T${b.time || "00:00:00"}`;
          return ka.localeCompare(kb);
        });
        setFixtures(sorted);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, fixtures.length]);

  const filtered = useMemo(() => {
    if (!query.trim()) return fixtures;
    const q = query.toLowerCase();
    return fixtures.filter((f: any) =>
      [f.homeTeam, f.awayTeam, f.stadium, f.competition]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(q))
    );
  }, [query, fixtures]);

  const handlePick = (f: any) => {
    const matchLocation = [f.stadium, f.field].filter(Boolean).join(" · ");
    onSelect({
      _id: f._id,
      homeTeam: f.homeTeam,
      awayTeam: f.awayTeam,
      homeTeamLogo: f.homeTeamLogo,
      awayTeamLogo: f.awayTeamLogo,
      leagueLogo: f.leagueLogo,
      date: f.date,
      time: f.time,
      stadium: f.stadium,
      field: f.field,
      matchDateISO: buildDateTimeLocal(f.date, f.time),
      matchTimeDisplay: formatTimeLabel(f.time),
      matchLocation,
    });
    setOpen(false);
  };

  if (!open) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Auto-fill from an upcoming fixture
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Pick a match pulled live from the FutbolCore API — team logos, date, time, and venue populate for you.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex-shrink-0 inline-flex items-center gap-2 rounded-md bg-[#C5A464] text-white px-3 py-2 text-sm font-medium hover:bg-[#B39355] transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Select Fixture
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div>
          <p className="text-sm font-semibold text-gray-900">Select a fixture</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {loading ? "Loading…" : `${filtered.length} fixture${filtered.length === 1 ? "" : "s"} available`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by team, venue, or competition"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464]/30 focus:border-[#C5A464]"
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {loading && (
          <div className="p-6 flex items-center justify-center text-sm text-gray-500 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Fetching fixtures…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">No fixtures match your search.</div>
        )}
        {!loading &&
          filtered.map((f: any) => (
            <button
              key={f._id}
              type="button"
              onClick={() => handlePick(f)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                {f.homeTeamLogo && (
                  <img src={f.homeTeamLogo} alt="" className="w-8 h-8 object-contain" />
                )}
                <span className="text-xs text-gray-400">vs</span>
                {f.awayTeamLogo && (
                  <img src={f.awayTeamLogo} alt="" className="w-8 h-8 object-contain" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {f.homeTeam} — {f.awayTeam}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateLabel(f.date)} · {formatTimeLabel(f.time)}
                  </span>
                  {f.stadium && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3" />
                      {f.stadium}
                      {f.field ? ` · ${f.field}` : ""}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
