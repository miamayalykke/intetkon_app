import { clerkMiddleware } from '@clerk/nextjs/server'
import { defaultLocale, locales } from '@src/i18n'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const ADMIN_ROUTES = ['/studio', '/app/email', '/app']
const AUTH_ROUTES = ['/app/orders']

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // Skip i18n routing for API routes, studio and admin routes
  if (pathname.startsWith('/api') || pathname.startsWith('/studio') || pathname.startsWith('/app')) {
    return
  }

  // Handle i18n routing
  const intlResponse = intlMiddleware(req)
  if (intlResponse) {
    return intlResponse
  }

  // Extract locale from pathname
  const pathnameWithoutLocale = pathname.split('/').slice(2).join('/')
  const checkPathname = `/${pathnameWithoutLocale}`

  if (
    process.env.UNDER_CONSTRUCTION === 'true' &&
    process.env.UNDER_CONSTRUCTION_ON_LOCALHOST !== 'false'
  ) {
    const { sessionClaims } = await auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role
    const isAdmin = role === 'admin'

    if (!isAdmin) {
      const isAdminPath = ADMIN_ROUTES.some((p) => checkPathname.startsWith(p))
      const isAllowed =
        isAdminPath ||
        checkPathname === '/' ||
        checkPathname.startsWith('/contact') ||
        checkPathname.startsWith('/about') ||
        checkPathname.startsWith('/pattern-testing') ||
        /\.\w+$/.test(pathname)
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  const isAdminRoute =
    !AUTH_ROUTES.some((p) => checkPathname.startsWith(p)) &&
    ADMIN_ROUTES.some((p) => checkPathname.startsWith(p))

  const isAuthRoute = AUTH_ROUTES.some((p) => checkPathname.startsWith(p))

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
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
