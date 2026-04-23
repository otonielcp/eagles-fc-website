'use server';

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
 * Get all games across all Eagles FC teams
 */
export async function getAllClubGames() {
  try {
    const clubTeams = await getClubTeams();
    const allGamesArrays = await Promise.all(
      clubTeams.map((team) => getFutbolCoreGames(team._id))
    );

    // Flatten and deduplicate by _id
    const seen = new Set<string>();
    const allGames: FutbolCoreGame[] = [];
    for (const games of allGamesArrays) {
      for (const game of games) {
        if (!seen.has(game._id)) {
          seen.add(game._id);
          allGames.push(game);
        }
      }
    }

    // Sort by startDate ascending
    allGames.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return allGames;
  } catch (error) {
    console.error('Error fetching all club games:', error);
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
 * Get club teams enriched with player counts, coach info, and game counts.
 * Designed to integrate with the existing teams page.
 */
export async function getEnrichedClubTeams() {
  try {
    const clubTeams = await getClubTeams();

    const enrichedTeams = await Promise.all(
      clubTeams.map(async (team) => {
        const [rosterResult, games] = await Promise.all([
          getFutbolCoreRosterWithMeta(team._id),
          getFutbolCoreGames(team._id),
        ]);

        const roster = rosterResult.players;
        const meta = rosterResult.meta;
        const branding = meta?.branding;
        const teamImageUrl = meta?.team?.teamImageUrl || team.teamImage?.secure_url || branding?.defaultTeamCardImageUrl || '';

        // Upcoming games sorted by date
        const now = new Date();
        const upcoming = games
          .filter((g) => new Date(g.startDate) >= now && g.status === 'scheduled')
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        const upcomingGames = upcoming.length;

        // Next opponent name
        let nextOpponent = '';
        if (upcoming.length > 0) {
          const next = upcoming[0];
          nextOpponent = next.myTeamRole === 'HOME'
            ? next.awayTeam.name.trim()
            : next.homeTeam.name.trim();
        }

        // Extract unique league logos from games
        const seenLogos = new Set<string>();
        const leagueLogos: { url: string }[] = [];
        for (const game of games) {
          if (game.leagueLogo?.secure_url && !seenLogos.has(game.leagueLogo.secure_url)) {
            seenLogos.add(game.leagueLogo.secure_url);
            leagueLogos.push({ url: game.leagueLogo.secure_url });
          }
        }

        // Get player avatars (first 4 with profile images, fallback to default)
        const defaultPlayerImg = branding?.defaultPlayerImageUrl || '';
        const playerAvatars = roster
          .slice(0, 4)
          .map((p) => ({
            id: p._id,
            image: p.profileImage || defaultPlayerImg,
            name: `${p.firstName} ${p.lastName}`,
          }));

        return {
          _id: team._id,
          name: team.name,
          shortName: team.shortName || '',
          description: team.description || '',
          category: team.category,
          image: teamImageUrl,
          isActive: team.isActive,
          order: team.displayOrder || 0,
          sponsor: { name: '', logo: '', website: '', isActive: false },
          createdAt: '',
          updatedAt: '',
          season: team.season,
          formation: team.formation,
          tier: team.tier,
          colors: team.colors,
          logo: team.logo,
          coach: team.coach,
          totalPlayers: roster.length,
          coaches: team.coach ? 1 : 0,
          playerAvatars,
          competitions: [] as { name: string; logo: string | null }[],
          upcomingGames,
          nextOpponent,
          leagueLogos,
          defaultPlayerImage: defaultPlayerImg,
        };
      })
    );

    return enrichedTeams;
  } catch (error) {
    console.error('Error fetching enriched club teams:', error);
    return [];
  }
}

/**
 * Get a single FutbolCore game by ID, transformed to IFixture-compatible format.
 */
export async function getFutbolCoreFixtureById(gameId: string) {
  try {
    const allFixtures = await getClubFixtures();
    const fixture = allFixtures.find((f) => f._id === gameId);
    if (!fixture) return null;

    // Add missing IFixture fields with defaults
    return {
      ...fixture,
      seasonYear: '',
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
 * Get all club games transformed into a format compatible with the fixtures page.
 */
export async function getClubFixtures() {
  try {
    const [allGames, branding] = await Promise.all([
      getAllClubGames(),
      getFutbolCoreBranding(),
    ]);
    const clubLogo = branding.logoUrl || '';

    const extractField = (...sources: (string | undefined)[]) => {
      for (const s of sources) {
        if (!s) continue;
        const m = s.match(/Field\s+[\w-]+/i);
        if (m) return m[0];
      }
      return '';
    };

    return allGames.map((game) => {
      const eaglesIsHome = game.myTeamRole === 'HOME';
      const homeTeamLogo = eaglesIsHome
        ? clubLogo
        : game.homeTeam.logoUrl || '';
      const awayTeamLogo = eaglesIsHome
        ? game.awayTeam.logoUrl || ''
        : clubLogo;

      return {
        _id: game._id,
        date: game.startDate.split('T')[0],
        time: game.startTime,
        stadium: game.venue?.name || game.location || 'TBD',
        field: extractField(game.venue?.address, game.location),
        competition: game.type || 'League',
        competitionType: game.type || 'league',
        homeTeam: game.homeTeam.name,
        awayTeam: game.awayTeam.name,
        homeTeamLogo,
        awayTeamLogo,
        leagueLogo: game.leagueLogo?.secure_url || '',
        channelLogo: '',
        status: game.status === 'scheduled' ? 'SCHEDULED' : game.status.toUpperCase(),
        homeScore: game.score.home,
        awayScore: game.score.away,
        matchReport: '',
        matchImage: 'https://res.cloudinary.com/dofpgztzm/image/upload/v1769524901/IMG_3214-2_idguhu.jpg',
        title: game.title,
        location: game.location,
        venue: game.venue,
        isHome: game.isHome,
        myTeamRole: game.myTeamRole,
      };
    });
  } catch (error) {
    console.error('Error fetching club fixtures:', error);
    return [];
  }
}
