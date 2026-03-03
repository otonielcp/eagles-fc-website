import TeamClasses from "@/components/landing/TeamClasses";
import { getEnrichedClubTeams } from '@/actions/futbolcore';

export default async function Teams() {
  // Fetch active teams from FutbolCore API with rosters and game counts
  const teamsWithData = await getEnrichedClubTeams();

  return (
    <div className="max-w-full overflow-hidden" style={{ marginTop: '70px' }}>
      <TeamClasses teams={teamsWithData} />
    </div>
  );
}
