# Static Pages Internationalization Guide

Static pages (About, Contact, Privacy Policy, etc.) use JSON-based translations instead of Sanity CMS. This keeps simple pages lightweight and code-managed.

## Translation Files

All translations are in JSON files:

- `src/messages/en.json` - English translations
- `src/messages/da.json` - Danish translations

Structure:
```json
{
  "pages": {
    "about": {
      "title": "About INTETKØN",
      "subtitle": "Our Story",
      "description": "Learn about..."
    },
    "contact": {
      "title": "Contact Us",
      ...
    }
  }
}
```

## Using Translations in Pages

All static pages are at `src/app/[locale]/(public)/{pageName}/page.tsx`

### Example: About Page

```typescript
import { getTranslations } from 'next-intl/server'

export default async function AboutPage() {
  const t = getTranslations('pages.about')
  
  return (
    <main>
      <h1>
        {t('title')} <br />
        <span className="text-orange-500">{t('subtitle')}</span>
      </h1>
      <p>{t('description')}</p>
    </main>
  )
}
```

### Available Pages

- `pages.about`
- `pages.contact`
- `pages.privacyPolicy`
- `pages.returnPolicy`
- `pages.termsOfService`
- `pages.careers`

Each page has translation keys: `title`, `subtitle`, `description`, `label` (for navigation)

## Adding New Translation Keys

1. **Add to en.json:**
```json
{
  "pages": {
    "myPage": {
      "title": "My Page Title",
      "content": "Page content..."
    }
  }
}
```

2. **Add to da.json:**
```json
{
  "pages": {
    "myPage": {
      "title": "Min Side Titel",
      "content": "Sideindhold..."
    }
  }
}
```

3. **Use in component:**
```typescript
const t = getTranslations('pages.myPage')
<h1>{t('title')}</h1>
```

## Nested Translations

For complex pages, nest keys:

```json
{
  "pages": {
    "faq": {
      "title": "FAQ",
      "questions": {
        "shipping": "How does shipping work?",
        "returns": "What's your return policy?"
      }
    }
  }
}
```

Access with dots:
```typescript
const t = getTranslations('pages.faq')
t('questions.shipping')
```

## Switching Languages

The language switcher (header) handles navigation:

```
/en/about → click DA → /da/about
```

The `getTranslations` hook automatically uses the correct JSON file based on the current locale.

## Adding a New Static Page

1. **Create directory:**
   ```
   src/app/[locale]/(public)/myNewPage/page.tsx
   ```

2. **Add translations:**
   - `src/messages/en.json` - add `pages.myNewPage`
   - `src/messages/da.json` - add Danish version

3. **Create page:**
   ```typescript
   import { getTranslations } from 'next-intl/server'
   
   export default async function MyNewPage() {
     const t = getTranslations('pages.myNewPage')
     return <h1>{t('title')}</h1>
   }
   ```

4. **(Optional) Add to navigation:**
   - Update `src/components/headers/NavigationMenu.tsx`
   - Add link to your new page

## Translation Keys Reference

Current translation structure:

```
pages/
  about/
    - title
    - subtitle
    - description
    - label (navigation label)
  contact/
    - title
    - subtitle
    - description
    - label
  privacyPolicy/
    - title
    - subtitle
    - description
    - label
  returnPolicy/
    - title
    - subtitle
    - description
    - label
  termsOfService/
    - title
    - subtitle
    - description
    - label
  careers/
    - title
    - subtitle
    - description
    - label
```

## Best Practices

1. **Keep keys consistent** - use camelCase for nested keys
2. **Group related translations** - nest under page name
3. **Use descriptive keys** - `heroTitle` not just `title1`
4. **Translate all user-facing text** - even labels and buttons
5. **Test both languages** - visit `/en/*` and `/da/*` to verify

## Troubleshooting

### "Cannot find module"
Make sure the JSON files are properly formatted and in `src/messages/`.

### Translation not showing
1. Check the key name matches exactly (case-sensitive)
2. Verify it's in both en.json and da.json
3. Restart the dev server

### Wrong language showing
1. Check the URL has the correct locale prefix (`/en/` or `/da/`)
2. Verify the JSON file has the key
3. Check `getTranslations` is using the correct namespace
