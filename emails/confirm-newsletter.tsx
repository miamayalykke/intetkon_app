import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ConfirmEmailProps {
  email: string
  confirmUrl: string
}

export default function ConfirmEmail({ email, confirmUrl }: ConfirmEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to INTETKØN</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Section style={header}>
              <Img
                src="https://intetkon.com/logo.svg"
                alt="Intetkøn"
                style={{
                  maxWidth: '200px',
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
              <Text style={brandTagline}>Intentional Making</Text>
            </Section>

            <Hr style={divider} />

            <Text style={introText}>Confirm your subscription</Text>

            <Text style={paragraph}>
              We noticed you signed up for the INTETKØN newsletter with this
              email: <span style={emailAddress}>{email}</span>
            </Text>

            <Text style={paragraph}>
              Please confirm your subscription by clicking the button below.
              This link expires in 24 hours.
            </Text>

            <Section style={buttonWrapper}>
              <Button style={button} href={confirmUrl}>
                Confirm Subscription
              </Button>
            </Section>

            <Text style={paragraph}>
              If you didn't sign up for this, you can safely ignore this email.
            </Text>

            <Hr style={divider} />
            <Text style={closingMessage}>
              <span style={{ fontWeight: 600, fontStyle: 'normal' }}>
                Yours sincerely,
              </span>
            </Text>
            <Text style={closingMessage}>Emilie / INTETKØN</Text>
            <Hr style={divider} />
            <Text style={footer}>INTETKØN A space for those who care</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f5f5f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '2rem 0 3rem',
  maxWidth: '600px',
}

const box = {
  padding: '3rem 2.5rem',
  backgroundColor: '#ffffff',
  borderRadius: '0',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '2rem',
}

const brandTagline = {
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#888888',
  fontWeight: '400' as const,
  margin: '0',
  textAlign: 'center' as const,
}

const divider = {
  borderColor: '#e0e0e0',
  borderTop: '1px solid #e0e0e0',
  margin: '2.5rem 0',
  padding: '0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.8',
  marginBottom: '1.5rem',
  color: '#1a1a1a',
  margin: '0 0 1.5rem 0',
}

const introText = {
  fontSize: '18px',
  fontWeight: '500' as const,
  marginBottom: '1rem',
  color: '#1a1a1a',
  margin: '0 0 1rem 0',
}

const emailAddress = {
  fontWeight: '500' as const,
  color: '#1a1a1a',
}

const buttonWrapper = {
  textAlign: 'center' as const,
  margin: '1.5rem 0',
}

const button = {
  backgroundColor: '#1a1a1a',
  borderRadius: '0',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 28px',
  display: 'inline-block',
  margin: '1.5rem 0',
  border: 'none',
  cursor: 'pointer',
}

const closingMessage = {
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
  marginBottom: '2rem',
  fontSize: '16px',
  color: '#1a1a1a',
  margin: '0 0 0.5rem 0',
}

const footer = {
  color: '#999999',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '2rem',
  margin: '2rem 0 0 0',
  letterSpacing: '1px',
}
