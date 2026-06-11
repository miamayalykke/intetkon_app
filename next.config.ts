import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

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

export default withNextIntl(nextConfig)
