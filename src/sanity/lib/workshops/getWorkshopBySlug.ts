import { defineQuery } from 'next-sanity'

import { client } from '../client'

const WORKSHOP_BY_SLUG_QUERY = defineQuery(`
  *[_type == "workshop" && (
    slug[0].value.current == $slug ||
    slug[1].value.current == $slug ||
    slug.current == $slug
  )][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    slug,
    date,
    endDate,
    duration,
    location,
    level,
    price,
    maxAllocation,
    currentSignUps,
    description,
    body,
    image,
    stripeProductId
  }
`)

export async function getWorkshopBySlug(slug: string) {
  const data = await client.fetch(WORKSHOP_BY_SLUG_QUERY, { slug })
  return data ?? null
}
