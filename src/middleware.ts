import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ADMIN_ROUTES = ['/studio', '/app/email', '/app']
const AUTH_ROUTES = ['/app/orders']

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  if (process.env.UNDER_CONSTRUCTION === 'true') {
    const isAllowed =
      pathname === '/' ||
      pathname.startsWith('/contact') ||
      pathname.startsWith('/about') ||
      pathname.startsWith('/pattern-testing') ||
      /\.\w+$/.test(pathname) // static assets
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  const isAdminRoute =
    !AUTH_ROUTES.some((p) => pathname.startsWith(p)) &&
    ADMIN_ROUTES.some((p) => pathname.startsWith(p))

  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p))

  if (isAdminRoute) {
    const { userId, sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role
    if (!userId || role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (isAuthRoute) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
})

export const config = {
  // Use the most aggressive matcher possible
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
