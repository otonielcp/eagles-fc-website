import { getActiveTeams } from '@/actions/team';
import { getPlayersByTeamId } from '@/actions/player';
import { getStaffByTeamId } from '@/actions/staff';
import { TeamCard } from '@/components/landing/TeamCard';

export const metadata = {
  title: 'Teams Overview | Eagles FC',
  description: 'View all Eagles FC teams, players, and coaching staff',
};

async function getTeamsWithData() {
  const teams = await getActiveTeams();

  // Get player count and coach count for each team
  const teamsWithData = await Promise.all(
    teams.map(async (team) => {
      const players = await getPlayersByTeamId(team._id);
      const staff = await getStaffByTeamId(team._id);

      // Count coaches (roles that include 'Coach')
      const coaches = staff.filter(member =>
        member.role.toLowerCase().includes('coach')
      );

      return {
        ...team,
        totalPlayers: players.length,
        coaches: coaches.length,
      };
    })
  );

  return teamsWithData;
}

export default async function TeamsOverviewPage() {
  const teams = await getTeamsWithData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Our Teams
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Meet the talented players and dedicated coaching staff across all our teams.
        </p>
      </div>

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      </div>
    </main>
  );
}
