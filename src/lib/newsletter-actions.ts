'use server'
import {
  CreateContactCommand,
  GetContactCommand,
  ListContactsCommand,
  SendEmailCommand,
  UpdateContactCommand,
} from '@aws-sdk/client-sesv2'
import { render } from '@react-email/render'
import ConfirmEmail from '../../emails/confirm-newsletter'
import WelcomeEmail from '../../emails/welcome'
import { CONTACT_LIST_NAME, FROM_EMAIL, sesv2 } from './ses-client'
import {
  generateConfirmationToken,
  verifyConfirmationToken,
} from './newsletter-token'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  if (!EMAIL_REGEX.test(email)) return false
  if (email.includes('..')) return false
  return true
}

export type NewsletterState = {
  status:
    | 'idle'
    | 'success'
    | 'conflict'
    | 'error'
    | 'no_selection'
    | 'invalid_email'
}

export type PatternTesterState = {
  status: 'idle' | 'success' | 'conflict' | 'error'
}

export type TesterApplicationData = {
  firstName: string
  sewingLevel: string
  message: string
}

export async function subscribe(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const isNewsletter = formData.get('newsletter') === 'on'
  const isTester = formData.get('tester') === 'on'

  if (!isNewsletter && !isTester) {
    return { status: 'no_selection' }
  }

  if (!validateEmail(email)) {
    return { status: 'invalid_email' }
  }

  try {
    const token = await generateConfirmationToken(email)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intetkon.com'
    const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${token}`

    const html = await render(ConfirmEmail({ email, confirmUrl }))
    await sesv2.send(
      new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: { ToAddresses: [email] },
        Content: {
          Simple: {
            Subject: { Data: 'Confirm your subscription to Intetkøn' },
            Body: { Html: { Data: html } },
          },
        },
      }),
    )

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}

export async function verifySubscription(
  token: string,
  isNewsletter: boolean,
  isTester: boolean,
): Promise<{ status: 'success' | 'invalid_token' | 'error' }> {
  const email = await verifyConfirmationToken(token)

  if (!email) {
    return { status: 'invalid_token' }
  }

  const topicPreferences = []
  if (isNewsletter) {
    topicPreferences.push({
      TopicName: 'newsletter',
      SubscriptionStatus: 'OPT_IN' as const,
    })
  }
  if (isTester) {
    topicPreferences.push({
      TopicName: 'pattern-tester',
      SubscriptionStatus: 'OPT_IN' as const,
    })
  }

  try {
    let existingContact = null
    try {
      const res = await sesv2.send(
        new GetContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
        }),
      )
      existingContact = res
    } catch {
      // Contact doesn't exist yet
    }

    if (existingContact) {
      await sesv2.send(
        new UpdateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
          TopicPreferences: topicPreferences,
        }),
      )
    } else {
      await sesv2.send(
        new CreateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
          TopicPreferences: topicPreferences,
        }),
      )
    }

    try {
      const html = await render(WelcomeEmail({ email }))
      await sesv2.send(
        new SendEmailCommand({
          FromEmailAddress: FROM_EMAIL,
          Destination: { ToAddresses: [email] },
          Content: {
            Simple: {
              Subject: { Data: 'Welcome to Intetkøn!' },
              Body: { Html: { Data: html } },
            },
          },
          ListManagementOptions: {
            ContactListName: CONTACT_LIST_NAME,
            TopicName: 'newsletter',
          },
        }),
      )
    } catch (emailErr) {
      console.error('[verifySubscription] welcome email failed:', emailErr)
    }

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}

export async function getContactListStats(): Promise<{
  totalContacts: number
  newsletterSubscribers: number
  patternTesterSubscribers: number
}> {
  try {
    const response = await sesv2.send(
      new ListContactsCommand({
        ContactListName: CONTACT_LIST_NAME,
      }),
    )

    const contacts = response.Contacts || []
    const newsletterCount = contacts.filter((c) =>
      c.TopicPreferences?.some(
        (tp) => tp.TopicName === 'newsletter' && tp.SubscriptionStatus === 'OPT_IN',
      ),
    ).length

    const testerCount = contacts.filter((c) =>
      c.TopicPreferences?.some(
        (tp) => tp.TopicName === 'pattern-tester' && tp.SubscriptionStatus === 'OPT_IN',
      ),
    ).length

    return {
      totalContacts: contacts.length,
      newsletterSubscribers: newsletterCount,
      patternTesterSubscribers: testerCount,
    }
  } catch (error) {
    console.error('[getContactListStats] failed:', error)
    return {
      totalContacts: 0,
      newsletterSubscribers: 0,
      patternTesterSubscribers: 0,
    }
  }
}

export async function applyPatternTester(
  _prevState: PatternTesterState,
  formData: FormData,
): Promise<PatternTesterState> {
  const firstName = (formData.get('firstName') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const sewingLevel = (formData.get('sewingLevel') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!firstName || !email) return { status: 'error' }

  if (!validateEmail(email)) return { status: 'error' }

  try {
    const token = await generateConfirmationToken(email)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intetkon.com'
    const confirmUrl = `${baseUrl}/api/newsletter/confirm-tester?token=${token}&firstName=${encodeURIComponent(firstName)}&sewingLevel=${encodeURIComponent(sewingLevel)}&message=${encodeURIComponent(message)}`

    const html = await render(ConfirmEmail({ email, confirmUrl }))
    await sesv2.send(
      new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: { ToAddresses: [email] },
        Content: {
          Simple: {
            Subject: { Data: 'Confirm your pattern tester application' },
            Body: { Html: { Data: html } },
          },
        },
      }),
    )

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}

export async function verifyPatternTesterSubscription(
  token: string,
  firstName: string,
  sewingLevel: string,
  message: string,
): Promise<{ status: 'success' | 'invalid_token' | 'error' }> {
  const email = await verifyConfirmationToken(token)

  if (!email) {
    return { status: 'invalid_token' }
  }

  const attributesData = JSON.stringify({ firstName, sewingLevel, message })

  try {
    let existingContact = null
    try {
      const res = await sesv2.send(
        new GetContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
        }),
      )
      existingContact = res
    } catch {
      // Contact doesn't exist yet
    }

    if (existingContact) {
      await sesv2.send(
        new UpdateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
          TopicPreferences: [
            { TopicName: 'pattern-tester', SubscriptionStatus: 'OPT_IN' },
          ],
          AttributesData: attributesData,
        }),
      )
    } else {
      await sesv2.send(
        new CreateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
          TopicPreferences: [
            { TopicName: 'pattern-tester', SubscriptionStatus: 'OPT_IN' },
          ],
          AttributesData: attributesData,
        }),
      )
    }

    try {
      const html = await render(
        WelcomeEmail({ email, firstName, isTester: true }),
      )
      await sesv2.send(
        new SendEmailCommand({
          FromEmailAddress: FROM_EMAIL,
          Destination: { ToAddresses: [email] },
          Content: {
            Simple: {
              Subject: { Data: `${firstName}, your application is in!` },
              Body: { Html: { Data: html } },
            },
          },
          ListManagementOptions: {
            ContactListName: CONTACT_LIST_NAME,
            TopicName: 'pattern-tester',
          },
        }),
      )
    } catch (emailErr) {
      console.error('[verifyPatternTesterSubscription] welcome email failed:', emailErr)
    }

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}
