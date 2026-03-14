import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.sanity.io',
        protocol: 'https',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'js'],
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
