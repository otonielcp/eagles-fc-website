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

export interface FutbolCorePlayer {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
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

export async function getFutbolCoreTeams(): Promise<FutbolCoreTeam[]> {
  return fetchFutbolCore<FutbolCoreTeam[]>('/teams?limit=500');
}

export async function getFutbolCoreTeamsWithBranding(): Promise<{ teams: FutbolCoreTeam[]; branding: FutbolCoreBranding }> {
  const result = await fetchFutbolCoreWithMeta<FutbolCoreTeam[]>('/teams?limit=500');
  return { teams: result.data, branding: (result.meta?.branding as FutbolCoreBranding) || {} };
}

export async function getFutbolCoreBranding(): Promise<FutbolCoreBranding> {
  const result = await fetchFutbolCoreWithMeta<FutbolCoreTeam[]>('/teams?limit=1');
  return (result.meta?.branding as FutbolCoreBranding) || {};
}

export async function getFutbolCoreRoster(teamId: string): Promise<FutbolCorePlayer[]> {
  return fetchFutbolCore<FutbolCorePlayer[]>(`/teams/${teamId}/roster`);
}

export async function getFutbolCoreRosterWithMeta(teamId: string): Promise<{ players: FutbolCorePlayer[]; meta: FutbolCoreRosterMeta }> {
  const result = await fetchFutbolCoreWithMeta<FutbolCorePlayer[]>(`/teams/${teamId}/roster`);
  return { players: result.data, meta: result.meta as FutbolCoreRosterMeta };
}

export async function getFutbolCoreGames(teamId: string): Promise<FutbolCoreGame[]> {
  return fetchFutbolCore<FutbolCoreGame[]>(`/teams/${teamId}/games`);
}
