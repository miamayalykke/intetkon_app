# Internationalization (i18n) Guide

Your website now supports both English and Danish. Here's how to use the internationalization system.

## Overview

The project uses `next-intl` for internationalization. All content is automatically routed with locale prefixes:
- English: `/en/*`
- Danish: `/da/*`

The default locale is English, and users are automatically redirected to the appropriate language based on their browser settings.

## Translation Files

All translations are stored in JSON files in `src/messages/`:
- `en.json` - English translations
- `da.json` - Danish translations

The translation files use a nested structure with namespaces:

```json
{
  "common": {
    "home": "Home",
    "about": "About"
  },
  "navigation": {
    "home": "Home",
    "shop": "Shop"
  }
}
```

## Using Translations in Components

### In Server Components

Use the `getTranslations` function from `next-intl/server`:

```tsx
import { getTranslations } from 'next-intl/server'

export default function MyComponent() {
  const t = getTranslations('navigation')
  
  return <h1>{t('home')}</h1>
}
```

### In Client Components

Use the `useTranslations` hook:

```tsx
'use client'

import { useTranslations } from 'next-intl'

export default function MyClientComponent() {
  const t = useTranslations('products')
  
  return (
    <button>{t('addToCart')}</button>
  )
}
```

## Switching Languages

The `LocaleSwitcher` component allows users to switch between languages. Add it to your header or anywhere you want the language switcher:

```tsx
import { LocaleSwitcher } from '@src/components/LocaleSwitcher'

export default function Header() {
  return (
    <header>
      <LocaleSwitcher />
    </header>
  )
}
```

## Adding New Translations

1. Open `src/messages/en.json` and add your English translation
2. Open `src/messages/da.json` and add the corresponding Danish translation

Example:
```json
// en.json
{
  "myFeature": {
    "title": "My Feature Title"
  }
}

// da.json
{
  "myFeature": {
    "title": "Min Feature Titel"
  }
}
```

3. Use in your component:
```tsx
const t = useTranslations('myFeature')
return <h1>{t('title')}</h1>
```

## Locale in URL

All routes are now prefixed with the locale:
- Home: `/en`, `/da`
- Shop: `/en/shop`, `/da/shop`
- Product: `/en/product/[slug]`, `/da/product/[slug]`

This is handled automatically by the `next-intl` middleware.

## Getting Current Locale

In client components:
```tsx
import { useLocale } from 'next-intl'

export default function Component() {
  const locale = useLocale()
  return <div>Current locale: {locale}</div>
}
```

In server components:
```tsx
import { getLocale } from 'next-intl/server'

export default async function Component() {
  const locale = await getLocale()
  return <div>Current locale: {locale}</div>
}
```

## Configuration

The i18n configuration is in `src/i18n.ts`:
- Supported locales: `en`, `da`
- Default locale: `en`
- Translation files location: `src/messages/`

To add a new language:
1. Create a new translation file in `src/messages/[locale].json`
2. Update `src/i18n.ts` to include the new locale in the `locales` array
3. The locale will automatically be supported in routing and translations
