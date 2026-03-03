import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  verification: {
    google: "u2djWU6bg7obpO-wmD6xwWdOrjK9FZyLiqIOITNVc7s",
  },
  title: {
    default: "Eagles FC | Official Website",
    template: "%s | Eagles FC",
  },
  description:
    "Official website of Eagles Football Club. View teams, fixtures, results, news, and more.",
  keywords: [
    "Eagles FC",
    "Eagles Football Club",
    "youth soccer",
    "football club",
    "soccer club",
    "fixtures",
    "results",
    "teams",
  ],
  metadataBase: new URL("https://eaglesfc.org"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eaglesfc.org",
    siteName: "Eagles FC",
    title: "Eagles FC | Official Website",
    description:
      "Official website of Eagles Football Club. View teams, fixtures, results, news, and more.",
    images: [
      {
        url: "/LOGO%20(2).png",
        width: 512,
        height: 512,
        alt: "Eagles FC Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Eagles FC | Official Website",
    description:
      "Official website of Eagles Football Club. View teams, fixtures, results, news, and more.",
    images: ["/LOGO%20(2).png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/LOGO%20(2).png", type: "image/png" }],
    apple: [{ url: "/LOGO%20(2).png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
