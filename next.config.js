const nextConfig = {
  images: { domains: ['www.michaelzick.com', 'michaelzick.com'] },
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
