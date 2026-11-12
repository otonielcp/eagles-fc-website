// League / season / competition filters for the Fixtures and Results pages.
// The options come from the FutbolCore games themselves, and the same matcher
// is used by both pages. Safe to import from client components.

export const ALL_LEAGUES = 'All leagues';
export const ALL_SEASONS = 'All seasons';
export const ALL_COMPETITIONS = 'All competitions';

/** Youth soccer season of a "YYYY-MM-DD" day: August to July, e.g. "2026-2027". */
export function gameSeason(date: string): string {
  const [y, m] = date.split('-').map(Number);
  if (!y || !m) return '';
  return m >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

/** "league" → "League", "friendly_match" → "Friendly Match". */
export function competitionLabel(type: string): string {
  return (type || 'league')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type FilterableGame = { league: string; season: string; competitionType: string };

export type GameFilterOptions = { leagues: string[]; seasons: string[]; competitions: string[] };

export function gameFilterOptions(games: FilterableGame[]): GameFilterOptions {
  const leagues = new Set<string>();
  const seasons = new Set<string>();
  const competitions = new Set<string>();
  for (const game of games) {
    if (game.league) leagues.add(game.league);
    if (game.season) seasons.add(game.season);
    competitions.add(competitionLabel(game.competitionType));
  }
  return {
    leagues: [...leagues].sort((a, b) => a.localeCompare(b)),
    seasons: [...seasons].sort((a, b) => b.localeCompare(a)), // newest first
    competitions: [...competitions].sort((a, b) => a.localeCompare(b)),
  };
}

export function matchesGameFilters(
  game: FilterableGame,
  filters: { league?: string; season?: string; competition?: string }
): boolean {
  const { league, season, competition } = filters;
  if (league && league !== ALL_LEAGUES && game.league !== league) return false;
  if (season && season !== ALL_SEASONS && game.season !== season) return false;
  if (competition && competition !== ALL_COMPETITIONS && competitionLabel(game.competitionType) !== competition) return false;
  return true;
}
