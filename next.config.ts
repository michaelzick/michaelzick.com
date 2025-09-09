import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['www.michaelzick.com', 'michaelzick.com'],
  },
};

export default nextConfig;
