import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
    forceSwcTransforms: true,
    serverMinification: false,
    optimizePackageImports: [],
  },
  serverExternalPackages: [],


  // Disables static optimization — makes all pages SSR

  // Disables build caching by generating a new build ID each time
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Set HTTP headers to prevent browser caching
  headers: async () => {
    return [
      {
        source: '/:path*',
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

  // Turn off compression and etags
  compress: false,
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
