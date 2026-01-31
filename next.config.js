const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.michaelzick.com',
      },
      {
        protocol: 'https',
        hostname: 'michaelzick.com',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'michaelzick.com' }],
        destination: 'https://www.michaelzick.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
