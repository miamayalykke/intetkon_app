# Multilingual Content Management Guide

## Overview

Your Sanity CMS is now configured to support multilingual content for products, workshops, and categories. The system uses **document-level translations** with language variants.

## How It Works

- Each product, workshop, and category has a `language` field (English or Danish)
- Documents can optionally reference their translations in other languages
- When fetching content, the system filters by the current locale (from URL)
- If content is missing in the requested language, it falls back to English

## Creating Multilingual Content

### Step 1: Create English Version

1. Go to Sanity Studio
2. Create a **Product**, **Workshop**, or **Category** document
3. Set `Language` to **English**
4. Fill in all content (name, slug, description, etc.)
5. Save the document

### Step 2: Create Danish Translation

1. Create a new document of the same type
2. Set `Language` to **Dansk** 
3. Translate all the text content
4. **Keep the same `slug`** - but it will be language-specific in the system
5. Save the document

### Step 3: Link Translations (Optional but Recommended)

1. Open the English document
2. Scroll down to the **Translations** section
3. In the `Danish version` field, select the Danish document you created
4. Save the document
5. Open the Danish document
6. In the `English version` field, select the English document
7. Save the document

This creates a bidirectional reference so editors can easily navigate between language versions.

## Sanity Studio Changes

The schema has been updated to show language indicators:
- 🇬🇧 for English documents
- 🇩🇰 for Danish documents

These appear in the document list and preview panel.

## URL Structure

URLs automatically include the language:
- English: `/en/product/product-name`, `/en/shop`, `/en/workshops`
- Danish: `/da/product/product-navn`, `/da/butik`, `/da/workshops`

Users see content in the language they're browsing.

## Best Practices

1. **Always create both language versions** - Users expect content in their language
2. **Keep slugs meaningful in each language** - Use translated terms in slugs
3. **Link translations together** - Makes editing easier
4. **Test both languages** - View the site in English and Danish to verify

## Content Coverage

Make sure to translate:
- Product/Workshop names and descriptions
- Category names and descriptions
- All text content visible to users

## Fallback Behavior

If a user requests content in Danish but only English exists:
- The system will show the English version as a fallback
- This ensures users always see *some* content rather than a 404

To avoid this, always create both language versions.

## Managing Existing Content

If you have existing products/workshops without language tags:
1. Edit each document
2. Set the `Language` field to **English** (or **Dansk** if it's in Danish)
3. Duplicate and translate to create the other language version
4. Link them together

## Technical Details

The system uses:
- Language field: `language` (values: "en", "da")
- Translation references: `translations.en`, `translations.da`
- URL parameter: `[locale]` in the route
- Fallback: Default to English if requested language unavailable
