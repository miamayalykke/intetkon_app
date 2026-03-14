/** @type {import('next').NextConfig} */

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
  reactCompiler: true,
  cacheComponenst: true,
  pageExtensions: ['ts', 'tsx', 'js'],
  output: 'standalone',
  experimental: {
    turbo: {
      root: '.',
    },
  },
}

export default nextConfig
