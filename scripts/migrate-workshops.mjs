import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing required environment variables:')
  if (!projectId) console.error('- NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!dataset) console.error('- NEXT_PUBLIC_SANITY_DATASET')
  if (!token) console.error('- SANITY_AUTH_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

async function migrateWorkshops() {
  console.log('Starting workshop migration...')

  // Fetch all workshops
  const workshops = await client.fetch('*[_type == "workshop"]')
  console.log(`Found ${workshops.length} workshops to migrate`)

  let migratedCount = 0
  let errorCount = 0

  for (const workshop of workshops) {
    try {
      // Check if already migrated (title is an array with language/value structure)
      if (
        Array.isArray(workshop.title) &&
        workshop.title[0] &&
        typeof workshop.title[0] === 'object' &&
        'language' in workshop.title[0] &&
        'value' in workshop.title[0]
      ) {
        console.log(`⊘ Skipping ${workshop._id} (already migrated)`)
        continue
      }

      // Create new structure with English version and _key
      const migrated = {
        ...workshop,
        title: [
          {
            _key: randomUUID(),
            language: 'en',
            value: workshop.title || 'Untitled Workshop',
          },
        ],
        slug: [
          {
            _key: randomUUID(),
            language: 'en',
            value: {
              current: workshop.slug?.current || '',
            },
          },
        ],
        description: [
          {
            _key: randomUUID(),
            language: 'en',
            value: workshop.description || '',
          },
        ],
        body: workshop.body
          ? [
              {
                _key: randomUUID(),
                language: 'en',
                value: workshop.body,
              },
            ]
          : undefined,
        mailInformation: workshop.mailInformation
          ? [
              {
                _key: randomUUID(),
                language: 'en',
                value: workshop.mailInformation,
              },
            ]
          : undefined,
      }

      // Remove old slug structure if it exists
      if (migrated.slug && typeof migrated.slug[0].value === 'object') {
        migrated.slug[0].value = migrated.slug[0].value.current || ''
      }

      // Update in Sanity
      await client
        .patch(workshop._id)
        .set(migrated)
        .commit()

      console.log(`✓ Migrated: ${workshop.title}`)
      migratedCount++
    } catch (error) {
      console.error(`✗ Error migrating ${workshop._id}:`, error.message)
      errorCount++
    }
  }

  console.log(`\nMigration complete!`)
  console.log(`✓ Successfully migrated: ${migratedCount}`)
  console.log(`✗ Errors: ${errorCount}`)
  process.exit(errorCount > 0 ? 1 : 0)
}

migrateWorkshops().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
