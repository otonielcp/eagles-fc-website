const FUTBOLCORE_API_URL = process.env.FUTBOLCORE_API_URL;
const FUTBOLCORE_API_KEY = process.env.FUTBOLCORE_API_KEY;

// FutbolCore API response types
export interface FutbolCoreTeam {
  _id: string;
  name: string;
  shortName?: string;
  description?: string;
  category: string;
  season: string;
  isActive: boolean;
  displayOrder?: number;
  formation?: string;
  tier?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  statistics?: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  logo?: {
    secure_url: string;
    url: string;
    public_id?: string;
    original_filename?: string;
    format?: string;
  };
  teamImage?: {
    secure_url: string;
    url: string;
  } | null;
  coach?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

// NOTE: every club team is a youth team (U7–U15), so every player here is a minor.
// `profileImage` is deliberately absent — the API returns it, but we never carry a
// child's photo past this boundary. See sanitizePlayer below.
export interface FutbolCorePlayer {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: number;
  statistics: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    matchesPlayed: number;
    minutesPlayed: number;
    starts?: number;
    shots?: number;
    fouls?: number;
    substitutions?: number;
    penalties?: number;
    doubleYellows?: number;
    cleanSheets?: number;
  };
}

export interface FutbolCoreGame {
  _id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime?: string;
  location: string;
  venue: {
    name: string;
    address?: string;
  };
  isHome: boolean;
  status: string;
  homeTeam: {
    id: string | null;
    name: string;
    logoUrl: string;
  };
  awayTeam: {
    id: string | null;
    name: string;
    logoUrl: string;
  };
  myTeamRole: 'HOME' | 'AWAY';
  score: {
    home: number;
    away: number;
  };
  leagueLogo?: {
    public_id: string;
    secure_url: string;
    url: string;
  };
  source: string;
}

export interface FutbolCoreBranding {
  defaultPlayerImageUrl?: string;
  defaultTeamCardImageUrl?: string;
  loginBackgroundUrl?: string;
  logoUrl?: string;
}

export interface FutbolCoreRosterMeta {
  total: number;
  team?: {
    _id: string;
    name: string;
    shortName?: string;
    logoUrl?: string;
    teamImageUrl?: string;
  };
  branding?: FutbolCoreBranding;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

async function fetchFutbolCore<T>(endpoint: string): Promise<T> {
  if (!FUTBOLCORE_API_URL || !FUTBOLCORE_API_KEY) {
    throw new Error('FutbolCore API credentials not configured');
  }

  const res = await fetch(`${FUTBOLCORE_API_URL}${endpoint}`, {
    headers: {
      'X-API-Key': FUTBOLCORE_API_KEY,
    },
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!res.ok) {
    throw new Error(`FutbolCore API error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error('FutbolCore API returned unsuccessful response');
  }

  return json.data;
}

async function fetchFutbolCoreWithMeta<T>(endpoint: string): Promise<{ data: T; meta: any }> {
  if (!FUTBOLCORE_API_URL || !FUTBOLCORE_API_KEY) {
    throw new Error('FutbolCore API credentials not configured');
  }

  const res = await fetch(`${FUTBOLCORE_API_URL}${endpoint}`, {
    headers: {
      'X-API-Key': FUTBOLCORE_API_KEY,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`FutbolCore API error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error('FutbolCore API returned unsuccessful response');
  }

  return { data: json.data, meta: json.meta || {} };
}

// The API silently caps `limit` at 100 no matter what we ask for, and the club's
// own teams sort after the opponents — so a single page comes back all-Opponent
// and every Eagles team is filtered away. Always walk the pages.
const TEAMS_PAGE_SIZE = 100;

async function fetchAllTeams(): Promise<{ teams: FutbolCoreTeam[]; branding: FutbolCoreBranding }> {
  const first = await fetchFutbolCoreWithMeta<FutbolCoreTeam[]>(
    `/teams?limit=${TEAMS_PAGE_SIZE}&page=1`
  );

  const teams = [...first.data];
  const pageSize = Number(first.meta?.limit) || TEAMS_PAGE_SIZE;
  const total = Number(first.meta?.total) || teams.length;
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchFutbolCoreWithMeta<FutbolCoreTeam[]>(`/teams?limit=${pageSize}&page=${i + 2}`)
      )
    );
    for (const page of rest) teams.push(...page.data);
  }

  return { teams, branding: (first.meta?.branding as FutbolCoreBranding) || {} };
}

export async function getFutbolCoreTeams(): Promise<FutbolCoreTeam[]> {
  return (await fetchAllTeams()).teams;
}

export async function getFutbolCoreTeamsWithBranding(): Promise<{ teams: FutbolCoreTeam[]; branding: FutbolCoreBranding }> {
  return fetchAllTeams();
}

export async function getFutbolCoreBranding(): Promise<FutbolCoreBranding> {
  const result = await fetchFutbolCoreWithMeta<FutbolCoreTeam[]>('/teams?limit=1');
  return (result.meta?.branding as FutbolCoreBranding) || {};
}

// Whitelist the fields we actually render. A TypeScript interface strips nothing at
// runtime, so without this every field the API returns — today's profileImage, and
// any birthdate or guardian contact added later — would flow straight into a public
// page's payload. Adding a field to a public page must be a deliberate edit here.
function sanitizePlayer(raw: any): FutbolCorePlayer {
  const s = raw?.statistics ?? {};
  const num = (v: unknown) => Number(v) || 0;

  return {
    _id: String(raw?._id ?? ''),
    firstName: String(raw?.firstName ?? ''),
    lastName: String(raw?.lastName ?? ''),
    position: String(raw?.position ?? ''),
    jerseyNumber: num(raw?.jerseyNumber),
    statistics: {
      goals: num(s.goals),
      assists: num(s.assists),
      yellowCards: num(s.yellowCards),
      redCards: num(s.redCards),
      matchesPlayed: num(s.matchesPlayed),
      minutesPlayed: num(s.minutesPlayed),
      starts: num(s.starts),
      shots: num(s.shots),
      fouls: num(s.fouls),
      substitutions: num(s.substitutions),
      penalties: num(s.penalties),
      doubleYellows: num(s.doubleYellows),
      cleanSheets: num(s.cleanSheets),
    },
  };
}

export async function getFutbolCoreRoster(teamId: string): Promise<FutbolCorePlayer[]> {
  const raw = await fetchFutbolCore<any[]>(`/teams/${teamId}/roster`);
  return (raw ?? []).map(sanitizePlayer);
}

export async function getFutbolCoreRosterWithMeta(teamId: string): Promise<{ players: FutbolCorePlayer[]; meta: FutbolCoreRosterMeta }> {
  const result = await fetchFutbolCoreWithMeta<any[]>(`/teams/${teamId}/roster`);
  return {
    players: (result.data ?? []).map(sanitizePlayer),
    meta: result.meta as FutbolCoreRosterMeta,
  };
}

export async function getFutbolCoreGames(teamId: string): Promise<FutbolCoreGame[]> {
  return fetchFutbolCore<FutbolCoreGame[]>(`/teams/${teamId}/games`);
}
