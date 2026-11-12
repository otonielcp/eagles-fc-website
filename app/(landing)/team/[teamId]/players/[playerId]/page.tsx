import { getTeamRosterWithBranding } from "@/actions/futbolcore";
import { findVisibleTeam, getVisibleTeams, withRouteIds } from "@/lib/publicTeams";

import PlayerProfile from "@/components/landing/PlayerProfile";
import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";

import { notFound } from "next/navigation";
import { Player } from "@/types/team";
import type { Metadata } from "next";
import { cache } from "react";

type PlayerPageProps = { params: Promise<{ teamId: string; playerId: string }> };

// generateMetadata and the page share these fetches; run each once per request.
// Only teams switched on in the admin Teams list (and linked to FutbolCore) have player pages.
const getTeams = cache(() => getVisibleTeams());
const getRoster = cache((teamId: string) => getTeamRosterWithBranding(teamId));

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { teamId, playerId } = await params;
  const shown = findVisibleTeam(await getTeams(), teamId);
  const fcPlayer = shown?.futbolcoreId ? (await getRoster(shown.futbolcoreId)).players.find((p) => p._id === playerId) : undefined;
  if (!shown || !fcPlayer) return { title: "Player Not Found" };

  // Players are minors: metadata carries only the team and jersey number —
  // no name, birthdate or photo.
  const teamName = shown.shortName;
  const number = fcPlayer.jerseyNumber ? ` #${fcPlayer.jerseyNumber}` : "";
  return {
    title: `${teamName}${number} Player Profile`,
    description: `Season stats for an Eagles FC ${teamName} player.`,
  };
}

export default async function PlayerProfilePage({ params }: PlayerPageProps) {
  const { teamId, playerId } = await params;

  // The admin Teams list decides which teams are shown; rosters come only from
  // FutbolCore. The old MongoDB roster path was removed:
  // it passed whole player documents into PlayerProfile, a client component, so
  // every field — dateOfBirth, height, weight — was serialized into the page
  // payload and readable in source whether or not it was ever rendered.
  const teams = await getTeams();
  const shown = findVisibleTeam(teams, teamId);
  if (!shown?.futbolcoreId) notFound();

  const rosterData = await getRoster(shown.futbolcoreId);
  const fcPlayer = rosterData.players.find((p) => p._id === playerId);
  if (!fcPlayer) notFound();

  const similarTeams = withRouteIds(teams);
  const fcTeamTransformed = similarTeams.find((t) => t._id === teamId) ?? similarTeams[0];

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
