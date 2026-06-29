import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Experimental features stable in Next.js 16
  experimental: {
    // Enables the React Compiler (opt-in)
    // Disabled here intentionally — we demonstrate memoization manually so the
    // interviewer can see the decision-making, not just "compiler did it".
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default nextConfig;
