#!/usr/bin/env node
/**
 * Verifies that every locale under src/messages/ is structurally in sync:
 *   - the same set of JSON files exists for each locale
 *   - every file exposes the exact same set of nested key paths
 *
 * Run with: node scripts/check-messages.mjs   (or `npm run check:i18n`)
 * Exits non-zero on any mismatch so it can gate CI.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const MESSAGES_DIR = fileURLToPath(new URL('../src/messages', import.meta.url))
const REFERENCE_LOCALE = 'en'

/** Recursively list every *.json file within a directory, relative to it. */
function listJsonFiles(dir, base = dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...listJsonFiles(full, base))
    else if (entry.endsWith('.json')) out.push(relative(base, full))
  }
  return out.sort()
}

/** Collect the set of leaf key paths (e.g. "hero.title") from a message object. */
function keyPaths(obj, prefix = '') {
  const paths = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      paths.push(...keyPaths(value, path))
    } else {
      paths.push(path)
    }
  }
  return paths
}

const locales = readdirSync(MESSAGES_DIR).filter((name) =>
  statSync(join(MESSAGES_DIR, name)).isDirectory(),
)

const referenceFiles = listJsonFiles(join(MESSAGES_DIR, REFERENCE_LOCALE))
const errors = []

for (const locale of locales) {
  if (locale === REFERENCE_LOCALE) continue
  const localeFiles = listJsonFiles(join(MESSAGES_DIR, locale))

  const missing = referenceFiles.filter((f) => !localeFiles.includes(f))
  const extra = localeFiles.filter((f) => !referenceFiles.includes(f))
  for (const f of missing) errors.push(`[${locale}] missing file: ${f}`)
  for (const f of extra) errors.push(`[${locale}] unexpected file (not in ${REFERENCE_LOCALE}): ${f}`)

  for (const file of referenceFiles) {
    if (!localeFiles.includes(file)) continue
    const ref = JSON.parse(readFileSync(join(MESSAGES_DIR, REFERENCE_LOCALE, file), 'utf8'))
    const cur = JSON.parse(readFileSync(join(MESSAGES_DIR, locale, file), 'utf8'))
    const refKeys = new Set(keyPaths(ref))
    const curKeys = new Set(keyPaths(cur))
    for (const k of refKeys) if (!curKeys.has(k)) errors.push(`[${locale}] ${file} missing key: ${k}`)
    for (const k of curKeys) if (!refKeys.has(k)) errors.push(`[${locale}] ${file} extra key: ${k}`)
  }
}

if (errors.length > 0) {
  console.error(`✗ Message files out of sync (${errors.length} issue(s)):\n`)
  for (const e of errors) console.error(`  ${e}`)
  process.exit(1)
}

console.log(`✓ All ${locales.length} locales in sync (${referenceFiles.length} files each).`)
