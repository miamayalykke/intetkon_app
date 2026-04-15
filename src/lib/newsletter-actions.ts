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

export type PatternTesterState = {
  status: 'idle' | 'success' | 'conflict' | 'error'
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
      const alreadyOptedIn = topicPreferences.every((tp) => {
        const existing = existingContact.TopicPreferences?.find(
          (ep) => ep.TopicName === tp.TopicName,
        )
        return existing?.SubscriptionStatus === 'OPT_IN'
      })

      await sesv2.send(
        new UpdateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
          TopicPreferences: topicPreferences,
        }),
      )

      if (!alreadyOptedIn) {
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
          console.error('[subscribe] welcome-back email failed:', emailErr)
        }
      }

      return { status: alreadyOptedIn ? 'conflict' : 'success' }
    }

    await sesv2.send(
      new CreateContactCommand({
        ContactListName: CONTACT_LIST_NAME,
        EmailAddress: email,
        TopicPreferences: topicPreferences,
      }),
    )

    // Welcome email is best-effort — contact creation already succeeded
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
      console.error('[subscribe] welcome email failed:', emailErr)
    }

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}

export async function applyPatternTester(
  _prevState: PatternTesterState,
  formData: FormData,
): Promise<PatternTesterState> {
  const firstName = (formData.get('firstName') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const sewingLevel = (formData.get('sewingLevel') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!firstName || !email) return { status: 'error' }

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
      const alreadyTester = existingContact.TopicPreferences?.find(
        (tp) => tp.TopicName === 'pattern-tester',
      )?.SubscriptionStatus === 'OPT_IN'

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

      if (!alreadyTester) {
        try {
          const html = await render(WelcomeEmail({ email, firstName, isTester: true }))
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
          console.error('[applyPatternTester] confirmation email failed:', emailErr)
        }
        return { status: 'success' }
      }

      return { status: 'conflict' }
    }

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

    // Confirmation email is best-effort — contact creation already succeeded
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
      console.error('[applyPatternTester] confirmation email failed:', emailErr)
    }

    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}
