import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const hostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      hostname,
      'media0.giphy.com',
      'media1.giphy.com',
      'media2.giphy.com',
      'media3.giphy.com',
      'media4.giphy.com',
      'lh3.googleusercontent.com',
    ],
  },
};

export default nextConfig;
