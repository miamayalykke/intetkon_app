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

interface WorkshopAdditionalInfoEmailProps {
  customerName: string
  workshopTitle: string
  contentHtml: string
  locale?: string
}

const translations = {
  en: {
    preview: (title: string) => `Additional information — ${title}`,
    heading: 'Additional Information',
    greeting: (name: string) => `Hi ${name},`,
    intro: (title: string) =>
      `Here is some additional information for your upcoming workshop: ${title}`,
  },
  da: {
    preview: (title: string) => `Yderligere information — ${title}`,
    heading: 'Yderligere information',
    greeting: (name: string) => `Hej ${name},`,
    intro: (title: string) =>
      `Her er yderligere information om din kommende workshop: ${title}`,
  },
}

export default function WorkshopAdditionalInfoEmail({
  customerName,
  workshopTitle,
  contentHtml,
  locale = 'en',
}: WorkshopAdditionalInfoEmailProps) {
  const t =
    translations[locale as keyof typeof translations] ?? translations.en

  return (
    <Html>
      <Head />
      <Preview>{t.preview(workshopTitle)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>{t.heading}</Heading>
            <Text style={paragraph}>{t.greeting(customerName)}</Text>
            <Text style={paragraph}>{t.intro(workshopTitle)}</Text>

            <Hr style={hr} />

            <div
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              style={{ fontSize: '14px', color: '#444', lineHeight: '22px' }}
            />

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

const footer = {
  color: '#aaa',
  fontSize: '11px',
  textAlign: 'center' as const,
  marginTop: '8px',
}
