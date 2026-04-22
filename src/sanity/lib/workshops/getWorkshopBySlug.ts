import { defineQuery } from 'next-sanity'
import { client } from '../client'

const WORKSHOP_BY_SLUG_QUERY = defineQuery(`
  *[_type == "workshop" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    duration,
    location,
    level,
    price,
    maxAllocation,
    currentSignUps,
    description,
    image
  }
`)

export async function getWorkshopBySlug(slug: string) {
  const data = await client.fetch(WORKSHOP_BY_SLUG_QUERY, { slug })
  return data ?? null
}
