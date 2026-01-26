import TeamClasses from "@/components/landing/TeamClasses";
import { getActiveTeams } from '@/actions/team';
import { getPlayersByTeamId } from '@/actions/player';
import { getStaffByTeamId } from '@/actions/staff';
import { getFixturesByTeam } from '@/actions/fixture';
import { IFixture } from '@/types/fixtures';

export default async function Teams() {
  // Fetch active teams from the database
  const teams = await getActiveTeams();

  // Fetch player count and coach count for each team
  const teamsWithData = await Promise.all(
    teams.map(async (team) => {
      const players = await getPlayersByTeamId(team._id);
      const staff = await getStaffByTeamId(team._id);
      const fixtures = await getFixturesByTeam(team.name);

      // Count coaches (roles that include 'Coach')
      const coaches = staff.filter(member =>
        member.role.toLowerCase().includes('coach')
      );

      // Get first 4 players with images for avatars
      const playerAvatars = players
        .filter(player => player.image)
        .slice(0, 4)
        .map(player => ({
          id: player._id,
          image: player.image,
          name: `${player.firstName} ${player.lastName}`
        }));

      // Get unique competitions/leagues the team is in with their logos
      const competitionsMap = new Map();
      fixtures.forEach((f: IFixture) => {
        if (f.competition && !competitionsMap.has(f.competition)) {
          competitionsMap.set(f.competition, f.leagueLogo || null);
        }
      });
      const competitions = Array.from(competitionsMap.entries()).map(([name, logo]) => ({
        name,
        logo
      }));

      // Get upcoming games (status is 'SCHEDULED' and date is in the future)
      const now = new Date();
      const upcomingGames = fixtures.filter((f: IFixture) => {
        const fixtureDate = new Date(f.date);
        return f.status === 'SCHEDULED' && fixtureDate >= now;
      }).length;

      return {
        ...team,
        totalPlayers: players.length,
        coaches: coaches.length,
        playerAvatars,
        competitions,
        upcomingGames,
      };
    })
  );

  return (
    <div className="max-w-full overflow-hidden" style={{ marginTop: '70px' }}>
      <TeamClasses teams={teamsWithData} />
    </div>
  );
}
