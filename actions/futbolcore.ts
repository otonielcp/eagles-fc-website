'use server';

import { getAllClubFixtures, type ClubFixture } from '@/lib/clubGames';
import { gameFilterOptions, type GameFilterOptions } from '@/lib/gameFilters';
import {
  getFutbolCoreTeams,
  getFutbolCoreRoster,
  getFutbolCoreRosterWithMeta,
  getFutbolCoreGames,
  getFutbolCoreBranding,
  type FutbolCoreTeam,
  type FutbolCoreGame,
  type FutbolCorePlayer,
} from '@/lib/futbolcore';

/**
 * Get all Eagles FC teams (excludes opponent teams)
 */
export async function getClubTeams() {
  try {
    const allTeams = await getFutbolCoreTeams();
    // Filter out opponent teams - only return Eagles FC teams
    const clubTeams = allTeams.filter(
      (team) => team.category !== 'Opponent'
    );
    return clubTeams;
  } catch (error) {
    console.error('Error fetching club teams from FutbolCore:', error);
    return [];
  }
}

/**
 * Get all opponent teams
 */
export async function getOpponentTeams() {
  try {
    const allTeams = await getFutbolCoreTeams();
    return allTeams.filter((team) => team.category === 'Opponent');
  } catch (error) {
    console.error('Error fetching opponent teams from FutbolCore:', error);
    return [];
  }
}

/**
 * Get roster for a specific team
 */
export async function getTeamRoster(teamId: string) {
  try {
    const roster = await getFutbolCoreRoster(teamId);
    return roster;
  } catch (error) {
    console.error(`Error fetching roster for team ${teamId}:`, error);
    return [];
  }
}

/**
 * Get roster for a specific team with branding/meta info
 */
export async function getTeamRosterWithBranding(teamId: string) {
  try {
    // Roster meta omits logoUrl, so pull it from the teams-endpoint branding.
    const [result, teamsBranding] = await Promise.all([
      getFutbolCoreRosterWithMeta(teamId),
      getFutbolCoreBranding(),
    ]);
    return {
      players: result.players,
      defaultPlayerImage: result.meta?.branding?.defaultPlayerImageUrl || '',
      teamImageUrl: result.meta?.team?.teamImageUrl || '',
      clubLogo: teamsBranding.logoUrl || result.meta?.branding?.logoUrl || '',
    };
  } catch (error) {
    console.error(`Error fetching roster with branding for team ${teamId}:`, error);
    return { players: [], defaultPlayerImage: '', teamImageUrl: '', clubLogo: '' };
  }
}

/**
 * Get games for a specific team
 */
export async function getTeamGames(teamId: string) {
  try {
    const games = await getFutbolCoreGames(teamId);
    return games;
  } catch (error) {
    console.error(`Error fetching games for team ${teamId}:`, error);
    return [];
  }
}

/**
 * Get all rosters across all Eagles FC teams
 */
export async function getAllClubRosters() {
  try {
    const clubTeams = await getClubTeams();
    const rostersWithTeam = await Promise.all(
      clubTeams.map(async (team) => {
        const roster = await getFutbolCoreRoster(team._id);
        return {
          team: {
            _id: team._id,
            name: team.name,
            shortName: team.shortName,
            category: team.category,
            season: team.season,
            logo: team.logo,
            coach: team.coach,
          },
          players: roster,
        };
      })
    );
    return rostersWithTeam;
  } catch (error) {
    console.error('Error fetching all club rosters:', error);
    return [];
  }
}

/**
 * Get a single FutbolCore game by ID (past or upcoming), in IFixture-compatible format.
 */
export async function getFutbolCoreFixtureById(gameId: string) {
  try {
    const fixture = (await getAllClubFixtures()).find((f) => f._id === gameId);
    if (!fixture) return null;

    // Add missing IFixture fields with defaults
    return {
      ...fixture,
      seasonYear: fixture.season,
      month: '',
      highlights: '',
      timeline: [] as { time: string; type: string; team: string; player?: string; assistedBy?: string; description?: string }[],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error fetching FutbolCore fixture ${gameId}:`, error);
    return null;
  }
}

/**
 * All club games, past and upcoming, oldest first (shared five-minute cache, see
 * lib/clubGames.ts). Callers pick upcoming or finished games themselves.
 */
export async function getClubFixtures(): Promise<ClubFixture[]> {
  try {
    return await getAllClubFixtures();
  } catch (error) {
    console.error('Error fetching club fixtures:', error);
    return [];
  }
}

/**
 * League, season and competition options for the Fixtures/Results filter menus,
 * taken from the club's FutbolCore games.
 */
export async function getClubGameFilters(): Promise<GameFilterOptions> {
  try {
    return gameFilterOptions(await getAllClubFixtures());
  } catch (error) {
    console.error('Error fetching game filter options:', error);
    return { leagues: [], seasons: [], competitions: [] };
  }
}
