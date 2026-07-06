import type { AbstractIntlMessages } from 'next-intl'

/**
 * Message namespaces, one JSON file per entry under `src/messages/<locale>/`.
 * Add a file here when you introduce a new top-level namespace.
 */
export const NAMESPACES = [
  'common',
  'navigation',
  'products',
  'user',
  'cart',
  'footer',
  'patterns',
  'workshops',
  'shop',
  'success',
  'basket',
  'blog',
  'privateEvents',
] as const

/**
 * Per-page messages, one JSON file per entry under `src/messages/<locale>/pages/`.
 * These are merged under the `pages` namespace, so components keep using
 * `t('pages.home.…')` exactly as before.
 */
export const PAGES = [
  'home',
  'about',
  'contact',
  'privacy',
  'returnPolicy',
  'terms',
  'underConstruction',
  'orders',
  'careers',
  'patternTester',
  'workshops',
] as const

/**
 * Loads and merges every split message file for a locale back into the single
 * object next-intl expects. The dynamic imports are statically analysable by
 * the bundler because `NAMESPACES`/`PAGES` gate the template literals.
 */
export async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  const [namespaceEntries, pageEntries] = await Promise.all([
    Promise.all(
      NAMESPACES.map(
        async (ns) => [ns, (await import(`../messages/${locale}/${ns}.json`)).default] as const,
      ),
    ),
    Promise.all(
      PAGES.map(
        async (page) =>
          [page, (await import(`../messages/${locale}/pages/${page}.json`)).default] as const,
      ),
    ),
  ])

  return {
    ...Object.fromEntries(namespaceEntries),
    pages: Object.fromEntries(pageEntries),
  }
}
