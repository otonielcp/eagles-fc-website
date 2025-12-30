import TeamSponsor from "@/components/landing/TeamSponsor";
import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";
import { getTeamById, getSimilarTeams, getAllTeams } from "@/actions/team";
import { getPlayersByTeamId } from "@/actions/player";
import PlayerSection from "@/components/landing/PlayerSection";
import { notFound } from "next/navigation";

export default async function TeamRosterPage({ params }: any) {
  // Fetch team data
  const { teamId } = await params;
  const team = await getTeamById(teamId);
  
  if (!team) {
    notFound();
  }
  
  // Fetch similar teams (for the mini navbar)
  // const similarTeams = await getSimilarTeams(team.name);
  const similarTeams = await getAllTeams();
  
  // Fetch players for this team
  const players = await getPlayersByTeamId(teamId);
  
  // Group players by position
  const goalkeepers = players.filter(player => 
    player.position === "Goalkeeper"
  );
  
  const defenders = players.filter(player => 
    ["Defender", "Center Back", "Full Back", "Wing Back"].includes(player.position)
  );
  
  const midfielders = players.filter(player => 
    ["Midfielder", "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder"].includes(player.position)
  );
  
  const forwards = players.filter(player => 
    ["Forward", "Winger", "Striker"].includes(player.position)
  );

  return (
    <div className="max-w-full overflow-hidden" style={{ marginBottom: '70px' }}>
      <MiniNavbarTeams currentTeam={team} similarTeams={similarTeams} />
      
      <TeamSponsor team={team} />
      
      {goalkeepers.length > 0 && (
        <PlayerSection title="Goalkeepers" players={goalkeepers} />
      )}
      
      {defenders.length > 0 && (
        <PlayerSection title="Defenders" players={defenders} />
      )}
      
      {midfielders.length > 0 && (
        <PlayerSection title="Midfielders" players={midfielders} />
      )}
      
      {forwards.length > 0 && (
        <PlayerSection title="Forwards" players={forwards} />
      )}
      
      <TeamSponsor team={team} />
    </div>
  );
} 