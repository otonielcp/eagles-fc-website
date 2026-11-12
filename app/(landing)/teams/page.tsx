import type { Metadata } from "next";
import TeamClasses from "@/components/landing/TeamClasses";
import { getTeamCards } from '@/lib/publicTeams';

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

// Admin changes revalidate this page right away; this also refreshes FutbolCore stats.
export const revalidate = 60;

export default async function Teams() {
  // Teams switched on in the admin Teams list, with FutbolCore rosters and games
  const teamsWithData = await getTeamCards();

  return (
    <div className="max-w-full overflow-hidden" style={{ marginTop: '70px' }}>
      <TeamClasses teams={teamsWithData} />
    </div>
  );
}
