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
import { format } from 'date-fns'
import { da as daLocale, enGB } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'Europe/Copenhagen'

interface WorkshopReminderEmailProps {
  customerName: string
  workshopTitle: string
  workshopDate: string
  workshopLocation: string
  workshopEndTime?: string
  locale?: string
}

const translations = {
  en: {
    preview: (title: string) => `Reminder: ${title} is coming up`,
    heading: "See you soon!",
    greeting: (name: string) => `Hi ${name},`,
    intro: (title: string) => `Just a friendly reminder that your workshop <strong>${title}</strong> is coming up in about 48 hours.`,
    dateTimeLabel: 'Date & Time',
    locationLabel: 'Location',
    locationDisplay: (loc: string) => loc === 'online' ? 'Online' : 'Studio in Copenhagen',
    durationLabel: 'Duration',
    onlineNote: "We'll send you a link before the session begins.",
    studioNote: 'Please arrive 10 minutes early. All materials are included.',
    at: 'at',
    dateLocale: enGB,
  },
  da: {
    preview: (title: string) => `Påmindelse: ${title} er snart`,
    heading: 'Vi ses snart!',
    greeting: (name: string) => `Hej ${name},`,
    intro: (title: string) => `Bare en venlig påmindelse om at din workshop <strong>${title}</strong> begynder om ca. 48 timer.`,
    dateTimeLabel: 'Dato & Tidspunkt',
    locationLabel: 'Sted',
    locationDisplay: (loc: string) => loc === 'online' ? 'Online' : 'Studio i København',
    durationLabel: 'Varighed',
    onlineNote: 'Vi sender dig et link inden sessionen begynder.',
    studioNote: 'Vær venlig at ankomme 10 minutter inden. Alle materialer er inkluderet.',
    at: 'kl.',
    dateLocale: daLocale,
  },
}

export default function WorkshopReminderEmail({
  customerName,
  workshopTitle,
  workshopDate,
  workshopLocation,
  workshopEndTime,
  locale = 'en',
}: WorkshopReminderEmailProps) {
  const t = translations[locale as keyof typeof translations] ?? translations.en
  const isOnline = workshopLocation === 'online'

  const zonedDate = toZonedTime(new Date(workshopDate), TIMEZONE)
  const formattedDate = format(zonedDate, 'EEEE, d MMMM yyyy', { locale: t.dateLocale })
  const formattedTime = format(zonedDate, 'HH:mm')

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
              dangerouslySetInnerHTML={{ __html: t.intro(workshopTitle) }}
            />

            <Hr style={hr} />

            <Text style={label}>{t.dateTimeLabel}</Text>
            <Text style={detail}>
              {formattedDate} {t.at} {formattedTime}{workshopEndTime ? ` - ${workshopEndTime}` : ''}
            </Text>

            <Text style={label}>{t.locationLabel}</Text>
            <Text style={detail}>{t.locationDisplay(workshopLocation)}</Text>

            <Hr style={hr} />

            <Text style={note}>
              {isOnline ? t.onlineNote : t.studioNote}
            </Text>

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
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}
const container = { margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }
const box = { padding: '28px 32px', backgroundColor: '#ffffff', borderRadius: '12px' }
const hr = { borderColor: '#e6e6e6', margin: '20px 0' }
const heading = { fontSize: '26px', fontWeight: 'bold' as const, color: '#1a1a1a', margin: '0 0 4px' }
const paragraph = { fontSize: '14px', lineHeight: '24px', color: '#444' }
const label = { fontSize: '10px', fontWeight: 'bold' as const, textTransform: 'uppercase' as const, letterSpacing: '0.15em', color: '#999', margin: '0' }
const detail = { fontSize: '14px', color: '#444', margin: '2px 0 12px', lineHeight: '20px' }
const note = { fontSize: '13px', color: '#666', lineHeight: '20px', fontStyle: 'italic' as const, margin: '0' }
const footer = { color: '#aaa', fontSize: '11px', textAlign: 'center' as const, marginTop: '8px' }
