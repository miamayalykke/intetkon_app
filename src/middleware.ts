import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (_auth, _req) => {
  // Your custom logic...
})

export const config = {
  // Use the most aggressive matcher possible
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
