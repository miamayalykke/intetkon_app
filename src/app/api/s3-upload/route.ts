import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { currentUser } from '@clerk/nextjs/server'
import { S3_BUCKET, s3 } from '@src/lib/s3-client'
import { type NextRequest, NextResponse } from 'next/server'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

async function isSanityProjectAdmin(token: string): Promise<boolean> {
  try {
    const meRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/users/me`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!meRes.ok) return false
    const me = await meRes.json()

    const membersRes = await fetch(
      `https://api.sanity.io/v1/projects/${SANITY_PROJECT_ID}/members`,
      { headers: { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } },
    )
    if (!membersRes.ok) return false
    const members: { id: string; role: string }[] = await membersRes.json()

    return members.some((m) => m.id === me.id && m.role === 'administrator')
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const user = await currentUser()

  if (!user) {
    const sanityToken = req.headers.get('x-sanity-token')
    if (!sanityToken || !(await isSanityProjectAdmin(sanityToken))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { filename, contentType } = await req.json()

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: 'filename and contentType are required' },
      { status: 400 },
    )
  }

  const key = `digital-products/${Date.now()}-${filename.replace(/\s+/g, '-')}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 })

  return NextResponse.json({ uploadUrl, key })
}
