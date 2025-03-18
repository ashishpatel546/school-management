/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: '.next',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://backend:8080',
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
