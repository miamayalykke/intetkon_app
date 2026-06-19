import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { blockContentToHtml } from '@src/lib/blockContentToHtml'
import { format } from 'date-fns'
import { da as daLocale, enGB } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'Europe/Copenhagen'

interface WorkshopConfirmationEmailProps {
  customerName: string
  orderNumber: string
  workshopTitle: string
  workshopDate: string
  workshopEndTime?: string
  workshopLocation: string
  workshopLevel: string
  price: number
  currency: string
  mailInformation?: any
  locale?: string
}

const translations = {
  en: {
    preview: (title: string) => `Your spot is confirmed - ${title}`,
    heading: "You're booked in!",
    greeting: (name: string) => `Hi ${name},`,
    intro: (title: string, online: boolean) =>
      online
        ? `Your spot for <strong>${title}</strong> is confirmed. We're looking forward to seeing you online.`
        : `Your spot for <strong>${title}</strong> is confirmed. We're looking forward to seeing you in the studio.`,
    bookingRefLabel: 'Booking reference',
    workshopLabel: 'Workshop',
    dateTimeLabel: 'Date & Time',
    durationLabel: 'Duration',
    locationLabel: 'Location',
    locationDisplay: (loc: string) =>
      loc === 'online' ? 'Online' : 'Studio in Copenhagen',
    levelLabel: 'Level',
    totalPaidLabel: 'Total paid',
    materialsNote:
      'All materials are included in the price. Please arrive 10 minutes before the session begins.',
    additionalInfoLabel: 'Additional Information',
    at: 'at',
    dateLocale: enGB,
  },
  da: {
    preview: (title: string) => `Din plads er bekræftet - ${title}`,
    heading: 'Du er tilmeldt!',
    greeting: (name: string) => `Hej ${name},`,
    intro: (title: string, online: boolean) =>
      online
        ? `Din plads til <strong>${title}</strong> er bekræftet. Vi glæder os til at se dig online.`
        : `Din plads til <strong>${title}</strong> er bekræftet. Vi glæder os til at se dig i studiet.`,
    bookingRefLabel: 'Bookingnummer',
    workshopLabel: 'Workshop',
    dateTimeLabel: 'Dato & Tidspunkt',
    durationLabel: 'Varighed',
    locationLabel: 'Sted',
    locationDisplay: (loc: string) =>
      loc === 'online' ? 'Online' : 'Studio i København',
    levelLabel: 'Niveau',
    totalPaidLabel: 'Betalt i alt',
    materialsNote:
      'Alle materialer er inkluderet i prisen. Vær venlig at ankomme 10 minutter inden sessionen starter.',
    additionalInfoLabel: 'Yderligere information',
    at: 'kl.',
    dateLocale: daLocale,
  },
}

export default function WorkshopConfirmationEmail({
  customerName,
  orderNumber,
  workshopTitle,
  workshopDate,
  workshopEndTime,
  workshopLocation,
  workshopLevel,
  price,
  currency,
  mailInformation,
  locale = 'en',
}: WorkshopConfirmationEmailProps) {
  const t = translations[locale as keyof typeof translations] ?? translations.en
  const isOnline = workshopLocation === 'online'

  const zonedDate = toZonedTime(new Date(workshopDate), TIMEZONE)
  const formattedDate = format(zonedDate, 'EEEE, d MMMM yyyy', {
    locale: t.dateLocale,
  })
  const formattedTime = format(zonedDate, 'HH:mm')
  const formattedPrice = new Intl.NumberFormat(
    locale === 'da' ? 'da-DK' : 'en-GB',
    {
      style: 'currency',
      currency: currency.toUpperCase(),
    },
  ).format(price)

  const mailInformationHtml = mailInformation
    ? blockContentToHtml(mailInformation)
    : null

  return (
    <Html>
      <Head />
      <Preview>{t.preview(workshopTitle)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>{t.heading}</Heading>
            <Text style={paragraph}>{t.greeting(customerName)}</Text>
            <Text
              style={paragraph}
              dangerouslySetInnerHTML={{
                __html: t.intro(workshopTitle, isOnline),
              }}
            />

            <Hr style={hr} />

            <Text style={label}>{t.bookingRefLabel}</Text>
            <Text style={mono}>{orderNumber}</Text>

            <Hr style={hr} />

            <Text style={label}>{t.workshopLabel}</Text>
            <Text style={workshopName}>{workshopTitle}</Text>

            <Text style={label}>{t.dateTimeLabel}</Text>
            <Text style={detail}>
              {formattedDate} {t.at} {formattedTime}{workshopEndTime ? ` - ${workshopEndTime}` : ''}
            </Text>

            <Text style={label}>{t.locationLabel}</Text>
            <Text style={detail}>{t.locationDisplay(workshopLocation)}</Text>

            <Text style={label}>{t.levelLabel}</Text>
            <Text style={detail}>{workshopLevel}</Text>

            <Hr style={hr} />

            <Text style={label}>{t.totalPaidLabel}</Text>
            <Text style={total}>{formattedPrice}</Text>

            <Text style={note}>{t.materialsNote}</Text>

            {mailInformationHtml && (
              <>
                <Hr style={hr} />
                <Text style={label}>{t.additionalInfoLabel}</Text>
                <div
                  dangerouslySetInnerHTML={{ __html: mailInformationHtml }}
                  style={{
                    fontSize: '14px',
                    color: '#444',
                    lineHeight: '20px',
                  }}
                />
              </>
            )}

            <Hr style={hr} />
            <Text style={footer}>Intetkøn</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const box = {
  padding: '28px 32px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
}

const hr = { borderColor: '#e6e6e6', margin: '20px 0' }

const heading = {
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '0 0 4px',
}

const paragraph = { fontSize: '14px', lineHeight: '24px', color: '#444' }

const label = {
  fontSize: '10px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  color: '#999',
  margin: '0',
}

const mono = {
  fontFamily: 'monospace',
  fontSize: '13px',
  color: '#f97316',
  fontWeight: 'bold' as const,
}

const workshopName = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '2px 0 12px',
}

const detail = {
  fontSize: '14px',
  color: '#444',
  margin: '2px 0 12px',
  lineHeight: '20px',
}

const note = {
  fontSize: '13px',
  color: '#666',
  lineHeight: '20px',
  fontStyle: 'italic' as const,
  margin: '12px 0 0',
}

const total = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '4px 0',
}

const footer = {
  color: '#aaa',
  fontSize: '11px',
  textAlign: 'center' as const,
  marginTop: '8px',
}
