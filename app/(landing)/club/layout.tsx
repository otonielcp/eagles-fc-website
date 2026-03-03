import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Club",
  description:
    "Learn about Eagles Football Club — Grand Island, Nebraska's premier youth soccer club. Our philosophy, mission, and commitment to developing young athletes.",
  openGraph: {
    title: "About the Club | Eagles FC - Grand Island, NE",
    description:
      "Learn about Eagles Football Club — Grand Island, Nebraska's premier youth soccer club.",
  },
};

export default function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
