import type { Metadata } from "next";
import Standing from "@/components/landing/Standing";
import NavbarFix from "@/components/landing/NavbarFix";

export const metadata: Metadata = {
  title: "Standings",
  description:
    "Season records for every Eagles FC youth soccer team in Grand Island, Nebraska.",
};

// Team records come from FutbolCore (cached five minutes).
export const revalidate = 300;

export default function TablesPage() {
  return (
    <div>
      <NavbarFix />
      <Standing />
    </div>
  );
}
