import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-0CZS57H4N4";

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
    default: "Eagles FC | Youth Soccer Club in Grand Island, Nebraska",
    template: "%s | Eagles FC - Grand Island, NE",
  },
  description:
    "Eagles Football Club is Grand Island, Nebraska's premier youth soccer club. Teams for boys and girls of all ages. View rosters, fixtures, results, and news. Join the best kids soccer program in central Nebraska.",
  keywords: [
    "Eagles FC",
    "Eagles Football Club",
    "youth soccer Grand Island",
    "kids soccer Grand Island Nebraska",
    "soccer club Grand Island NE",
    "youth soccer club Nebraska",
    "kids soccer near me Grand Island",
    "Grand Island youth sports",
    "Nebraska youth soccer",
    "children soccer Grand Island",
    "boys soccer Grand Island",
    "girls soccer Grand Island",
    "youth football club Nebraska",
    "soccer teams Grand Island NE",
    "central Nebraska soccer",
    "Grand Island soccer league",
    "youth soccer Nebraska",
    "kids soccer Nebraska",
    "soccer club Nebraska",
    "boys soccer Nebraska",
    "girls soccer Nebraska",
    "Nebraska soccer club for kids",
    "soccer registration Grand Island",
    "youth soccer tryouts Nebraska",
    "competitive soccer Nebraska",
    "recreational soccer Grand Island NE",
  ],
  metadataBase: new URL("https://eaglesfc.org"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eaglesfc.org",
    siteName: "Eagles FC",
    title: "Eagles FC | Youth Soccer Club in Grand Island, Nebraska",
    description:
      "Eagles Football Club is Grand Island, Nebraska's premier youth soccer club. Teams for boys and girls of all ages. View rosters, fixtures, results, and news.",
    images: [
      {
        url: "/LOGO%20(2).png",
        width: 512,
        height: 512,
        alt: "Eagles FC - Youth Soccer Club Grand Island Nebraska",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Eagles FC | Youth Soccer Club in Grand Island, Nebraska",
    description:
      "Eagles Football Club is Grand Island, Nebraska's premier youth soccer club. Teams for boys and girls of all ages. View rosters, fixtures, results, and news.",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: "Eagles Football Club",
              alternateName: "Eagles FC",
              url: "https://eaglesfc.org",
              logo: "https://eaglesfc.org/LOGO%20(2).png",
              description:
                "Eagles Football Club is Grand Island, Nebraska's premier youth soccer club offering competitive and recreational soccer programs for boys and girls of all ages.",
              sport: "Soccer",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Grand Island",
                addressRegion: "NE",
                addressCountry: "US",
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "Grand Island",
                  containedInPlace: {
                    "@type": "State",
                    name: "Nebraska",
                  },
                },
                {
                  "@type": "State",
                  name: "Nebraska",
                },
              ],
              memberOf: {
                "@type": "SportsOrganization",
                name: "Youth Soccer",
              },
              keywords:
                "youth soccer, kids soccer, Grand Island soccer, Nebraska soccer club, boys soccer, girls soccer",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
