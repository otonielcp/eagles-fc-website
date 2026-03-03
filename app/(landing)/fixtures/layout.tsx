import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fixtures",
  description:
    "View upcoming Eagles FC match fixtures and schedules in Grand Island, Nebraska. Stay up to date with all youth soccer games and tournaments.",
  openGraph: {
    title: "Fixtures | Eagles FC - Grand Island, NE",
    description:
      "View upcoming Eagles FC match fixtures and schedules. Stay up to date with all youth soccer games.",
  },
};

export default function FixturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
