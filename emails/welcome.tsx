import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
}

export default function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Intetkøn — gender-neutral creativity starts here</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>Welcome to Intetkøn!</Heading>
            <Hr style={hr} />
            <Text style={paragraph}>
              Thank you for joining our community. We're excited to share
              gender-neutral patterns, DIY ideas, and workshop news with you.
            </Text>
            <Text style={paragraph}>
              You're now subscribed with <strong>{email}</strong>.
            </Text>
            <Button style={button} href="https://intetkon.dk/shop">
              Explore Our Shop
            </Button>
            <Hr style={hr} />
            <Text style={footer}>Intetkøn · Crafted for Equality</Text>
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

const hr = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
}

const heading = {
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '0 0 4px',
}

const paragraph = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#444',
}

const button = {
  backgroundColor: '#4a7c59',
  borderRadius: '24px',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 28px',
  display: 'block',
}

const footer = {
  color: '#aaa',
  fontSize: '11px',
  textAlign: 'center' as const,
  marginTop: '8px',
}
