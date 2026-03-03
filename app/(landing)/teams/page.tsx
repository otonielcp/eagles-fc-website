import type { Metadata } from "next";
import TeamClasses from "@/components/landing/TeamClasses";
import { getEnrichedClubTeams } from '@/actions/futbolcore';

export const metadata: Metadata = {
  title: "Teams",
  description:
    "Browse all Eagles FC youth soccer teams in Grand Island, Nebraska. Boys and girls teams for all ages and skill levels — from recreational to competitive select programs.",
  openGraph: {
    title: "Teams | Eagles FC - Grand Island, NE",
    description:
      "Browse all Eagles FC youth soccer teams in Grand Island, Nebraska. Boys and girls teams for all ages and skill levels.",
  },
};

export default async function Teams() {
  // Fetch active teams from FutbolCore API with rosters and game counts
  const teamsWithData = await getEnrichedClubTeams();

  return (
    <div className="max-w-full overflow-hidden" style={{ marginTop: '70px' }}>
      <TeamClasses teams={teamsWithData} />
    </div>
  );
}
