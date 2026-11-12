// Turns a standings table copied from a league website (PlayMetrics, GotSport,
// a league site...) into rows for the Standing model. Columns are matched by
// their headings, so the heading row must be part of the copied text.
// Used by the admin Standings page; safe to import from client components.

export type PastedStandingRow = {
  rank: number;
  teamName: string;
  gamesPlayed: number;
  wins: number;
  ties: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  totalPoints: number;
};

type Column = 'rank' | 'team' | 'played' | 'wins' | 'ties' | 'losses' | 'gf' | 'ga' | 'gd' | 'pts';

const HEADINGS: Record<string, Column> = {
  '#': 'rank', pos: 'rank', 'pos.': 'rank', position: 'rank', rank: 'rank', rk: 'rank', place: 'rank',
  team: 'team', club: 'team', 'team name': 'team', name: 'team',
  gp: 'played', mp: 'played', p: 'played', pld: 'played', pl: 'played', played: 'played', games: 'played', 'games played': 'played', g: 'played',
  w: 'wins', win: 'wins', wins: 'wins', won: 'wins',
  t: 'ties', d: 'ties', tie: 'ties', ties: 'ties', draw: 'ties', draws: 'ties', drawn: 'ties',
  l: 'losses', loss: 'losses', losses: 'losses', lost: 'losses',
  gf: 'gf', f: 'gf', 'goals for': 'gf', for: 'gf',
  ga: 'ga', a: 'ga', 'goals against': 'ga', against: 'ga',
  gd: 'gd', '+/-': 'gd', diff: 'gd', 'goal diff': 'gd', 'goal difference': 'gd', '+/−': 'gd',
  pts: 'pts', pt: 'pts', points: 'pts', point: 'pts',
};

const splitCells = (line: string) =>
  (line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/)).map((c) => c.trim());

const NUMBER = /^[+−-]?\d+$/;
const toNumber = (cell: string) => Number(cell.replace('−', '-').replace('+', ''));

export function parsePastedStandings(text: string): { rows: PastedStandingRow[]; error?: string } {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/ /g, ' ')).filter((l) => l.trim());

  // The heading row is the first line where at least four cells are known headings.
  let headerIndex = -1;
  let headerColumns: (Column | null)[] = [];
  for (let i = 0; i < lines.length; i++) {
    const columns = splitCells(lines[i]).map((c) => HEADINGS[c.toLowerCase().replace(/\s+/g, ' ')] ?? null);
    if (columns.filter(Boolean).length >= 4) {
      headerIndex = i;
      headerColumns = columns;
      break;
    }
  }
  if (headerIndex < 0) {
    return {
      rows: [],
      error: 'Could not find the column headings. Copy the heading row too (for example: Team, GP, W, L, T, GF, GA, PTS).',
    };
  }

  // Numeric columns in the order they appear after the team column.
  const teamAt = headerColumns.indexOf('team');
  const statColumns = headerColumns
    .filter((c, i): c is Column => !!c && c !== 'team' && c !== 'rank' && (teamAt < 0 || i > teamAt));

  const rows: PastedStandingRow[] = [];
  for (const line of lines.slice(headerIndex + 1)) {
    const cells = splitCells(line).filter((c) => c !== '');
    const teamCell = cells.findIndex((c) => /[a-z]/i.test(c) && !NUMBER.test(c));
    if (teamCell < 0) continue;

    const before = cells.slice(0, teamCell).filter((c) => NUMBER.test(c.replace(/\.$/, '')));
    const numbers = cells.slice(teamCell + 1).filter((c) => NUMBER.test(c)).map(toNumber);
    if (numbers.length < statColumns.length) continue; // not a standings row

    const value: Partial<Record<Column, number>> = {};
    statColumns.forEach((column, i) => (value[column] = numbers[i]));

    const wins = value.wins ?? 0;
    const ties = value.ties ?? 0;
    const losses = value.losses ?? 0;
    const goalsFor = value.gf ?? 0;
    const goalsAgainst = value.ga ?? 0;
    rows.push({
      rank: before.length ? toNumber(before[before.length - 1].replace(/\.$/, '')) : rows.length + 1,
      teamName: cells[teamCell].replace(/\s+/g, ' '),
      gamesPlayed: value.played ?? wins + ties + losses,
      wins,
      ties,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: value.gd ?? goalsFor - goalsAgainst,
      totalPoints: value.pts ?? wins * 3 + ties,
    });
  }

  if (rows.length === 0) {
    return { rows, error: 'Found the headings but no team rows under them. Copy the whole table, from the heading row to the last team.' };
  }
  return { rows };
}
