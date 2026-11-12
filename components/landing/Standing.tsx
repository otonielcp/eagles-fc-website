// Season records for every Eagles FC team, from FutbolCore (lib/clubGames.ts).
// FutbolCore has no league standings, so the table lists the club's own teams:
// played, won, drawn, lost, goals and points (3 for a win, 1 for a draw).
import { getClubTeamRecords, type TeamRecord } from "@/lib/clubGames";
import SafeImg from "./SafeImg";

async function loadRecords(): Promise<TeamRecord[] | null> {
  try {
    return await getClubTeamRecords();
  } catch (error) {
    console.error("[tables] could not load team records:", error);
    return null;
  }
}

const th = "px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider";
const td = "px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700";

// On the homepage only teams that have played are listed, to keep it short.
const Standing = async ({ isHomePage = false }: { isHomePage?: boolean }) => {
  const records = await loadRecords();
  const rows = isHomePage ? (records ?? []).filter((team) => team.played > 0) : records ?? [];

  if (rows.length === 0) {
    if (isHomePage) return null;
    return (
      <div className="text-center text-gray-500 py-16 px-4">
        {records === null
          ? "Team records are not available right now. Please check back later."
          : "No team records yet. Check back once the season is under way."}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-12 md:my-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="flex items-center gap-4 justify-center">
          <div className="w-12 h-[2px] bg-[#C5A464]"></div>
          <h2 className="text-4xl sm:text-5xl font-bebas text-gray-900 uppercase leading-none">Team Records</h2>
          <div className="w-12 h-[2px] bg-[#C5A464]"></div>
        </div>
        <p className="text-gray-500 text-sm mt-3">Season results for every Eagles FC team</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white border-b-2 border-gray-700">
              <th className={`${th} text-left`} colSpan={2}>Team</th>
              <th className={th} title="Played">P</th>
              <th className={`${th} hidden sm:table-cell`} title="Won">W</th>
              <th className={`${th} hidden sm:table-cell`} title="Drawn">D</th>
              <th className={`${th} hidden sm:table-cell`} title="Lost">L</th>
              <th className={`${th} hidden md:table-cell`} title="Goals for">GF</th>
              <th className={`${th} hidden md:table-cell`} title="Goals against">GA</th>
              <th className={`${th} hidden md:table-cell`} title="Goal difference">GD</th>
              <th className={`${th} text-[#C5A464]`} title="Points">PTS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((team) => (
              <tr key={team.teamId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="pl-3 md:pl-4 pr-2 py-3 w-14">
                  <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded bg-white border border-gray-200">
                    <SafeImg src={team.logo} alt="" className="h-full w-full object-contain p-1" />
                  </div>
                </td>
                <td className="px-2 md:px-3 py-3">
                  <div className="text-sm font-semibold text-gray-900">{team.name}</div>
                  {team.category && <div className="text-xs text-gray-500">{team.category}</div>}
                </td>
                <td className={td}>{team.played}</td>
                <td className={`${td} hidden sm:table-cell`}>{team.won}</td>
                <td className={`${td} hidden sm:table-cell`}>{team.drawn}</td>
                <td className={`${td} hidden sm:table-cell`}>{team.lost}</td>
                <td className={`${td} hidden md:table-cell`}>{team.goalsFor}</td>
                <td className={`${td} hidden md:table-cell`}>{team.goalsAgainst}</td>
                <td className={`${td} hidden md:table-cell font-bold text-gray-900`}>
                  {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center">
                  <span className="text-sm font-black text-gray-900">{team.points}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Standing;
