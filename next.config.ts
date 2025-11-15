import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheMaxMemorySize: 0,
  // experimental: {
  //   reactDebugChannel: true,
  // },
};

export default nextConfig;
