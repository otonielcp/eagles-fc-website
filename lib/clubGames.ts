// Every Eagles FC game and team record from FutbolCore, shared by Fixtures,
// Results, match reports, the homepage and the Tables page.
//
// One list (past and upcoming games for every club team) is cached for five
// minutes. FutbolCore allows 60 requests a minute and each refresh costs one
// request per team, so pages must not each fetch their own copy.
//
// No 'use server' here: these are server-side helpers, not public actions.
import { unstable_cache } from 'next/cache';
import {
  getFutbolCoreBranding,
  getFutbolCoreGamesSince,
  getFutbolCoreTeams,
  type FutbolCoreGame,
} from '@/lib/futbolcore';
import { gameSeason } from '@/lib/gameFilters';

// Far enough back to include every game the club has entered.
const HISTORY_FROM = '2020-01-01';
const CACHE_SECONDS = 300;

export type ClubFixture = {
  _id: string;
  /** Calendar day, "YYYY-MM-DD". */
  date: string;
  time: string;
  stadium: string;
  field: string;
  /** Game type from FutbolCore, e.g. "league". */
  competition: string;
  competitionType: string;
  /** League name, e.g. "Nebraska Youth Soccer League"; empty when none is set. */
  league: string;
  /** Season the game falls in, e.g. "2026-2027" (August to July). */
  season: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  leagueLogo: string;
  channelLogo: string;
  /** "SCHEDULED", "COMPLETED", "CANCELLED", "POSTPONED", ... */
  status: string;
  homeScore: number;
  awayScore: number;
  matchReport: string;
  matchImage: string;
  title: string;
  location: string;
  venue: FutbolCoreGame['venue'];
  isHome: boolean;
  myTeamRole: FutbolCoreGame['myTeamRole'];
};

const extractField = (...sources: (string | undefined)[]) => {
  for (const s of sources) {
    if (!s) continue;
    const m = s.match(/Field\s+[\w-]+/i);
    if (m) return m[0];
  }
  return '';
};

function toClubFixture(game: FutbolCoreGame, clubLogo: string): ClubFixture {
  const eaglesIsHome = game.myTeamRole === 'HOME';
  const date = game.startDate.split('T')[0];
  return {
    _id: game._id,
    date,
    time: game.startTime,
    stadium: game.venue?.name || game.location || 'TBD',
    field: extractField(game.venue?.address, game.location),
    competition: game.type || 'League',
    competitionType: game.type || 'league',
    league: game.league?.name?.trim() || '',
    season: gameSeason(date),
    homeTeam: game.homeTeam.name,
    awayTeam: game.awayTeam.name,
    homeTeamId: game.homeTeam.id || '',
    awayTeamId: game.awayTeam.id || '',
    homeTeamLogo: eaglesIsHome ? clubLogo : game.homeTeam.logoUrl || '',
    awayTeamLogo: eaglesIsHome ? game.awayTeam.logoUrl || '' : clubLogo,
    leagueLogo: game.leagueLogo?.secure_url || '',
    channelLogo: '',
    status: game.status === 'scheduled' ? 'SCHEDULED' : (game.status || '').toUpperCase(),
    homeScore: Number(game.score?.home) || 0,
    awayScore: Number(game.score?.away) || 0,
    matchReport: '',
    matchImage: '/gameresultbg.jpeg',
    title: game.title,
    location: game.location,
    venue: game.venue,
    isHome: game.isHome,
    myTeamRole: game.myTeamRole,
  };
}

async function loadClubFixtures(): Promise<ClubFixture[]> {
  const [teams, branding] = await Promise.all([getFutbolCoreTeams(), getFutbolCoreBranding()]);
  const clubTeams = teams.filter((team) => team.category !== 'Opponent');

  // A failure throws, so a partial list is never cached.
  const perTeam = await Promise.all(clubTeams.map((team) => getFutbolCoreGamesSince(team._id, HISTORY_FROM)));

  const byId = new Map<string, FutbolCoreGame>();
  for (const games of perTeam) for (const game of games) if (!byId.has(game._id)) byId.set(game._id, game);

  return [...byId.values()]
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .map((game) => toClubFixture(game, branding.logoUrl || ''));
}

/** All club games, past and upcoming, oldest first. Throws if FutbolCore cannot be reached. */
export const getAllClubFixtures = unstable_cache(loadClubFixtures, ['futbolcore-club-fixtures-v1'], {
  revalidate: CACHE_SECONDS,
});

/** Finished games, newest first. Empty if FutbolCore cannot be reached. */
export async function getClubResults(): Promise<ClubFixture[]> {
  try {
    const fixtures = await getAllClubFixtures();
    return fixtures
      .filter((f) => f.status === 'COMPLETED')
      .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
  } catch (error) {
    console.error('[futbolcore] could not load results:', error);
    return [];
  }
}

export type TeamRecord = {
  teamId: string;
  name: string;
  category: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

const ageOf = (category: string) => {
  const match = /U\s?(\d+)/i.exec(category || '');
  return match ? Number(match[1]) : 99;
};

async function loadTeamRecords(): Promise<TeamRecord[]> {
  const teams = await getFutbolCoreTeams();
  return teams
    .filter((team) => team.category !== 'Opponent')
    .map((team) => {
      const s = team.statistics;
      const won = Number(s?.wins) || 0;
      const drawn = Number(s?.draws) || 0;
      const goalsFor = Number(s?.goalsFor) || 0;
      const goalsAgainst = Number(s?.goalsAgainst) || 0;
      return {
        teamId: team._id,
        name: team.name.replace(/\s+/g, ' ').trim(),
        category: team.category || '',
        logo: team.logoUrl || team.logo?.secure_url || '',
        played: Number(s?.matchesPlayed) || 0,
        won,
        drawn,
        lost: Number(s?.losses) || 0,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points: won * 3 + drawn,
      };
    })
    .sort((a, b) => ageOf(a.category) - ageOf(b.category) || a.name.localeCompare(b.name));
}

/**
 * Season record (played, won, drawn, lost, goals) of every club team, as
 * FutbolCore keeps it. FutbolCore has no league standings, so this is the table.
 */
export const getClubTeamRecords = unstable_cache(loadTeamRecords, ['futbolcore-team-records-v1'], {
  revalidate: CACHE_SECONDS,
});
