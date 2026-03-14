'use server'
import { Resend } from 'resend'

export type NewsletterState = {
  status: 'idle' | 'success' | 'conflict' | 'error' | 'no_selection'
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function subscribe(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = formData.get('email') as string
  const isNewsletter = formData.get('newsletter') === 'on'
  const isTester = formData.get('tester') === 'on'

  if (!isNewsletter && !isTester) {
    return { status: 'no_selection' }
  }

  try {
    // Add contact to Resend audience
    await resend.contacts.create({
      email,
      unsubscribed: false,
    })

    // Add to relevant segments
    if (isNewsletter && process.env.RESEND_REGULAR_NEWSLETTER_SEGMENT_ID) {
      await resend.contacts.segments.add({
        email,
        segmentId: process.env.RESEND_REGULAR_NEWSLETTER_SEGMENT_ID,
      })
    }
    if (isTester && process.env.RESEND_PATTERN_TESTER_SEGMENT_ID) {
      await resend.contacts.segments.add({
        email,
        segmentId: process.env.RESEND_PATTERN_TESTER_SEGMENT_ID,
      })
    }

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}
