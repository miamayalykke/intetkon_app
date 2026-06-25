import { auth } from '@clerk/nextjs/server'
import { backendClient } from '@sanity/lib/backendClient'
import { getPresignedDownloadUrl } from '@src/lib/s3-client'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params
  const locale = req.nextUrl.searchParams.get('locale') ?? 'en'
  const sessionToken = req.nextUrl.searchParams.get('session')

  // Verify purchase via Clerk session (logged-in users) or session token (guests)
  let order: { _id: string } | null = null

  if (sessionToken) {
    // Guest path: verify the Stripe session token against the order
    order = await backendClient.fetch<{ _id: string } | null>(
      `*[_type == "order" && stripeCheckoutSessionId == $sessionToken && status == "paid" && $productId in products[].product._ref][0]{ _id }`,
      { sessionToken, productId },
    )
  } else {
    // Logged-in path: verify via Clerk user ID
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    order = await backendClient.fetch<{ _id: string } | null>(
      `*[_type == "order" && clerkUserId == $userId && status == "paid" && $productId in products[].product._ref][0]{ _id }`,
      { userId, productId },
    )
  }

  if (!order) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }

  const product = await backendClient.fetch<{
    productType: string
    s3KeyEn?: Array<{ s3Key: string; filename?: string }>
    s3KeyDa?: Array<{ s3Key: string; filename?: string }>
  } | null>(
    `*[_type == "product" && _id == $productId][0]{ productType, s3KeyEn, s3KeyDa }`,
    { productId },
  )

  if (!product || product.productType !== 'digital') {
    return NextResponse.json(
      { error: 'No downloadable file available for this product' },
      { status: 404 },
    )
  }

  // Get files for the requested locale, fallback to English
  const fileArray = locale === 'da' && product.s3KeyDa ? product.s3KeyDa : product.s3KeyEn

  if (!fileArray || fileArray.length === 0) {
    return NextResponse.json(
      { error: 'No downloadable file available for this product' },
      { status: 404 },
    )
  }

  // Get the first file (user can specify index in query if needed)
  const fileIndex = parseInt(req.nextUrl.searchParams.get('index') ?? '0', 10)
  const file = fileArray[fileIndex]

  if (!file || !file.s3Key) {
    return NextResponse.json(
      { error: 'Downloadable file not found' },
      { status: 404 },
    )
  }

  const url = await getPresignedDownloadUrl(file.s3Key)
  return NextResponse.redirect(url)
}
