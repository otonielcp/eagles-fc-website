import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";
import { getTeamRosterWithBranding } from "@/actions/futbolcore";
import { findVisibleTeam, getVisibleTeams, withRouteIds } from "@/lib/publicTeams";
import PlayerSection from "@/components/landing/PlayerSection";
import { notFound } from "next/navigation";
import { Player } from "@/types/team";
import type { Metadata } from "next";
import { cache } from "react";

type TeamPageProps = { params: Promise<{ teamId: string }> };

// generateMetadata and the page both need the team list; fetch it once per request.
// Only teams switched on in the admin Teams list have a page.
const getTeams = cache(() => getVisibleTeams());

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { teamId } = await params;
  const shown = findVisibleTeam(await getTeams(), teamId);
  if (!shown) return { title: "Team Not Found" };

  const teamName = shown.shortName;
  return {
    title: `${teamName} Roster`,
    description: `Roster and season stats for the Eagles FC ${teamName} youth soccer team in Grand Island, Nebraska.`,
  };
}

export default async function TeamRosterPage({ params }: TeamPageProps) {
  const { teamId } = await params;

  // The admin Teams list decides which teams have a page. Rosters come only
  // from FutbolCore: the old MongoDB roster path was removed because it passed
  // whole player documents (birthdates included) into client components.
  const teams = await getTeams();
  const shown = findVisibleTeam(teams, teamId);

  if (!shown) {
    notFound();
  }

  const allTeams = withRouteIds(teams);
  const team = allTeams.find((t) => t._id === teamId) ?? allTeams[0];

  const rosterData = shown.futbolcoreId
    ? await getTeamRosterWithBranding(shown.futbolcoreId)
    : { players: [], clubLogo: '', defaultPlayerImage: '' };
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

      {players.length === 0 && (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-bebas text-gray-900 uppercase leading-none mb-4">{team.shortName || team.name}</h2>
          {team.description && team.description !== team.name && (
            <p className="text-gray-600 mb-4">{team.description}</p>
          )}
          <p className="text-gray-500">The roster for this team will be posted soon.</p>
        </div>
      )}
    </div>
  );
}
