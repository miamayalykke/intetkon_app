'use server'
import {
  GetContactCommand,
  ListContactsCommand,
  SendEmailCommand,
} from '@aws-sdk/client-sesv2'
import { CONTACT_LIST_NAME, FROM_EMAIL, sesv2 } from '@src/lib/ses-client'

/** Replace {{variableName}} placeholders with subscriber-specific values.
 *  {{amazonSESUnsubscribeUrl}} is reserved — SES replaces it automatically. */
function applyVariables(html: string, vars: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (key === 'amazonSESUnsubscribeUrl') return match // leave for SES
    return vars[key] ?? ''
  })
}

const UNSUBSCRIBE_FOOTER = `
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e6e6e6;text-align:center;font-family:sans-serif;font-size:11px;color:#aaa;">
  Don't want to receive these emails?
  <a href="{{amazonSESUnsubscribeUrl}}" style="color:#aaa;text-decoration:underline;">Unsubscribe</a>
</div>`

function withUnsubscribeFooter(html: string): string {
  const tag = '</body>'
  return html.includes(tag)
    ? html.replace(tag, `${UNSUBSCRIBE_FOOTER}${tag}`)
    : html + UNSUBSCRIBE_FOOTER
}

async function getContactAttributes(
  email: string,
): Promise<Record<string, string>> {
  try {
    const res = await sesv2.send(
      new GetContactCommand({
        ContactListName: CONTACT_LIST_NAME,
        EmailAddress: email,
      }),
    )
    if (!res.AttributesData) return {}
    return JSON.parse(res.AttributesData) as Record<string, string>
  } catch {
    return {}
  }
}

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
    const attrs = await getContactAttributes(toEmail)
    const personalizedHtml = applyVariables(withUnsubscribeFooter(html), attrs)
    const personalizedSubject = applyVariables(subject, attrs)

    await sesv2.send(
      new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: { ToAddresses: [toEmail] },
        Content: {
          Simple: {
            Subject: { Data: `[TEST] ${personalizedSubject}` },
            Body: { Html: { Data: personalizedHtml } },
          },
        },
        ListManagementOptions: {
          ContactListName: CONTACT_LIST_NAME,
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
        const attrs = await getContactAttributes(contact.EmailAddress)
        const personalizedHtml = applyVariables(withUnsubscribeFooter(html), attrs)
        const personalizedSubject = applyVariables(subject, attrs)

        await sesv2.send(
          new SendEmailCommand({
            FromEmailAddress: FROM_EMAIL,
            Destination: { ToAddresses: [contact.EmailAddress] },
            Content: {
              Simple: {
                Subject: { Data: personalizedSubject },
                Body: { Html: { Data: personalizedHtml } },
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
