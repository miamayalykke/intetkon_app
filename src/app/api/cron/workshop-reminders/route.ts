import { SendEmailCommand } from '@aws-sdk/client-sesv2'

function formatEndTime(endDate: string | undefined | null): string {
  if (!endDate) return ''
  const { format: dateFnsFormat } = require('date-fns')
  const { toZonedTime } = require('date-fns-tz')
  return dateFnsFormat(
    toZonedTime(new Date(endDate), 'Europe/Copenhagen'),
    'HH:mm',
  )
}

import { render } from '@react-email/render'
import { backendClient } from '@sanity/lib/backendClient'
import { ORDER_FROM_EMAIL, sesv2 } from '@src/lib/ses-client'
import { type NextRequest, NextResponse } from 'next/server'
import WorkshopReminderEmail from '../../../../../emails/workshop-reminder'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const from = new Date(now.getTime() + 46 * 60 * 60 * 1000).toISOString()
  const to = new Date(now.getTime() + 70 * 60 * 60 * 1000).toISOString()

  const workshops = await backendClient.fetch<
    {
      _id: string
      titleEn: string
      titleDa: string
      date: string
      location: string
      endDate: string
    }[]
  >(
    `*[_type == "workshop" && date > $from && date < $to]{
      _id,
      "titleEn": title[language == "en"][0].value,
      "titleDa": title[language == "da"][0].value,
      date,
      endDate,
      location
    }`,
    { from, to },
  )

  if (workshops.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0

  for (const workshop of workshops) {
    const orders = await backendClient.fetch<
      { customerName: string; email: string; locale: string }[]
    >(
      `*[_type == "order" && status == "paid" && references($workshopId)]{
        customerName,
        email,
        "locale": coalesce(locale, "en")
      }`,
      { workshopId: workshop._id },
    )

    for (const order of orders) {
      const locale = order.locale ?? 'en'
      const title =
        locale === 'da'
          ? (workshop.titleDa ?? workshop.titleEn)
          : workshop.titleEn

      const subject =
        locale === 'da' ? `Påmindelse: ${title}` : `Reminder: ${title}`

      const html = await render(
        WorkshopReminderEmail({
          customerName: order.customerName,
          workshopTitle: title,
          workshopDate: workshop.date,
          workshopLocation: workshop.location,
          workshopEndTime: formatEndTime(workshop.endDate),
          locale,
        }),
      )

      await sesv2.send(
        new SendEmailCommand({
          FromEmailAddress: ORDER_FROM_EMAIL,
          Destination: { ToAddresses: [order.email] },
          Content: {
            Simple: {
              Subject: { Data: subject },
              Body: { Html: { Data: html } },
            },
          },
        }),
      )

      sent++
    }
  }

  return NextResponse.json({ sent })
}
