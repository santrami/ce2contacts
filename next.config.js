const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    
    if (isServer) {
      config.externals.push('_http_common');
    }
    
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    USER: process.env.EMAIL_SERVER_USER,
    PASS: process.env.EMAIL_SERVER_USER,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  },
  // Production settings
  images: {
    domains: ['ce2contacts.earth.bsc.es'],
    unoptimized: true
  },
  // Increase timeout for static generation
  staticPageGenerationTimeout: 120
}