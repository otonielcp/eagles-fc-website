import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop official Eagles FC merchandise — jerseys, training gear, accessories, and more. Support your Grand Island, Nebraska youth soccer club.",
  openGraph: {
    title: "Shop | Eagles FC - Grand Island, NE",
    description:
      "Shop official Eagles FC merchandise — jerseys, training gear, accessories, and more.",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
