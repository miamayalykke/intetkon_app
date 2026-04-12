import { auth } from '@clerk/nextjs/server'
import { backendClient } from '@sanity/lib/backendClient'
import { getPresignedDownloadUrl } from '@src/lib/s3-client'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId } = await params

  // Verify the logged-in user has a paid order containing this product
  const order = await backendClient.fetch<{ _id: string } | null>(
    `*[_type == "order" && clerkUserId == $userId && status == "paid" && $productId in products[].product._ref][0]{ _id }`,
    { userId, productId },
  )

  if (!order) {
    return NextResponse.json(
      { error: 'Purchase not found' },
      { status: 404 },
    )
  }

  // Get the S3 key for the product
  const product = await backendClient.fetch<{
    productType: string
    s3Key?: string
  } | null>(
    `*[_type == "product" && _id == $productId][0]{ productType, s3Key }`,
    { productId },
  )

  if (!product || product.productType !== 'digital' || !product.s3Key) {
    return NextResponse.json(
      { error: 'No downloadable file available for this product' },
      { status: 404 },
    )
  }

  const url = await getPresignedDownloadUrl(product.s3Key)
  return NextResponse.redirect(url)
}
