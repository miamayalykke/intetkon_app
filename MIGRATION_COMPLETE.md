# Internationalization Implementation - Complete

This document describes the i18n setup for the Minje Webshop supporting English (en) and Danish (da).

## Architecture

The site uses **field-level internationalization** with `next-intl` for routing and Sanity for content management.

### Key Components

- **Routing**: Locale-prefixed URLs (`/en/*`, `/da/*`)
- **Content**: Field-level translations stored in Sanity as arrays of language variants
- **Middleware**: Excludes studio routes from locale prefixing
- **Query Functions**: Return raw data; localization happens at component level

## Database Structure

All translatable fields are stored as arrays with language variants:

```javascript
title: [
  { _key: "...", language: "en", value: "Workshop Title" },
  { _key: "...", language: "da", value: "Workshop Titel" }
]
```

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx (root layout with locale support)
│   │   ├── (store)/workshops/
│   │   │   ├── page.tsx (workshop list)
│   │   │   └── [slug]/page.tsx (workshop detail)
│   │   └── (public)/ (other pages)
│   └── studio/ (excluded from locale routing)
├── components/
│   ├── workshop/
│   │   ├── LocalizedWorkshopList.tsx (extracts localized fields)
│   │   └── WorkshopList.tsx (displays list)
│   ├── product/
│   │   └── LocalizedProductsView.tsx (extracts localized product fields)
│   └── LanguageSwitcher.tsx (navigation)
├── sanity/
│   ├── schemaTypes/
│   │   ├── workshopType.ts (uses internationalizedArray fields)
│   │   ├── productType.ts (uses internationalizedArray fields)
│   │   ├── categoryType.ts (uses internationalizedArray fields)
│   │   └── internationalizedTypes.ts (field type definitions)
│   └── lib/
│       ├── utils/getLocalizedFields.ts (extraction helpers)
│       ├── workshops/getWorkshops.ts
│       └── products/getPhysicalProducts.ts
├── messages/
│   ├── en.json (static page translations)
│   └── da.json
└── middleware.ts
```

## Schema Types

Four internationalized array field types:
- `internationalizedArrayString` - for short text fields
- `internationalizedArrayText` - for longer text
- `internationalizedArraySlug` - for URL slugs
- `internationalizedArrayBlockContent` - for rich content

## Working with Content in Sanity Studio

1. **Creating a Workshop**:
   - Enter English title, description, slug, content
   - Scroll down and you'll see language tabs (EN, Dansk) for each field
   - Click the Dansk tab and fill in Danish translations

2. **Managing Slugs**:
   - Each language has its own slug field
   - Slugs are required for URL routing
   - Example: `/en/workshops/beginner` vs `/da/workshops/begynder`

3. **Preview**:
   - The preview in Studio shows English title by default
   - Full translations appear on the live website

## Migration Scripts

One-time use scripts for migrating existing data:

- `scripts/migrate-workshops.mjs` - Converted workshop data to array structure
- `scripts/fix-workshops.mjs` - Fixed double-wrapped fields from migration errors
- `scripts/fix-slugs.mjs` - Ensured all slugs are proper Sanity slug objects

To run (if needed): `SANITY_AUTH_TOKEN=xxx node scripts/migrate-workshops.mjs`

## Adding Translations

### For Workshops/Products:
1. Open the document in Sanity Studio
2. Scroll to the field (title, description, etc.)
3. Click the language tabs to switch between languages
4. Add content for each language

### For Static Pages:
See STATIC_PAGES_I18N.md

## Common Tasks

### Generate slugs from titles
Slugs are manually entered in Sanity. When entering a title, create a URL-friendly slug version (lowercase, hyphens instead of spaces).

### Change language on website
Users can click the EN/DA buttons in the header to switch languages while staying on the same page.

### Add a new language
1. Update `src/i18n.ts` - add locale to `locales` array
2. Create `src/messages/{locale}.json`
3. Update schema types to include new language options
4. Update `LanguageSwitcher.tsx`

## Testing

- Visit `/en/workshops` to see English workshops
- Visit `/da/workshops` to see Danish workshops (if translations exist)
- Click language switcher to navigate between versions
- Verify slugs work correctly for both languages

## Known Limitations

- Slugs are currently language-independent (same URL pattern for both)
- Static pages are translated via JSON files, not Sanity CMS
- Query results are not pre-filtered by language; filtering happens at component level
