import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { currentUser } from '@clerk/nextjs/server'
import { S3_BUCKET, s3 } from '@src/lib/s3-client'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
