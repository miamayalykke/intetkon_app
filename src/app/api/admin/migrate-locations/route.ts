import { currentUser } from '@clerk/nextjs/server'
import { backendClient } from '@sanity/lib/backendClient'
import { NextResponse } from 'next/server'

export async function POST() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workshops = await backendClient.fetch<{ _id: string; location?: string }[]>(
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
