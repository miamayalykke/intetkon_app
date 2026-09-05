import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { isClerkAdmin } from '@src/lib/admin-auth'
import { S3_BUCKET, s3 } from '@src/lib/s3-client'
import { type NextRequest, NextResponse } from 'next/server'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const MAX_UPLOAD_BYTES = 250 * 1024 * 1024

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
  const clerkAdmin = await isClerkAdmin()
  if (!clerkAdmin) {
    const sanityToken = req.headers.get('x-sanity-token')
    if (!sanityToken || !(await isSanityProjectAdmin(sanityToken))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const { filename, contentType, size } = await req.json()

  if (
    typeof filename !== 'string' ||
    typeof contentType !== 'string' ||
    typeof size !== 'number' ||
    !filename.trim() ||
    !contentType.trim() ||
    !Number.isSafeInteger(size) ||
    size <= 0 ||
    size > MAX_UPLOAD_BYTES
  ) {
    return NextResponse.json(
      { error: 'Invalid filename, content type, or file size' },
      { status: 400 },
    )
  }

  const safeFilename = filename
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180)

  if (!safeFilename) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  const key = `digital-products/${Date.now()}-${safeFilename}`

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 })

  return NextResponse.json({ uploadUrl, key })
}
