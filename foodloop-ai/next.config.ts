import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Turbopack scoped to this app when the parent workspace has its own lockfile.
  turbopack: {
    root: process.cwd(),
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
  // Allow leaflet images from CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tile.openstreetmap.org',
      },
    ],
  },
};

export default nextConfig;
