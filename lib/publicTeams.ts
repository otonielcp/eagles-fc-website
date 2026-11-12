// Which teams the public site shows, and the data on their cards.
//
// The admin Teams list decides: every team there with "Show on Teams page"
// switched on (Team.isActive) is listed, in the admin's order. Teams that came
// from "Sync from FutbolCore" keep their FutbolCore id, and FutbolCore still
// supplies their roster, coach and games. Teams added by hand only have what
// the admin entered.
//
// No 'use server' here: these are server-side helpers, not public actions.
import connectDB from '@/lib/dbConnect';
import TeamModel from '@/models/Team';
import Player from '@/models/Player';
import Staff from '@/models/Staff';
import { getClubTeams } from '@/actions/futbolcore';
import { getFutbolCoreRosterWithMeta } from '@/lib/futbolcore';
import { getAllClubFixtures, type ClubFixture } from '@/lib/clubGames';
import { getTeamDisplayName } from '@/lib/teamName';
import type { Team } from '@/types/team';

export type VisibleTeam = Team & {
  /** Id used in /team/<routeId> URLs: the FutbolCore id when linked (keeps old links working), else the database id. */
  routeId: string;
};

type TeamDoc = {
  _id: unknown;
  name: string;
  shortName?: string;
  description?: string;
  category?: string;
  image?: string;
  order?: number;
  futbolcoreId?: string;
};

const ageOf = (category: string) => {
  const match = /U\s?(\d+)/i.exec(category || '');
  return match ? Number(match[1]) : 99;
};

function toVisibleTeam(doc: TeamDoc): VisibleTeam {
  const id = String(doc._id);
  const futbolcoreId = doc.futbolcoreId || undefined;
  return {
    _id: id,
    routeId: futbolcoreId || id,
    futbolcoreId,
    name: doc.name,
    shortName: getTeamDisplayName({ name: doc.name, shortName: doc.shortName, category: doc.category }),
    description: doc.description || '',
    category: doc.category || '',
    image: doc.image || '',
    isActive: true,
    order: doc.order ?? 0,
    sponsor: { name: '', logo: '', website: '', isActive: false },
    createdAt: '',
    updatedAt: '',
  };
}

/** Teams switched on in the admin, sorted by the admin's order, then youngest age group first. */
export async function getVisibleTeams(): Promise<VisibleTeam[]> {
  try {
    await connectDB();
    const docs = await TeamModel.find({ isActive: true })
      .select('name shortName description category image order futbolcoreId')
      .lean<TeamDoc[]>();
    return docs
      .map(toVisibleTeam)
      .sort((a, b) => a.order - b.order || ageOf(a.category) - ageOf(b.category) || a.name.localeCompare(b.name));
  } catch (error) {
    console.error('[teams] could not load the team list:', error);
    return [];
  }
}

/** The shown team for a /team/<routeId> URL, or undefined if it is hidden or does not exist. */
export function findVisibleTeam(teams: VisibleTeam[], routeId: string): VisibleTeam | undefined {
  return teams.find((team) => team.routeId === routeId);
}

/** Teams with `_id` set to the route id, for components that build /team/<_id> links. */
export function withRouteIds(teams: VisibleTeam[]): Team[] {
  return teams.map((team) => ({ ...team, _id: team.routeId }));
}

export type TeamCardData = Team & {
  totalPlayers: number;
  coaches: number;
  playerAvatars: { id: string; image: string; name: string }[];
  competitions: { name: string; logo: string | null }[];
  upcomingGames: number;
  nextOpponent: string;
  leagueLogos: { url: string }[];
};

/** Card data for the Teams page. `_id` is the route id, so cards link to /team/<_id>. */
export async function getTeamCards(): Promise<TeamCardData[]> {
  const teams = await getVisibleTeams();
  if (teams.length === 0) return [];

  const linked = teams.some((team) => team.futbolcoreId);
  const [fcTeams, fixtures] = linked
    ? await Promise.all([getClubTeams(), getAllClubFixtures().catch((): ClubFixture[] => [])])
    : [[], [] as ClubFixture[]];
  const fcById = new Map(fcTeams.map((team) => [team._id, team]));
  // Game dates are local calendar days; compare with today's date in Nebraska.
  const startOfToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date());

  return Promise.all(
    teams.map(async (team): Promise<TeamCardData> => {
      const card: TeamCardData = {
        ...team,
        _id: team.routeId,
        totalPlayers: 0,
        coaches: 0,
        // Players are minors: no names or photos are sent to the page.
        playerAvatars: [],
        competitions: [],
        upcomingGames: 0,
        nextOpponent: '',
        leagueLogos: [],
      };

      const fc = team.futbolcoreId ? fcById.get(team.futbolcoreId) : undefined;
      try {
        if (!fc) {
          // Added by hand: counts come from the admin's own player and staff lists.
          const [players, staff] = await Promise.all([
            Player.countDocuments({ teamId: team._id }),
            Staff.countDocuments({ teamId: team._id }),
          ]);
          return { ...card, totalPlayers: players, coaches: staff };
        }

        const roster = await getFutbolCoreRosterWithMeta(fc._id);

        // This team's games from the shared, cached club game list.
        const games = fixtures.filter((g) => g.homeTeamId === fc._id || g.awayTeamId === fc._id);
        const upcoming = games
          .filter((g) => g.status === 'SCHEDULED' && g.date >= startOfToday)
          .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
        const next = upcoming[0];
        const nextOpponent = next ? (next.homeTeamId === fc._id ? next.awayTeam : next.homeTeam).trim() : '';

        const seen = new Set<string>();
        const leagueLogos: { url: string }[] = [];
        for (const game of games) {
          const url = game.leagueLogo;
          if (url && !seen.has(url)) {
            seen.add(url);
            leagueLogos.push({ url });
          }
        }

        // A photo uploaded in the admin wins. A cleared photo shows the club's
        // generic card. Otherwise (the URL copied in by Sync) use FutbolCore's
        // current team image, as the page always has.
        const genericCard = roster.meta?.branding?.defaultTeamCardImageUrl || '';
        const image = team.image.startsWith('/api/images/')
          ? team.image
          : team.image
            ? roster.meta?.team?.teamImageUrl || fc.teamImage?.secure_url || genericCard
            : genericCard;

        return {
          ...card,
          image,
          totalPlayers: roster.players.length,
          coaches: fc.coach ? 1 : 0,
          upcomingGames: upcoming.length,
          nextOpponent,
          leagueLogos,
        };
      } catch (error) {
        console.error(`[teams] could not load details for ${team.name}:`, error);
        return card;
      }
    })
  );
}
