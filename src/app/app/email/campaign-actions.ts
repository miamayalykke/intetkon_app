'use server'
import {
  ListContactsCommand,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2'
import { CONTACT_LIST_NAME, FROM_EMAIL, sesv2 } from '@src/lib/ses-client'

export type Audience = 'newsletter' | 'pattern-tester' | 'all'

interface SendTestEmailInput {
  html: string
  subject: string
  toEmail: string
}

export async function sendTestEmail({
  html,
  subject,
  toEmail,
}: SendTestEmailInput): Promise<{ success: boolean; message: string }> {
  try {
    await sesv2.send(
      new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: { ToAddresses: [toEmail] },
        Content: {
          Simple: {
            Subject: { Data: `[TEST] ${subject}` },
            Body: { Html: { Data: html } },
          },
        },
      }),
    )
    return { success: true, message: `Test email sent to ${toEmail}.` }
  } catch {
    return { success: false, message: 'Failed to send test email.' }
  }
}

interface SendCampaignInput {
  html: string
  subject: string
  audience: Audience
}

export async function sendCampaign({
  html,
  subject,
  audience,
}: SendCampaignInput): Promise<{ success: boolean; message: string }> {
  try {
    const response = await sesv2.send(
      new ListContactsCommand({
        ContactListName: CONTACT_LIST_NAME,
        Filter:
          audience !== 'all'
            ? {
                FilteredStatus: 'OPT_IN',
                TopicFilter: {
                  TopicName: audience,
                  UseDefaultIfPreferenceUnavailable: false,
                },
              }
            : { FilteredStatus: 'OPT_IN' },
      }),
    )

    const contacts = response.Contacts ?? []
    if (contacts.length === 0) {
      return {
        success: false,
        message: 'No subscribers found for this audience.',
      }
    }

    let sent = 0
    for (const contact of contacts) {
      if (!contact.EmailAddress) continue
      try {
        await sesv2.send(
          new SendEmailCommand({
            FromEmailAddress: FROM_EMAIL,
            Destination: { ToAddresses: [contact.EmailAddress] },
            Content: {
              Simple: {
                Subject: { Data: subject },
                Body: { Html: { Data: html } },
              },
            },
            ListManagementOptions: {
              ContactListName: CONTACT_LIST_NAME,
              TopicName: audience !== 'all' ? audience : undefined,
            },
          }),
        )
        sent++
      } catch {
        // Skip individual failed sends and continue
      }
    }

    return {
      success: true,
      message: `Campaign sent to ${sent} of ${contacts.length} subscribers.`,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[sendCampaign]', err)
    return {
      success: false,
      message: `Failed to send campaign: ${msg}`,
    }
  }
}
