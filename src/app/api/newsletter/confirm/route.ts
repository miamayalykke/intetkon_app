import { verifySubscription } from '@src/lib/newsletter-actions'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return Response.json(
      { error: 'Missing confirmation token' },
      { status: 400 },
    )
  }

  const result = await verifySubscription(token, true, false)

  if (result.status === 'invalid_token') {
    return Response.json(
      {
        error: 'Invalid or expired confirmation link. Please sign up again.',
      },
      { status: 400 },
    )
  }

  if (result.status === 'error') {
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }

  redirect('/?newsletter=confirmed')
}
