import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    reactDebugChannel: true,
  },
};

export default nextConfig;
