import TeamSponsor from "@/components/landing/TeamSponsor";
import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";
import { getTeamById, getAllTeams } from "@/actions/team";
import { getPlayersByTeamId } from "@/actions/player";
import { getClubTeams, getTeamRosterWithBranding } from "@/actions/futbolcore";
import PlayerSection from "@/components/landing/PlayerSection";
import { notFound } from "next/navigation";
import { Team, Player } from "@/types/team";

export default async function TeamRosterPage({ params }: any) {
  const { teamId } = await params;

  // Try MongoDB first, then FutbolCore
  let team: Team | null = null;
  try {
    team = await getTeamById(teamId);
  } catch {
    // ID is not a valid MongoDB ObjectId - will try FutbolCore below
  }
  let players: Player[] = [];
  let allTeams: Team[] = [];
  let isFutbolCore = false;
  let clubLogoFallback = '';

  if (team) {
    // Found in MongoDB - use existing flow
    players = await getPlayersByTeamId(teamId);
    allTeams = await getAllTeams();
  } else {
    // Try FutbolCore API
    const fcTeams = await getClubTeams();
    const fcTeam = fcTeams.find((t) => t._id === teamId);

    if (!fcTeam) {
      notFound();
    }

    isFutbolCore = true;

    // Transform FutbolCore team to Team interface
    // Use category as shortName when shortName is the same as name (not distinguishable)
    const getDisplayName = (t: typeof fcTeam) => {
      if (t.shortName && t.shortName !== t.name) return t.shortName;
      return t.category || t.name;
    };

    team = {
      _id: fcTeam._id,
      name: fcTeam.name,
      shortName: getDisplayName(fcTeam),
      description: fcTeam.description || '',
      category: fcTeam.category,
      image: fcTeam.teamImage?.secure_url || fcTeam.logo?.secure_url || '',
      isActive: fcTeam.isActive,
      order: fcTeam.displayOrder || 0,
      sponsor: { name: '', logo: '', website: '', isActive: false },
      createdAt: '',
      updatedAt: '',
    };

    // Transform all FC teams for the mini navbar
    allTeams = fcTeams.map((t) => ({
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
    }));

    // Fetch roster from FutbolCore with branding
    const rosterData = await getTeamRosterWithBranding(teamId);
    const fcRoster = rosterData.players;
    clubLogoFallback = rosterData.clubLogo || '';
    players = fcRoster.map((p) => ({
      _id: p._id,
      firstName: p.firstName,
      lastName: p.lastName,
      displayName: `${p.firstName} ${p.lastName}`,
      jerseyNumber: p.jerseyNumber,
      position: p.position,
      dateOfBirth: '',
      nationality: '',
      height: 0,
      weight: 0,
      biography: '',
      image: p.profileImage || '',
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
  }

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

      {!isFutbolCore && <TeamSponsor team={team} />}

      {goalkeepers.length > 0 && (
        <PlayerSection title="Goalkeepers" players={goalkeepers} fallbackImage={clubLogoFallback} />
      )}

      {defenders.length > 0 && (
        <PlayerSection title="Defenders" players={defenders} fallbackImage={clubLogoFallback} />
      )}

      {midfielders.length > 0 && (
        <PlayerSection title="Midfielders" players={midfielders} fallbackImage={clubLogoFallback} />
      )}

      {forwards.length > 0 && (
        <PlayerSection title="Forwards" players={forwards} fallbackImage={clubLogoFallback} />
      )}

      {!isFutbolCore && <TeamSponsor team={team} />}
    </div>
  );
}
