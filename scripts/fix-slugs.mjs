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

async function fixSlugs() {
  console.log('Starting slug fix...')

  const workshops = await client.fetch('*[_type == "workshop"]')
  console.log(`Found ${workshops.length} workshops`)

  let fixedCount = 0
  let errorCount = 0

  for (const workshop of workshops) {
    try {
      if (!Array.isArray(workshop.slug) || !workshop.slug[0]) {
        continue
      }

      const slugValue = workshop.slug[0].value
      let slugObject = null

      // If value is a string, wrap it as a slug object
      if (typeof slugValue === 'string') {
        slugObject = {
          current: slugValue,
        }
      }
      // If value is already a slug object, keep it
      else if (typeof slugValue === 'object' && slugValue.current) {
        slugObject = slugValue
      }
      // If empty or missing, try to generate from title
      else if (!slugValue || (typeof slugValue === 'string' && slugValue === '')) {
        const titleValue = workshop.title?.[0]?.value
        if (titleValue && typeof titleValue === 'string') {
          const slug = titleValue
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
          slugObject = { current: slug }
        } else {
          console.log(`⚠ Skipping ${workshop._id} - no title to generate slug from`)
          continue
        }
      }

      if (!slugObject) {
        continue
      }

      const fixed = {
        ...workshop,
        slug: [
          {
            _key: randomUUID(),
            language: 'en',
            value: slugObject,
          },
        ],
      }

      await client.patch(workshop._id).set(fixed).commit()
      console.log(`✓ Fixed slug for: ${workshop.title?.[0]?.value || workshop._id}`)
      fixedCount++
    } catch (error) {
      console.error(`✗ Error fixing ${workshop._id}:`, error.message)
      errorCount++
    }
  }

  console.log(`\nFix complete!`)
  console.log(`✓ Fixed: ${fixedCount}`)
  console.log(`✗ Errors: ${errorCount}`)
  process.exit(errorCount > 0 ? 1 : 0)
}

fixSlugs().catch((error) => {
  console.error('Fix failed:', error)
  process.exit(1)
})
