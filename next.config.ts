import path from "path";
import type { NextConfig } from "next";

// Hashed build assets and files served from /public. These must stay cacheable;
// only page/data responses get the no-store headers below.
const STATIC_ASSET_EXCLUSION =
  "_next/static|_next/image|.*\\.(?:png|jpe?g|jfif|webp|avif|gif|svg|ico|mp4|webm|woff2?|ttf|otf|css|js|map)$";

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home directory made Next infer the wrong
  // workspace root; pin it to this project.
  outputFileTracingRoot: path.resolve(__dirname),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Team logos from FutbolCore
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    staleTimes: {
      dynamic: 0,
      static: 30, // Minimum value required by Next.js 16
    },
    serverMinification: false,
    optimizePackageImports: [],
  },
  serverExternalPackages: [],

  // Add turbopack config to work with webpack config
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Disables static optimization — makes all pages SSR

  // Disables build caching by generating a new build ID each time
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Set HTTP headers to prevent browser caching of pages and data (so admin
  // edits show up immediately). Static assets are excluded: no-store on them
  // made every visit re-download all JS and images.
  headers: async () => {
    return [
      {
        source: `/:path((?!${STATIC_ASSET_EXCLUSION}).*)`,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },

  // Disable webpack caching in production
  webpack: (config: any, { dev }: { dev: boolean }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },

  // Etags off (pages are no-store anyway); gzip compression stays on (default).
  generateEtags: false,
  poweredByHeader: false,

  // Force all pages to be dynamic (no pre-rendered static output)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
