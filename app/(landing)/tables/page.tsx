import type { Metadata } from "next";
import NavbarFix from "@/components/landing/NavbarFix";
import { StandingTable } from "@/components/landing/Standing";
import { getClubTeamRecords } from "@/lib/clubGames";
import { getTeamStandingTables } from "@/lib/standings";

export const metadata: Metadata = {
  title: "Standings",
  description:
    "League standings for every Eagles FC youth soccer team in Grand Island, Nebraska.",
};

type TablesPageProps = { searchParams: Promise<{ team?: string }> };

// Pick a team in the bar above the table (?team=<FutbolCore team id>) to see
// its league standings, entered in Admin → Standings.
export default async function TablesPage({ searchParams }: TablesPageProps) {
  const [{ team: requested }, tables, clubTeams] = await Promise.all([
    searchParams,
    getTeamStandingTables(),
    getClubTeamRecords().catch(() => []),
  ]);

  const withStandings = new Set(tables.filter((t) => t.rows.length > 0).map((t) => t.teamId));
  const teams = clubTeams.map((t) => ({ id: t.teamId, name: t.name, hasStandings: withStandings.has(t.teamId) }));
  const selected =
    teams.find((t) => t.id === requested) ?? teams.find((t) => t.hasStandings) ?? teams[0];
  const selectedTables = selected ? tables.filter((t) => t.teamId === selected.id) : [];

  return (
    <div>
      <NavbarFix teamPicker={{ teams, selectedId: selected?.id }} />
      <div className="max-w-7xl mx-auto my-12 md:my-16 px-4 sm:px-6 lg:px-8 space-y-20">
        {selectedTables.length > 0 ? (
          selectedTables.map((table) => <StandingTable key={table._id} table={table} />)
        ) : (
          <div className="text-center py-16">
            <h2 className="text-3xl sm:text-4xl font-bebas text-gray-900 uppercase leading-none mb-3">
              {selected?.name || "Standings"}
            </h2>
            <p className="text-gray-500">
              {selected ? "Standings for this team haven't been posted yet." : "Standings are not available right now."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
