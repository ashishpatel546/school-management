/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000',
  },
  // Add logging for debugging
  webpack: (config, { isServer }) => {
    if (!isServer) {
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    }
    return config;
  },
}

module.exports = nextConfig
