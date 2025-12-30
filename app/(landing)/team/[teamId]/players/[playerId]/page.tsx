import { getPlayerById, getPlayersByTeamId, getTeamStats } from "@/actions/player";
import { getTeamById } from "@/actions/team";
import { getSimilarTeams } from "@/actions/team";

import PlayerProfile from "@/components/landing/PlayerProfile";
import TeamSponsor from "@/components/landing/TeamSponsor";
import MiniNavbarTeams from "@/components/landing/MiniNavbarTeams";

import { notFound } from "next/navigation";

export default async function PlayerProfilePage({ params }: any) {
    try {
        const { teamId, playerId } = await params;
        const player = await getPlayerById(playerId);
        
        if (!player) {
            notFound();
        }
        
        // Fetch team data
        const team = await getTeamById(teamId);
        
        if (!team) {
            notFound();
        }
        
        // Fetch similar teams for the mini navbar
        const similarTeams = await getSimilarTeams(team.name);
        
        // Fetch all players from the same team for the dropdown
        const teamPlayers = await getPlayersByTeamId(teamId);
        
        // Fetch team average statistics
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
    } catch (error) {
        console.error("Error loading player data:", error);
        notFound();
    }
}
