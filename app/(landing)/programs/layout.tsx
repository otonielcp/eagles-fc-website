import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore Eagles FC soccer programs in Grand Island, Nebraska — Recreational, Junior Academy, and Select. Youth soccer for boys and girls of all ages and skill levels.",
  openGraph: {
    title: "Programs | Eagles FC - Grand Island, NE",
    description:
      "Explore Eagles FC soccer programs — Recreational, Junior Academy, and Select. Youth soccer for all ages and skill levels.",
  },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
