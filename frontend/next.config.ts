// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // On autorise tous les hôtes HTTPS via remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
