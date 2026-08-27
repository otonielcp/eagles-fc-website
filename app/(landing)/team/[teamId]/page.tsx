import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";
import { getClubTeams, getTeamRosterWithBranding } from "@/actions/futbolcore";
import PlayerSection from "@/components/landing/PlayerSection";
import { notFound } from "next/navigation";
import { Team, Player } from "@/types/team";

export default async function TeamRosterPage({ params }: any) {
  const { teamId } = await params;

  // FutbolCore is the single source of truth for teams and rosters. The old
  // MongoDB path was removed: it served stale local records and passed whole
  // player documents — birthdates included — into client components.
  const fcTeams = await getClubTeams();
  const fcTeam = fcTeams.find((t) => t._id === teamId);

  if (!fcTeam) {
    notFound();
  }

  // shortName is sometimes the generic "Eagles Football Club" — when that
  // happens, derive a distinctive label from the full team name instead.
  const GENERIC_SHORT = /^eagles\s*football\s*club$/i;
  const stripEaglesPrefix = (s: string) =>
    s.replace(/^(eagles\s*football\s*club|eagles?\s*fc)\s*-?\s*/i, '').trim();
  const getDisplayName = (t: typeof fcTeam) => {
    if (t.shortName && !GENERIC_SHORT.test(t.shortName) && t.shortName !== t.name) {
      return t.shortName;
    }
    const cleaned = stripEaglesPrefix(t.name);
    return cleaned || t.category || t.name;
  };

  const toTeam = (t: typeof fcTeam): Team => ({
    _id: t._id,
    name: t.name,
    shortName: getDisplayName(t),
    description: t.description || '',
    category: t.category,
    image: t.teamImage?.secure_url || t.logo?.secure_url || '',
    isActive: t.isActive,
    order: t.displayOrder || 0,
    sponsor: { name: '', logo: '', website: '', isActive: false },
    createdAt: '',
    updatedAt: '',
  });

  const team = toTeam(fcTeam);
  const allTeams = fcTeams.map(toTeam);

  const rosterData = await getTeamRosterWithBranding(teamId);
  const clubLogoFallback = rosterData.clubLogo || '';
  const cardBackground = rosterData.defaultPlayerImage || '';

  const players: Player[] = rosterData.players.map((p) => ({
    _id: p._id,
    firstName: p.firstName,
    lastName: p.lastName,
    displayName: `${p.firstName} ${p.lastName}`,
    jerseyNumber: p.jerseyNumber,
    position: p.position,
    // Players are minors: no birthdate, no measurements, no photo.
    dateOfBirth: '',
    nationality: '',
    height: 0,
    weight: 0,
    biography: '',
    image: rosterData.defaultPlayerImage || '',
    teamId: teamId,
    isActive: true,
    isCaptain: false,
    stats: {
      appearances: p.statistics?.matchesPlayed || 0,
      goals: p.statistics?.goals || 0,
      assists: p.statistics?.assists || 0,
      yellowCards: p.statistics?.yellowCards || 0,
      redCards: p.statistics?.redCards || 0,
      minutes: p.statistics?.minutesPlayed || 0,
      starts: p.statistics?.starts || 0,
      substitutions: p.statistics?.substitutions || 0,
      fouls: p.statistics?.fouls || 0,
      penalties: p.statistics?.penalties || 0,
      doubleYellowCards: p.statistics?.doubleYellows || 0,
      shots: p.statistics?.shots || 0,
      matchesPlayed: p.statistics?.matchesPlayed || 0,
    },
    socialMedia: { instagram: '', twitter: '', facebook: '' },
    createdAt: '',
    updatedAt: '',
  }));

  // Group players by position — match on keywords so variants like
  // "Right Back", "Left Wing Back", "Attacking Midfielder", "Right Winger",
  // "Center Forward", "Striker" all land in the correct section.
  const categorize = (pos: string): 'GK' | 'DEF' | 'MID' | 'FWD' | 'OTHER' => {
    const p = (pos || '').toLowerCase();
    if (p.includes('goalkeeper') || p === 'gk') return 'GK';
    if (p.includes('back') || p.includes('defender') || p.includes('sweeper') || p === 'cb') return 'DEF';
    if (p.includes('midfield')) return 'MID';
    if (p.includes('forward') || p.includes('winger') || p.includes('striker') || p.includes('attacker')) return 'FWD';
    return 'OTHER';
  };

  const goalkeepers = players.filter(p => categorize(p.position) === 'GK');
  const defenders = players.filter(p => categorize(p.position) === 'DEF');
  const midfielders = players.filter(p => categorize(p.position) === 'MID');
  const forwards = players.filter(p => categorize(p.position) === 'FWD');

  return (
    <div className="max-w-full overflow-hidden" style={{ marginBottom: '70px' }}>
      <MiniNavbarTeams currentTeam={team} similarTeams={allTeams} />

      {goalkeepers.length > 0 && (
        <PlayerSection title="Goalkeepers" players={goalkeepers} fallbackImage={clubLogoFallback} cardBackground={cardBackground} />
      )}

      {defenders.length > 0 && (
        <PlayerSection title="Defenders" players={defenders} fallbackImage={clubLogoFallback} cardBackground={cardBackground} />
      )}

      {midfielders.length > 0 && (
        <PlayerSection title="Midfielders" players={midfielders} fallbackImage={clubLogoFallback} cardBackground={cardBackground} />
      )}

      {forwards.length > 0 && (
        <PlayerSection title="Forwards" players={forwards} fallbackImage={clubLogoFallback} cardBackground={cardBackground} />
      )}
    </div>
  );
}
