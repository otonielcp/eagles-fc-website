import { getPlayerById, getPlayersByTeamId, getTeamStats } from "@/actions/player";
import { getTeamById, getSimilarTeams } from "@/actions/team";
import { getClubTeams, getTeamRosterWithBranding } from "@/actions/futbolcore";

import PlayerProfile from "@/components/landing/PlayerProfile";
import TeamSponsor from "@/components/landing/TeamSponsor";
import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";

import { notFound } from "next/navigation";
import { Player, Team } from "@/types/team";

export default async function PlayerProfilePage({ params }: any) {
  const { teamId, playerId } = await params;

  // Try MongoDB first
  let player: Player | null = null;
  let team: Team | null = null;
  try {
    player = await getPlayerById(playerId);
    team = await getTeamById(teamId);
  } catch {
    // IDs aren't valid MongoDB ObjectIds — fall through to FutbolCore
  }

  if (player && team) {
    const similarTeams = await getSimilarTeams(team.name);
    const teamPlayers = await getPlayersByTeamId(teamId);
    const teamStats = await getTeamStats(teamId);

    return (
      <div className="max-w-full overflow-hidden">
        <MiniNavbarTeams currentTeam={team} similarTeams={similarTeams} />
        <PlayerProfile
          player={player}
          team={team}
          teamPlayers={teamPlayers}
          teamAvg={teamStats.averages}
        />
        <TeamSponsor team={team} />
      </div>
    );
  }

  // FutbolCore fallback
  const fcTeams = await getClubTeams();
  const fcTeam = fcTeams.find((t) => t._id === teamId);
  if (!fcTeam) notFound();

  const rosterData = await getTeamRosterWithBranding(teamId);
  const fcPlayer = rosterData.players.find((p) => p._id === playerId);
  if (!fcPlayer) notFound();

  const getDisplayName = (t: typeof fcTeam) => {
    if (t.shortName && t.shortName !== t.name) return t.shortName;
    return t.category || t.name;
  };

  const fcTeamTransformed: Team = {
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

  const similarTeams: Team[] = fcTeams.map((t) => ({
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

  const toPlayer = (p: (typeof rosterData.players)[number]): Player => ({
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
    image: p.profileImage || rosterData.clubLogo || '',
    teamId,
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
  });

  const fcPlayerTransformed = toPlayer(fcPlayer);
  const fcTeamPlayers = rosterData.players.map(toPlayer);

  return (
    <div className="max-w-full overflow-hidden">
      <MiniNavbarTeams currentTeam={fcTeamTransformed} similarTeams={similarTeams} />
      <PlayerProfile
        player={fcPlayerTransformed}
        team={fcTeamTransformed}
        teamPlayers={fcTeamPlayers}
        teamAvg={{}}
      />
    </div>
  );
}
