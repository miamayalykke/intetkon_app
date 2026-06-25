import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { format } from 'date-fns'
import { da as daLocale, enGB } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'
import { DigitalProductSection } from './components/DigitalProductSection'

const TIMEZONE = 'Europe/Copenhagen'
// Customize email file display style here: 'default' | 'grouped' | 'compact'
const DIGITAL_PRODUCT_STYLE = 'default' as const

export interface OrderProduct {
  name: string
  quantity: number
  price: number
  productType: 'digital' | 'physical_course' | 'physical'
  downloadUrls?: { label: string; url: string }[]
  courseDate?: string
  courseLocation?: string
  courseDuration?: string
  productUrl?: string
}

interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  orderDate: string
  totalPrice: number
  currency: string
  products: OrderProduct[]
  ordersPageUrl: string
  locale?: string
}

const translations = {
  en: {
    preview: (n: string) => `Order confirmed: ${n}`,
    heading: 'Order Confirmed',
    greeting: (name: string) => `Hi ${name},`,
    intro: "Thank you for your order! Here's a summary of what you purchased.",
    orderRefLabel: 'Order reference',
    dateLabel: 'Date',
    sessionDetailsLabel: 'Your session details',
    downloadNote:
      'Your download links are valid for 48 hours. You can always generate fresh ones from your orders page.',
    downloadButton: 'Download now',
    downloadEn: 'Download (English)',
    downloadDa: 'Download (Danish)',
    courseNote:
      'Materials are included in the price. Please arrive 10 minutes before the session starts.',
    shippingNote:
      "We'll send you a shipping notification once your order is on its way.",
    totalLabel: 'Total',
    viewOrdersButton: 'View my orders',
    at: 'at',
    dateLocale: enGB,
  },
  da: {
    preview: (n: string) => `Ordre bekræftet: ${n}`,
    heading: 'Ordre bekræftet',
    greeting: (name: string) => `Hej ${name},`,
    intro: 'Tak for din ordre! Her er en oversigt over det du har købt.',
    orderRefLabel: 'Ordrenummer',
    dateLabel: 'Dato',
    sessionDetailsLabel: 'Dine sessionsdetaljer',
    downloadNote:
      'Dine downloadlinks er gyldige i 48 timer. Du kan altid generere nye fra din ordrehistorik.',
    downloadButton: 'Download nu',
    downloadEn: 'Download (Engelsk)',
    downloadDa: 'Download (Dansk)',
    courseNote:
      'Materialer er inkluderet i prisen. Vær venlig at ankomme 10 minutter inden sessionen starter.',
    shippingNote:
      'Vi sender dig en forsendelsesnotifikation, når din ordre er afsendt.',
    totalLabel: 'I alt',
    viewOrdersButton: 'Se mine ordrer',
    at: 'kl.',
    dateLocale: daLocale,
  },
}

export default function OrderConfirmationEmail({
  customerName,
  orderNumber,
  orderDate,
  totalPrice,
  currency,
  products,
  ordersPageUrl,
  locale = 'en',
}: OrderConfirmationEmailProps) {
  const t = translations[locale as keyof typeof translations] ?? translations.en

  const formattedTotal = new Intl.NumberFormat(locale === 'da' ? 'da-DK' : 'en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(totalPrice)

  return (
    <Html>
      <Head />
      <Preview>{t.preview(orderNumber)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>{t.heading}</Heading>
            <Text style={paragraph}>{t.greeting(customerName)}</Text>
            <Text style={paragraph}>{t.intro}</Text>

            <Hr style={hr} />

            <Text style={label}>{t.orderRefLabel}</Text>
            <Text style={mono}>{orderNumber}</Text>
            <Text style={label}>{t.dateLabel}</Text>
            <Text style={paragraph}>
              {new Date(orderDate).toLocaleDateString(
                locale === 'da' ? 'da-DK' : 'en-GB',
                { dateStyle: 'long' },
              )}
            </Text>

            <Hr style={hr} />

            {products.map((item, i) => (
              <Section key={i}>
                {item.productType === 'digital' && item.downloadUrls && item.downloadUrls.length > 0 ? (
                  <DigitalProductSection
                    productName={item.name}
                    quantity={item.quantity}
                    productUrl={item.productUrl}
                    downloadUrls={item.downloadUrls}
                    downloadNote={t.downloadNote}
                    style={DIGITAL_PRODUCT_STYLE}
                  />
                ) : (
                  <>
                    {item.productUrl ? (
                      <Link href={item.productUrl} style={productNameLink}>
                        {item.name} x {item.quantity}
                      </Link>
                    ) : (
                      <Text style={productName}>
                        {item.name} x {item.quantity}
                      </Text>
                    )}

                    {item.productType === 'physical_course' && (
                      <Section style={workshopBox}>
                        <Text style={workshopLabel}>{t.sessionDetailsLabel}</Text>
                        {item.courseDate && (
                          <>
                            <Text style={workshopDetail}>
                              📅{' '}
                              {format(
                                toZonedTime(new Date(item.courseDate), TIMEZONE),
                                'EEEE, d MMMM yyyy',
                                { locale: t.dateLocale },
                              )}
                            </Text>
                            <Text style={workshopDetail}>
                              🕐 {t.at}{' '}
                              {format(
                                toZonedTime(new Date(item.courseDate), TIMEZONE),
                                'HH:mm',
                              )}
                            </Text>
                          </>
                        )}
                        {item.courseLocation && (
                          <Text style={workshopDetail}>
                            📍 {item.courseLocation}
                          </Text>
                        )}
                        {item.courseDuration && (
                          <Text style={workshopDetail}>
                            ⏱ {item.courseDuration}
                          </Text>
                        )}
                        <Text style={workshopNote}>{t.courseNote}</Text>
                      </Section>
                    )}

                    {item.productType === 'physical' && (
                      <Text style={note}>{t.shippingNote}</Text>
                    )}
                  </>
                )}
              </Section>
            ))}

            <Hr style={hr} />

            <Text style={label}>{t.totalLabel}</Text>
            <Text style={total}>{formattedTotal}</Text>

            <Hr style={hr} />

            <Button style={secondaryButton} href={ordersPageUrl}>
              {t.viewOrdersButton}
            </Button>

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

const productName = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '0 0 4px',
}

const note = {
  fontSize: '13px',
  color: '#666',
  lineHeight: '20px',
  margin: '4px 0 8px',
  whiteSpace: 'pre-line' as const,
}

const total = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '4px 0',
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
  display: 'inline-block',
  marginTop: '4px',
}

const secondaryButton = {
  ...button,
  backgroundColor: '#1a1a1a',
  display: 'block',
}

const footer = {
  color: '#aaa',
  fontSize: '11px',
  textAlign: 'center' as const,
  marginTop: '8px',
}

const workshopBox = {
  backgroundColor: '#fff7ed',
  borderRadius: '8px',
  border: '1px solid #fed7aa',
  padding: '16px 20px',
  marginTop: '8px',
}

const workshopLabel = {
  fontSize: '10px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  color: '#f97316',
  margin: '0 0 10px',
}

const workshopDetail = {
  fontSize: '14px',
  color: '#1a1a1a',
  lineHeight: '22px',
  margin: '2px 0',
}

const workshopNote = {
  fontSize: '12px',
  color: '#888',
  lineHeight: '18px',
  marginTop: '12px',
  fontStyle: 'italic' as const,
}

const productNameLink = {
  ...productName,
  color: '#f97316',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '4px',
}
