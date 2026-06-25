import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Return 410 Gone for old WordPress URLs and unknown manifest requests
  if (
    pathname === '/static/create-manifest.json' ||
    pathname.match(/\/en\/wp-sitemap.*\.xml/)
  ) {
    return new NextResponse(null, { status: 410 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/static/:path*', '/en/wp-sitemap*'],
}
