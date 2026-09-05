import { backendClient } from '@sanity/lib/backendClient'
import { isClerkAdmin } from '@src/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST() {
  if (!(await isClerkAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const workshops = await backendClient.fetch<
    { _id: string; location?: string }[]
  >(
    `*[_type == "workshop" && location != "studio" && location != "online"]{ _id, location }`,
  )

  const results = await Promise.allSettled(
    workshops.map((w) =>
      backendClient.patch(w._id).set({ location: 'studio' }).commit(),
    ),
  )

  const updated = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return NextResponse.json({ updated, failed })
}
