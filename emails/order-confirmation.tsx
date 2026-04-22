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

export interface OrderProduct {
  name: string
  quantity: number
  price: number
  productType: 'digital' | 'physical_course' | 'physical'
  downloadUrl?: string
  courseDate?: string
  courseLocation?: string
}

interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  orderDate: string
  totalPrice: number
  currency: string
  products: OrderProduct[]
  ordersPageUrl: string
}

export default function OrderConfirmationEmail({
  customerName,
  orderNumber,
  orderDate,
  totalPrice,
  currency,
  products,
  ordersPageUrl,
}: OrderConfirmationEmailProps) {
  const formattedTotal = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(totalPrice)

  return (
    <Html>
      <Head />
      <Preview>Order confirmed - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>Order Confirmed</Heading>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Thank you for your order! Here's a summary of what you purchased.
            </Text>

            <Hr style={hr} />

            <Text style={label}>Order reference</Text>
            <Text style={mono}>{orderNumber}</Text>
            <Text style={label}>Date</Text>
            <Text style={paragraph}>
              {new Date(orderDate).toLocaleDateString('da-DK', {
                dateStyle: 'long',
              })}
            </Text>

            <Hr style={hr} />

            {products.map((item, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: email template
              <Section key={i} style={productRow}>
                <Text style={productName}>
                  {item.name} x {item.quantity}
                </Text>

                {item.productType === 'digital' && item.downloadUrl && (
                  <>
                    <Text style={note}>
                      Your download link is valid for 48 hours. You can always
                      generate a fresh one from your orders page.
                    </Text>
                    <Button style={button} href={item.downloadUrl}>
                      Download now
                    </Button>
                  </>
                )}

                {item.productType === 'physical_course' && (
                  <Text style={note}>
                    {item.courseDate
                      ? `📅 ${new Date(item.courseDate).toLocaleDateString('da-DK', { dateStyle: 'long', timeStyle: 'short' } as Intl.DateTimeFormatOptions)}`
                      : ''}
                    {item.courseLocation ? `\n📍 ${item.courseLocation}` : ''}
                  </Text>
                )}

                {item.productType === 'physical' && (
                  <Text style={note}>
                    We'll send you a shipping notification once your order is on
                    its way.
                  </Text>
                )}
              </Section>
            ))}

            <Hr style={hr} />

            <Text style={label}>Total</Text>
            <Text style={total}>{formattedTotal}</Text>

            <Hr style={hr} />

            <Button style={secondaryButton} href={ordersPageUrl}>
              View my orders
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

const productRow = { marginBottom: '16px' }

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
