import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3 = new S3Client({
  region: process.env.AWS_S3_REGION || process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME!

/** Generate a pre-signed GET URL that expires in 48 hours by default. */
export async function getPresignedDownloadUrl(
  s3Key: string,
  expiresInSeconds = 48 * 60 * 60,
) {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
  })
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds })
}
