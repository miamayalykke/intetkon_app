import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (_auth, req) => {
  // If UNDER_CONSTRUCTION=true is set in .en_reqthe middleware will redirect
  // to the under construction page (/) for all routes.
  // if (process.env.UNDER_CONSTRUCTION === 'true') {
  //   const { pathname } = req.nextUrl
  //   const isAllowed =
  //     pathname === '/' ||
  //     pathname.startsWith('/contact') ||
  //     pathname.startsWith('/about') ||
  //     /\.\w+$/.test(pathname) // static assets
  //   if (!isAllowed) {
  //     return NextResponse.redirect(new URL('/', req.url))
  //   }
  // }
})

export const config = {
  // Use the most aggressive matcher possible
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
