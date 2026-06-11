import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

async function fixWorkshops() {
  console.log('Starting workshop fix...')

  const workshops = await client.fetch('*[_type == "workshop"]')
  console.log(`Found ${workshops.length} workshops`)

  let fixedCount = 0
  let errorCount = 0

  for (const workshop of workshops) {
    try {
      const needsFix = {
        title: false,
        slug: false,
        description: false,
        body: false,
      }

      // Check if title is double-wrapped
      if (
        Array.isArray(workshop.title) &&
        workshop.title[0] &&
        Array.isArray(workshop.title[0].value)
      ) {
        needsFix.title = true
      }

      // Check if slug is double-wrapped
      if (
        Array.isArray(workshop.slug) &&
        workshop.slug[0] &&
        typeof workshop.slug[0].value === 'object' &&
        workshop.slug[0].value.current
      ) {
        needsFix.slug = true
      }

      // Check if description is double-wrapped
      if (
        Array.isArray(workshop.description) &&
        workshop.description[0] &&
        Array.isArray(workshop.description[0].value)
      ) {
        needsFix.description = true
      }

      // Check if body is double-wrapped
      if (
        Array.isArray(workshop.body) &&
        workshop.body[0] &&
        Array.isArray(workshop.body[0].value) &&
        workshop.body[0].value[0]?._type === 'block'
      ) {
        needsFix.body = true
      }

      if (!Object.values(needsFix).some((v) => v)) {
        continue
      }

      console.log(`Fixing: ${workshop.title?.[0]?.value || workshop._id}`)

      const fixed = { ...workshop }

      if (needsFix.title) {
        fixed.title = [
          {
            _key: randomUUID(),
            language: 'en',
            value: workshop.title[0].value[0]?.value || 'Untitled',
          },
        ]
      }

      if (needsFix.slug) {
        fixed.slug = [
          {
            _key: randomUUID(),
            language: 'en',
            value: {
              current: workshop.slug[0].value.current || '',
            },
          },
        ]
      }

      if (needsFix.description) {
        fixed.description = [
          {
            _key: randomUUID(),
            language: 'en',
            value: workshop.description[0].value[0]?.value || '',
          },
        ]
      }

      if (needsFix.body) {
        fixed.body = [
          {
            _key: randomUUID(),
            language: 'en',
            value: workshop.body[0].value,
          },
        ]
      }

      await client.patch(workshop._id).set(fixed).commit()
      fixedCount++
    } catch (error) {
      console.error(`Error fixing ${workshop._id}:`, error.message)
      errorCount++
    }
  }

  console.log(`\nFix complete!`)
  console.log(`✓ Fixed: ${fixedCount}`)
  console.log(`✗ Errors: ${errorCount}`)
  process.exit(errorCount > 0 ? 1 : 0)
}

fixWorkshops().catch((error) => {
  console.error('Fix failed:', error)
  process.exit(1)
})
