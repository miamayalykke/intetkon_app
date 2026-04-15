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

interface WelcomeEmailProps {
  email: string
  firstName?: string
  isTester?: boolean
}

export default function WelcomeEmail({
  email,
  firstName,
  isTester = false,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {isTester
          ? 'You found your way here. Welcome to the circle.'
          : 'Welcome to INTETKØN'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            {/* Header with Logo */}
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

            {/* Content - Conditional based on isTester */}
            {isTester ? (
              <>
                <Text style={introText}>Hi {firstName},</Text>
                <Text style={paragraph}>
                  Your application has been received and we're really glad you
                  found your way here!
                </Text>
                <Text style={paragraph}>
                  You're now part of the INTETKØN pattern tester pool. When a
                  new piece is ready to come to life, you'll be among the first
                  we reach out to.
                </Text>
                <Text style={paragraph}>
                  This isn't just testing. It's a process, a shared space, a
                  quiet rebellion against fast fashion, built stitch by stitch,
                  together.
                </Text>
                <Text style={paragraph}>
                  While you're here, we'd love for you to step a little closer:
                </Text>
                <Text style={paragraph}>
                  <strong>Follow along on Instagram:</strong>
                </Text>
                <Section style={buttonWrapper}>
                  <Button
                    style={instagramButton}
                    href="https://www.instagram.com/_intetkon_/"
                  >
                    Intetkøn | Instagram
                  </Button>
                </Section>
                <Text style={paragraph}>
                  also invited into the <strong>INTETKØN family group,</strong>{' '}
                  a closed space for testers. This is where we share
                  experiences, small tips, thoughts, process, and everything in
                  between.
                </Text>
                <Section style={buttonWrapper}>
                  <Button
                    style={instagramButton}
                    href="https://www.instagram.com/j/Abbqk8yb2ehUuYUa/"
                  >
                    Intetkøn | Closed Group
                  </Button>
                </Section>
                <Text style={paragraph}>
                  In the meantime, have a look around the shop. No pressure.
                  Just presence.
                </Text>
                <Button style={button} href="https://intetkon.dk/shop">
                  Explore Our Shop
                </Button>
              </>
            ) : (
              <>
                <Text style={introText}>You found your way here.</Text>
                <Text style={paragraph}>
                  That means something. You're not here by accident. You're here
                  because you're looking for another rhythm where{' '}
                  <span style={emphasis}>intention</span> matters more than
                  speed, where <span style={emphasis}>making</span> means
                  something, and where <span style={emphasis}>community</span>{' '}
                  is built on slowness, not noise.
                </Text>
                <Text style={paragraph}>
                  Welcome to INTETKØN. This is more than a newsletter. It's a
                  circle. And you're now inside it, subscribed with{' '}
                  <span style={emailAddress}>{email}</span>.
                </Text>
                <Text style={paragraph}>Here, we share:</Text>
                <Text style={bulletPoint}>
                  • Genderless patterns with purpose
                </Text>
                <Text style={bulletPoint}>
                  • DIY processes that teach you something
                </Text>
                <Text style={bulletPoint}>
                  • Workshop moments from the studio
                </Text>
                <Text style={bulletPoint}>• The thinking behind it all</Text>
                <Hr style={divider} />
                <Section style={ctaBoxSection}>
                  <Text style={ctaBoxText}>
                    Go deeper if you want. We're building and thinking out loud:
                  </Text>
                  <Section style={buttonWrapper}>
                    <Button
                      style={instagramButton}
                      href="https://www.instagram.com/_intetkon_/"
                    >
                      Intetkøn | Instagram
                    </Button>
                  </Section>
                </Section>
              </>
            )}

            {!isTester && (
              <Text style={closingMessage}>
                <span style={{ fontWeight: 600, fontStyle: 'normal' }}>
                  There's no rush here.
                </span>{' '}
                Take your time.
              </Text>
            )}
            <Hr style={divider} />
            <Text style={closingMessage}>
              <span style={{ fontWeight: 600, fontStyle: 'normal' }}>
                Yours sincerely,
              </span>
            </Text>
            <Text style={closingMessage}>Emilie / INTETKØN</Text>
            <Hr style={divider} />
            <Text style={footer}>INTETKØN A space for those who care</Text>
            <Text style={unsubscribeText}>
              Don't want to receive these emails?{' '}
              <a href="{{amazonSESUnsubscribeUrl}}" style={{ color: '#aaa' }}>
                Unsubscribe
              </a>
            </Text>
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

const _logoImage = {
  width: '120px',
  height: 'auto',
  margin: '0 auto 1.5rem',
  display: 'block' as const,
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

const emphasis = {
  fontStyle: 'italic' as const,
  color: '#666666',
}

const emailAddress = {
  fontWeight: '500' as const,
  color: '#1a1a1a',
}

const bulletPoint = {
  fontSize: '16px',
  lineHeight: '1.8',
  marginBottom: '0.75rem',
  color: '#1a1a1a',
  margin: '0 0 0.75rem 1rem',
}

const ctaBoxSection = {
  backgroundColor: '#fafafa',
  borderLeft: '3px solid #1a1a1a',
  padding: '2rem',
  margin: '2.5rem 0',
}

const ctaBoxText = {
  fontSize: '16px',
  lineHeight: '1.8',
  marginBottom: '1.5rem',
  color: '#1a1a1a',
  margin: '0 0 1.5rem 0',
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
  display: 'block',
  margin: '1.5rem 0',
  border: 'none',
  cursor: 'pointer',
}

const buttonWrapper = {
  textAlign: 'center' as const,
  margin: '1.5rem 0',
}

const instagramButton = {
  ...button,
  backgroundColor: '#f26822',
  borderRadius: '24px',
  display: 'inline-block',
  margin: '0',
  width: '220px',
  boxSizing: 'border-box' as const,
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

const unsubscribeText = {
  color: '#aaa',
  fontSize: '10px',
  textAlign: 'center' as const,
  marginTop: '4px',
  margin: '1rem 0 0 0',
}
