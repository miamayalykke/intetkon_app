import {
  Body,
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

export interface AdminOrderProduct {
  name: string
  quantity: number
  price: number
  productType: 'digital' | 'physical_course' | 'physical'
  courseDate?: string
  courseLocation?: string
  courseDuration?: string
}

interface AdminOrderNotificationProps {
  customerName: string
  customerEmail: string
  orderNumber: string
  orderDate: string
  totalPrice: number
  amountDiscount: number
  currency: string
  products: AdminOrderProduct[]
  sanityOrderUrl: string
}

export default function AdminOrderNotification({
  customerName,
  customerEmail,
  orderNumber,
  orderDate,
  totalPrice,
  amountDiscount,
  currency,
  products,
  sanityOrderUrl,
}: AdminOrderNotificationProps) {
  const formattedTotal = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(totalPrice)

  const formattedDiscount =
    amountDiscount > 0
      ? new Intl.NumberFormat('da-DK', {
          style: 'currency',
          currency: currency.toUpperCase(),
        }).format(amountDiscount)
      : null

  return (
    <Html>
      <Head />
      <Preview>New order received - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>New Order Received</Heading>
            <Text style={paragraph}>
              A new order has been placed on Intetkøn.
            </Text>

            <Hr style={hr} />

            <Text style={label}>Customer Information</Text>
            <Text style={paragraph}>
              <strong>Name:</strong> {customerName}
            </Text>
            <Text style={paragraph}>
              <strong>Email:</strong>{' '}
              <Link href={`mailto:${customerEmail}`}>{customerEmail}</Link>
            </Text>

            <Hr style={hr} />

            <Text style={label}>Order Details</Text>
            <Text style={paragraph}>
              <strong>Order Number:</strong>{' '}
              <span style={mono}>{orderNumber}</span>
            </Text>
            <Text style={paragraph}>
              <strong>Date:</strong>{' '}
              {new Date(orderDate).toLocaleDateString('en-GB', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </Text>

            <Hr style={hr} />

            <Text style={label}>Items</Text>
            {products.map((item, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: email template
              <Section key={i} style={productRow}>
                <Text style={productName}>
                  {item.name} x {item.quantity}
                </Text>
                <Text style={productDetail}>
                  {new Intl.NumberFormat('da-DK', {
                    style: 'currency',
                    currency: currency.toUpperCase(),
                  }).format(item.price)}
                  {item.quantity > 1
                    ? ` (${new Intl.NumberFormat('da-DK', {
                        style: 'currency',
                        currency: currency.toUpperCase(),
                      }).format(item.price * item.quantity)} total)`
                    : ''}
                </Text>

                {item.productType === 'physical_course' && (
                  <Section style={workshopBox}>
                    {item.courseDate && (
                      <Text style={workshopDetail}>
                        📅{' '}
                        {new Date(item.courseDate).toLocaleDateString(
                          'en-GB',
                          {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          },
                        )}
                      </Text>
                    )}
                    {item.courseDate && (
                      <Text style={workshopDetail}>
                        🕐{' '}
                        {new Date(item.courseDate).toLocaleTimeString('da-DK', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
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
                  </Section>
                )}
              </Section>
            ))}

            <Hr style={hr} />

            <Text style={label}>Order Summary</Text>
            {formattedDiscount && (
              <Text style={paragraph}>
                <strong>Discount:</strong> -{formattedDiscount}
              </Text>
            )}
            <Text style={total}>
              <strong>Total:</strong> {formattedTotal}
            </Text>

            <Hr style={hr} />

            <Link href={sanityOrderUrl} style={button}>
              View Order in Sanity
            </Link>

            <Hr style={hr} />
            <Text style={footer}>Intetkøn Order Notification</Text>
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
  margin: '0 0 12px',
}

const mono = {
  fontFamily: 'monospace',
  fontSize: '13px',
  color: '#f97316',
  fontWeight: 'bold' as const,
}

const productRow = { marginBottom: '20px' }

const productName = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '0 0 4px',
}

const productDetail = {
  fontSize: '13px',
  color: '#666',
  margin: '2px 0 8px',
}

const total = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '4px 0',
}

const button = {
  backgroundColor: '#4a7c59',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 28px',
  display: 'inline-block',
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
  padding: '12px 16px',
  marginTop: '8px',
  fontSize: '13px',
}

const workshopDetail = {
  fontSize: '13px',
  color: '#1a1a1a',
  lineHeight: '20px',
  margin: '2px 0',
}
