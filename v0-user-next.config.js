/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 180,
  images: {
    domains: ['kris-yotam.ghost.io'],
  },
  env: {
    GHOST_API_URL: process.env.GHOST_API_URL,
    GHOST_CONTENT_API_KEY: process.env.GHOST_CONTENT_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = ['jsdom', ...config.externals];
    }
    return config;
  },
}

module.exports = nextConfig
