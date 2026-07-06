'use server'

import 'server-only'
import { SendEmailCommand } from '@aws-sdk/client-sesv2'
import { backendClient } from '@sanity/lib/backendClient'
import { ORDER_FROM_EMAIL, sesv2 } from '@src/lib/ses-client'

export type PrivateEventRequestInput = {
  name: string
  email: string
  phone?: string
  preferredDates: string
  groupSize?: number
  occasion?: string
  message?: string
  locale?: string
}

export type PrivateEventRequestResult =
  | { success: true }
  | { success: false; message: string }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function submitPrivateEventRequest(
  input: PrivateEventRequestInput,
): Promise<PrivateEventRequestResult> {
  const locale = input.locale === 'da' ? 'da' : 'en'
  const name = input.name?.trim()
  const email = input.email?.trim()
  const preferredDates = input.preferredDates?.trim()

  if (!name || !email || !EMAIL_REGEX.test(email) || !preferredDates) {
    return {
      success: false,
      message:
        locale === 'da'
          ? 'Udfyld venligst navn, en gyldig e-mail og din ønskede dato'
          : 'Please fill in your name, a valid email and your preferred date',
    }
  }

  try {
    await backendClient.create({
      _type: 'privateEventRequest',
      name,
      email,
      phone: input.phone?.trim() || undefined,
      preferredDates,
      groupSize: input.groupSize
        ? Math.floor(Number(input.groupSize))
        : undefined,
      occasion: input.occasion || undefined,
      message: input.message?.trim() || undefined,
      status: 'new',
      submittedAt: new Date().toISOString(),
    })

    const adminEmail = process.env.ADMIN_ORDER_EMAIL || 'info@intetkon.com'
    const detailRows = [
      ['Navn / Name', name],
      ['Email', email],
      ['Telefon / Phone', input.phone?.trim() || '—'],
      ['Ønskede datoer / Preferred dates', preferredDates],
      [
        'Antal personer / Group size',
        input.groupSize ? String(input.groupSize) : '—',
      ],
      ['Anledning / Occasion', input.occasion || '—'],
      ['Besked / Message', input.message?.trim() || '—'],
    ]
      .map(
        ([label, value]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#888;">${label}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`,
      )
      .join('')

    // Notify admin — failures here should not fail the request itself
    try {
      await sesv2.send(
        new SendEmailCommand({
          FromEmailAddress: ORDER_FROM_EMAIL,
          Destination: { ToAddresses: [adminEmail] },
          ReplyToAddresses: [email],
          Content: {
            Simple: {
              Subject: {
                Data: `Ny forespørgsel: Book ateliéret – ${name}`,
              },
              Body: {
                Html: {
                  Data: `<div style="font-family:sans-serif;max-width:560px;">
                    <h2>Ny forespørgsel om privat event</h2>
                    <table style="border-collapse:collapse;">${detailRows}</table>
                    <p style="color:#888;font-size:12px;">Svar direkte på denne mail for at kontakte kunden. Forespørgslen ligger også i Sanity under "Private Event Request".</p>
                  </div>`,
                },
              },
            },
          },
        }),
      )

      // Confirmation to the customer
      const confirmSubject =
        locale === 'da'
          ? 'Vi har modtaget din forespørgsel – Intetkøn'
          : 'We have received your request – Intetkøn'
      const confirmBody =
        locale === 'da'
          ? `<p>Hej ${escapeHtml(name)},</p>
             <p>Tak for din forespørgsel om at booke ateliéret. Vi vender tilbage hurtigst muligt med ledige datoer.</p>
             <p>Kærlig hilsen<br/>Intetkøn</p>`
          : `<p>Hi ${escapeHtml(name)},</p>
             <p>Thanks for your request to book the atelier. We will get back to you as soon as possible with available dates.</p>
             <p>Warm regards<br/>Intetkøn</p>`
      await sesv2.send(
        new SendEmailCommand({
          FromEmailAddress: ORDER_FROM_EMAIL,
          Destination: { ToAddresses: [email] },
          Content: {
            Simple: {
              Subject: { Data: confirmSubject },
              Body: {
                Html: {
                  Data: `<div style="font-family:sans-serif;max-width:560px;">${confirmBody}</div>`,
                },
              },
            },
          },
        }),
      )
    } catch (emailError) {
      console.error('Error sending private event request emails:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting private event request:', error)
    return {
      success: false,
      message:
        locale === 'da'
          ? 'Noget gik galt. Prøv igen eller skriv til os direkte.'
          : 'Something went wrong. Please try again or contact us directly.',
    }
  }
}
