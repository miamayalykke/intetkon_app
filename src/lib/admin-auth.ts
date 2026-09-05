import { auth } from '@clerk/nextjs/server'
import 'server-only'

export async function isClerkAdmin(): Promise<boolean> {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role

  return Boolean(userId && role === 'admin')
}
