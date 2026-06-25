import { Button, Link, Section, Text } from '@react-email/components'
import type React from 'react'

export interface DownloadLink {
  label: string
  url: string
}

export interface DigitalProductSectionProps {
  productName: string
  quantity: number
  productUrl?: string
  downloadUrls: DownloadLink[]
  downloadNote: string
  style?: 'default' | 'grouped' | 'compact'
  showProductName?: boolean
}

const buttonStyle = {
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
  marginRight: '8px',
}

const noteStyle = {
  fontSize: '13px',
  color: '#666',
  lineHeight: '20px',
  margin: '4px 0 8px',
  whiteSpace: 'pre-line' as const,
}

const productNameStyle = {
  fontSize: '14px',
  fontWeight: 'bold' as const,
  color: '#1a1a1a',
  margin: '0 0 4px',
}

const productNameLinkStyle = {
  ...productNameStyle,
  color: '#f97316',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '4px',
}

const containerStyle = {
  marginBottom: '16px',
}

const groupedContainerStyle = {
  backgroundColor: '#fff7ed',
  borderRadius: '8px',
  border: '1px solid #fed7aa',
  padding: '16px 20px',
  marginTop: '8px',
}

const groupTitleStyle = {
  fontSize: '10px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  color: '#f97316',
  margin: '0 0 10px',
}

/**
 * Customizable component for displaying digital products in emails.
 * Supports different layout styles for organizing download links.
 */
export function DigitalProductSection({
  productName,
  quantity,
  productUrl,
  downloadUrls,
  downloadNote,
  style = 'default',
  showProductName = true,
}: DigitalProductSectionProps) {
  if (!downloadUrls || downloadUrls.length === 0) return null

  if (style === 'compact') {
    // Compact style: all buttons in one line
    return (
      <Section style={containerStyle}>
        {showProductName &&
          (productUrl ? (
            <Link href={productUrl} style={productNameLinkStyle}>
              {productName} x {quantity}
            </Link>
          ) : (
            <Text style={productNameStyle}>
              {productName} x {quantity}
            </Text>
          ))}
        <Text style={noteStyle}>{downloadNote}</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {downloadUrls.map((dl) => (
            <Button key={dl.label} style={buttonStyle} href={dl.url}>
              {dl.label}
            </Button>
          ))}
        </div>
      </Section>
    )
  }

  if (style === 'grouped') {
    // Grouped style: files shown in a highlighted box
    return (
      <Section style={containerStyle}>
        {showProductName &&
          (productUrl ? (
            <Link href={productUrl} style={productNameLinkStyle}>
              {productName} x {quantity}
            </Link>
          ) : (
            <Text style={productNameStyle}>
              {productName} x {quantity}
            </Text>
          ))}
        <Section style={groupedContainerStyle}>
          <Text style={groupTitleStyle}>📥 Available Files</Text>
          {downloadUrls.map((dl) => (
            <div key={dl.label} style={{ marginBottom: '8px' }}>
              <Button style={buttonStyle} href={dl.url}>
                {dl.label}
              </Button>
            </div>
          ))}
          <Text style={noteStyle}>{downloadNote}</Text>
        </Section>
      </Section>
    )
  }

  // Default style: original design
  return (
    <Section style={containerStyle}>
      {showProductName &&
        (productUrl ? (
          <Link href={productUrl} style={productNameLinkStyle}>
            {productName} x {quantity}
          </Link>
        ) : (
          <Text style={productNameStyle}>
            {productName} x {quantity}
          </Text>
        ))}
      <Text style={noteStyle}>{downloadNote}</Text>
      {downloadUrls.map((dl) => (
        <Button key={dl.label} style={buttonStyle} href={dl.url}>
          {dl.label}
        </Button>
      ))}
    </Section>
  )
}
