// League standings entered in Admin → Standings (lib/standings.ts). The Tables
// page shows the tables of the team picked in the sub-navigation; the homepage
// shows the most recently updated table.
import Link from "next/link";
import { getTeamStandingTables, type TeamStandingTable } from "@/lib/standings";
import SafeImg from "./SafeImg";

const th = "px-3 md:px-4 py-3 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider";
const td = "px-3 md:px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-700";
const isEagles = (name: string) => /eagles/i.test(name);

const formatUpdated = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" })
    : "";

export function StandingTable({ table }: { table: TeamStandingTable }) {
  const title = [table.league, table.group].filter(Boolean).join(" — ");
  const updated = formatUpdated(table.lastUpdated);

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex items-center gap-4 justify-center">
          <div className="hidden sm:block w-12 h-[2px] bg-[#C5A464]"></div>
          <h2 className="text-3xl sm:text-4xl font-bebas text-gray-900 uppercase leading-none">{title || "Standings"}</h2>
          <div className="hidden sm:block w-12 h-[2px] bg-[#C5A464]"></div>
        </div>
        <p className="text-gray-500 text-sm mt-3">
          {[table.season && `Season ${table.season}`, updated && `Updated ${updated}`].filter(Boolean).join(" · ")}
        </p>
      </div>

      {table.rows.length === 0 ? (
        <p className="text-center text-gray-500 py-8">This table has no teams yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white border-b-2 border-gray-700">
                <th className={`${th} text-left`}>Pos</th>
                <th className={`${th} text-left`} colSpan={2}>Club</th>
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
              {table.rows.map((row, i) => {
                const ours = isEagles(row.teamName);
                return (
                  <tr
                    key={`${row.rank}-${row.teamName}-${i}`}
                    className={`border-b border-gray-100 transition-colors ${ours ? "bg-[#C5A464]/10 hover:bg-[#C5A464]/15" : "hover:bg-gray-50"}`}
                  >
                    <td className={`px-3 md:px-4 py-3 whitespace-nowrap text-sm font-bold ${ours ? "text-[#8a6d2f] border-l-4 border-[#C5A464]" : "text-gray-900"}`}>
                      {row.rank}
                    </td>
                    <td className="pl-2 pr-1 py-3 w-12">
                      {/* The initial shows through if the logo is missing or fails to load. */}
                      <div className="relative h-9 w-9 flex items-center justify-center overflow-hidden rounded bg-white border border-gray-200">
                        <span className="text-xs text-gray-400 font-bold">{row.teamName.charAt(0).toUpperCase()}</span>
                        {row.teamLogo && (
                          <SafeImg src={row.teamLogo} alt="" fallbackSrc={null} className="absolute inset-0 h-full w-full object-contain p-1 bg-white" />
                        )}
                      </div>
                    </td>
                    <td className="px-2 md:px-3 py-3">
                      <span className={`text-sm ${ours ? "font-bold text-gray-900" : "font-semibold text-gray-900"}`}>{row.teamName}</span>
                    </td>
                    <td className={td}>{row.gamesPlayed}</td>
                    <td className={`${td} hidden sm:table-cell`}>{row.wins}</td>
                    <td className={`${td} hidden sm:table-cell`}>{row.ties}</td>
                    <td className={`${td} hidden sm:table-cell`}>{row.losses}</td>
                    <td className={`${td} hidden md:table-cell`}>{row.goalsFor}</td>
                    <td className={`${td} hidden md:table-cell`}>{row.goalsAgainst}</td>
                    <td className={`${td} hidden md:table-cell font-bold text-gray-900`}>
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="px-3 md:px-4 py-3 whitespace-nowrap text-center">
                      <span className="text-sm font-black text-gray-900">{row.totalPoints}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Homepage: the most recently updated standings table, with a link to the rest. */
const Standing = async () => {
  const latest = (await getTeamStandingTables()).find((table) => table.rows.length > 0);
  if (!latest) return null;

  return (
    <div className="max-w-7xl mx-auto my-12 md:my-16 px-4 sm:px-6 lg:px-8">
      <StandingTable table={latest} />
      <div className="text-center mt-8">
        <Link
          href={`/tables?team=${encodeURIComponent(latest.teamId)}`}
          className="inline-block border-2 border-[#C5A464] text-gray-900 hover:bg-[#C5A464] font-bold uppercase tracking-wider text-sm px-6 py-3 transition-colors"
        >
          All team standings
        </Link>
      </div>
    </div>
  );
};

export default Standing;
