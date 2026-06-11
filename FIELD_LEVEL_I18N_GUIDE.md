# Field-Level Internationalization Guide

This guide explains how the field-level i18n system works and how to use it.

## Overview

Instead of duplicating entire documents for each language (document-level i18n), we store multiple language variants **within the same field**:

```javascript
// Instead of:
// - Document: "Beginner Workshop (English)"
// - Document: "Begynder Workshop (Dansk)"

// We have:
// - One Document with:
title: [
  { language: "en", value: "Beginner Workshop" },
  { language: "da", value: "Begynder Workshop" }
]
```

**Benefits:**
- Single source of truth for each workshop/product
- Shared fields (price, date, image) aren't duplicated
- Easier to maintain consistency
- More efficient data management

## How It Works

### 1. Data Storage (Sanity)

All translatable fields are arrays:

```typescript
{
  _id: "workshop-123",
  title: [
    { _key: "abc123", language: "en", value: "Beginner 1" },
    { _key: "def456", language: "da", value: "Begynder 1" }
  ],
  slug: [
    { _key: "ghi789", language: "en", value: { current: "beginner-1" } },
    { _key: "jkl012", language: "da", value: { current: "begynder-1" } }
  ],
  date: "2026-06-05T15:00:00Z", // Shared across languages
  price: 299 // Shared across languages
}
```

### 2. Data Extraction (Component Level)

Query functions return **raw Sanity data** without filtering by locale.

Localization happens in wrapper components using `getLocalizedField()`:

```typescript
// src/components/workshop/LocalizedWorkshopList.tsx

const locale = 'da' // From URL
const title = getLocalizedField(workshop.title, locale)
// Returns: "Begynder 1"

const fallback = getLocalizedField(nonExistentField, locale)
// Returns: English version if Danish doesn't exist
```

### 3. Routing (Next.js)

Locale is extracted from URL via middleware:

```
/en/workshops/beginner → locale = 'en'
/da/workshops/begynder → locale = 'da'
```

The locale is available as a route parameter in server components:

```typescript
const { locale } = await params
```

## Using in Your Code

### In Server Components

```typescript
// src/app/[locale]/(store)/workshops/[slug]/page.tsx

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const workshop = await getWorkshopBySlug(slug)
  
  // Extract localized content
  const title = getLocalizedField(workshop.title, locale)
  const description = getLocalizedField(workshop.description, locale)
  
  return <h1>{title}</h1>
}
```

### In Wrapper Components

```typescript
// src/components/workshop/LocalizedWorkshopList.tsx

export default async function LocalizedWorkshopList({
  workshops,
  locale,
}: {
  workshops: WORKSHOPS_QUERYResult
  locale: string
}) {
  const localizedWorkshops = workshops.map((w) => ({
    ...w,
    title: getLocalizedField(w.title, locale),
    description: getLocalizedField(w.description, locale),
  }))
  
  return <WorkshopList workshops={localizedWorkshops} />
}
```

### In Client Components

```typescript
// src/components/LanguageSwitcher.tsx

'use client'

import { usePathname } from 'next/navigation'

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()
  
  const pathWithoutLocale = pathname.startsWith(`/${currentLocale}`)
    ? pathname.slice(currentLocale.length + 1)
    : pathname
  
  return (
    <a href={`/da${pathWithoutLocale || '/'}`}>
      Dansk
    </a>
  )
}
```

## Fallback Behavior

`getLocalizedField()` provides intelligent fallback:

```typescript
const field = [
  { language: "en", value: "English Title" },
  { language: "da", value: "Danish Title" }
]

getLocalizedField(field, 'da') // → "Danish Title"
getLocalizedField(field, 'sv') // → "English Title" (fallback to default)
getLocalizedField(field, 'en') // → "English Title"
```

If a language doesn't exist, it falls back to English (default locale).

## Querying Sanity

Query functions return **complete documents** without language filtering:

```typescript
// ✅ Good - returns all language variants
export async function getWorkshops() {
  const QUERY = defineQuery(`
    *[_type == "workshop"] {
      title,
      description,
      slug,
      date,
      price
    }
  `)
  return client.fetch(QUERY)
}

// ❌ Avoid - try to filter by language in query
// The data structure makes this inefficient
```

Let the **component layer** handle localization instead.

## Adding New Translatable Fields

1. **Update Schema** (src/sanity/schemaTypes/workshopType.ts):

```typescript
defineField({
  name: 'subtitle',
  type: 'internationalizedArrayString',
})
```

2. **Update Component** to extract the new field:

```typescript
const subtitle = getLocalizedField(workshop.subtitle, locale)
```

3. **Fill in Sanity Studio**:
   - Open a workshop
   - Click the new "Subtitle" field
   - Add EN and DA variants

## Performance Considerations

- **Queries return all languages** (they're in the same document, minimal overhead)
- **Filtering happens at component level** (leverages React's rendering)
- **Fallback is fast** (simple array find operation)
- **No additional API calls** for language variants

## Troubleshooting

### "Objects are not valid as React child"
You're trying to render a localized field object directly. Use `getLocalizedField()` first:

```typescript
// ❌ Wrong
<h1>{workshop.title}</h1>

// ✅ Right
<h1>{getLocalizedField(workshop.title, locale)}</h1>
```

### Language not appearing on website
1. Check it's added in Sanity (click language tabs)
2. Verify `getLocalizedField()` is being used in components
3. Check the locale is being passed correctly from URL

### Slug not working for both languages
Create unique slugs for each language in Sanity:
- EN: `beginner-2026-06-05`
- DA: `begynder-2026-06-05`
