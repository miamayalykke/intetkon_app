'use server'
import {
  CreateContactCommand,
  GetContactCommand,
  SendEmailCommand,
  UpdateContactCommand,
} from '@aws-sdk/client-sesv2'
import { render } from '@react-email/render'
import WelcomeEmail from '../../emails/welcome'
import { CONTACT_LIST_NAME, FROM_EMAIL, sesv2 } from './ses-client'

export type NewsletterState = {
  status: 'idle' | 'success' | 'conflict' | 'error' | 'no_selection'
}

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
    // Check if contact already exists
    let isNewContact = true
    try {
      await sesv2.send(
        new GetContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
        }),
      )
      isNewContact = false
    } catch {
      // Contact doesn't exist yet
    }

    if (!isNewContact) {
      // Update topic preferences for existing contact
      await sesv2.send(
        new UpdateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
          TopicPreferences: topicPreferences,
        }),
      )
      return { status: 'conflict' }
    }

    await sesv2.send(
      new CreateContactCommand({
        ContactListName: CONTACT_LIST_NAME,
        EmailAddress: email,
        TopicPreferences: topicPreferences,
      }),
    )

    // Send welcome email
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
      }),
    )

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}
