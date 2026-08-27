import { getClubTeams, getTeamRosterWithBranding } from "@/actions/futbolcore";

import PlayerProfile from "@/components/landing/PlayerProfile";
import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";

import { notFound } from "next/navigation";
import { getTeamDisplayName } from "@/lib/teamName";
import { Player, Team } from "@/types/team";

export default async function PlayerProfilePage({ params }: any) {
  const { teamId, playerId } = await params;

  // FutbolCore is the single source of truth. The old MongoDB path was removed:
  // it passed whole player documents into PlayerProfile, a client component, so
  // every field — dateOfBirth, height, weight — was serialized into the page
  // payload and readable in source whether or not it was ever rendered.
  const fcTeams = await getClubTeams();
  const fcTeam = fcTeams.find((t) => t._id === teamId);
  if (!fcTeam) notFound();

  const rosterData = await getTeamRosterWithBranding(teamId);
  const fcPlayer = rosterData.players.find((p) => p._id === playerId);
  if (!fcPlayer) notFound();

  const toTeam = (t: typeof fcTeam): Team => ({
    _id: t._id,
    name: t.name,
    shortName: getTeamDisplayName(t),
    description: t.description || '',
    category: t.category,
    image: t.teamImage?.secure_url || t.logo?.secure_url || '',
    isActive: t.isActive,
    order: t.displayOrder || 0,
    sponsor: { name: '', logo: '', website: '', isActive: false },
    createdAt: '',
    updatedAt: '',
  });

  const fcTeamTransformed = toTeam(fcTeam);
  const similarTeams: Team[] = fcTeams.map(toTeam);

  const toPlayer = (p: (typeof rosterData.players)[number]): Player => ({
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
    image: rosterData.defaultPlayerImage || rosterData.clubLogo || '',
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
