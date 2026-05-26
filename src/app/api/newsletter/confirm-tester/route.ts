import { verifyPatternTesterSubscription } from '@src/lib/newsletter-actions'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const firstName = searchParams.get('firstName')
  const sewingLevel = searchParams.get('sewingLevel')
  const message = searchParams.get('message')

  if (!token || !firstName) {
    return Response.json(
      { error: 'Missing confirmation token or name' },
      { status: 400 },
    )
  }

  const result = await verifyPatternTesterSubscription(
    token,
    firstName,
    sewingLevel || '',
    message || '',
  )

  if (result.status === 'invalid_token') {
    return Response.json(
      {
        error: 'Invalid or expired confirmation link. Please apply again.',
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

  redirect('/?pattern-tester=confirmed')
}
