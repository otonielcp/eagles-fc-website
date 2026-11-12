// League standings entered in Admin → Standings, each linked to an Eagles FC
// team (metadata.teamId = FutbolCore team id). FutbolCore has no standings, so
// these tables are the source for the public Tables page.
//
// No 'use server' here: server-side helpers, not public actions.
import connectDB from '@/lib/dbConnect';
import Standing from '@/models/Standings';

export type StandingRow = {
  rank: number;
  teamName: string;
  teamLogo: string;
  gamesPlayed: number;
  wins: number;
  ties: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  totalPoints: number;
};

export type TeamStandingTable = {
  _id: string;
  teamId: string;
  league: string;
  group: string;
  season: string;
  lastUpdated: string;
  rows: StandingRow[];
};

type StandingDoc = {
  _id: unknown;
  metadata?: { league?: string; group?: string; season?: string; lastUpdated?: Date; teamId?: string };
  standings?: Partial<StandingRow>[];
  updatedAt?: Date;
};

const n = (v: unknown) => Number(v) || 0;

/** Every standings table linked to a team, most recently updated first. */
export async function getTeamStandingTables(): Promise<TeamStandingTable[]> {
  try {
    await connectDB();
    const docs = await Standing.find({ 'metadata.teamId': { $nin: [null, ''] } }).lean<StandingDoc[]>();
    return docs
      .map((doc) => {
        const updated = doc.metadata?.lastUpdated || doc.updatedAt;
        return {
          _id: String(doc._id),
          teamId: doc.metadata?.teamId || '',
          league: doc.metadata?.league || '',
          group: doc.metadata?.group || '',
          season: doc.metadata?.season || '',
          lastUpdated: updated ? new Date(updated).toISOString() : '',
          rows: (doc.standings ?? [])
            .map((row, i) => ({
              rank: n(row.rank) || i + 1,
              teamName: String(row.teamName ?? '').trim(),
              teamLogo: String(row.teamLogo ?? ''),
              gamesPlayed: n(row.gamesPlayed),
              wins: n(row.wins),
              ties: n(row.ties),
              losses: n(row.losses),
              goalsFor: n(row.goalsFor),
              goalsAgainst: n(row.goalsAgainst),
              goalDifference: n(row.goalDifference),
              totalPoints: n(row.totalPoints),
            }))
            .filter((row) => row.teamName)
            .sort((a, b) => a.rank - b.rank),
        };
      })
      .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  } catch (error) {
    console.error('[standings] could not load standings:', error);
    return [];
  }
}
