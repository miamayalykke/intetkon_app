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

interface WorkshopConfirmationEmailProps {
  customerName: string
  orderNumber: string
  workshopTitle: string
  workshopDate: string
  workshopDuration: string
  workshopLocation: string
  workshopLevel: string
  price: number
  currency: string
}

export default function WorkshopConfirmationEmail({
  customerName,
  orderNumber,
  workshopTitle,
  workshopDate,
  workshopDuration,
  workshopLocation,
  workshopLevel,
  price,
  currency,
}: WorkshopConfirmationEmailProps) {
  const formattedDate = new Date(workshopDate).toLocaleDateString('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = new Date(workshopDate).toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const formattedPrice = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price)

  return (
    <Html>
      <Head />
      <Preview>Your spot is confirmed - {workshopTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>You're booked in!</Heading>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Your spot for <strong>{workshopTitle}</strong> is confirmed. We're
              looking forward to seeing you in the studio.
            </Text>

            <Hr style={hr} />

            <Text style={label}>Booking reference</Text>
            <Text style={mono}>{orderNumber}</Text>

            <Hr style={hr} />

            <Text style={label}>Workshop</Text>
            <Text style={workshopName}>{workshopTitle}</Text>

            <Text style={label}>Date & Time</Text>
            <Text style={detail}>
              {formattedDate} at {formattedTime}
            </Text>

            <Text style={label}>Duration</Text>
            <Text style={detail}>{workshopDuration}</Text>

            <Text style={label}>Location</Text>
            <Text style={detail}>{workshopLocation}</Text>

            <Text style={label}>Level</Text>
            <Text style={detail}>{workshopLevel}</Text>

            <Hr style={hr} />

            <Text style={label}>Total paid</Text>
            <Text style={total}>{formattedPrice}</Text>

            <Text style={note}>
              All materials are included in the price. Please arrive 10 minutes
              before the session begins.
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
