import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/9pfz6g8ri/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Compression
  compress: true,
  // Production source maps off for smaller bundles
  productionBrowserSourceMaps: false,
  // Security & caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache manifest downloads briefly
        source: '/(.*)\\.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
};

export default nextConfig;
