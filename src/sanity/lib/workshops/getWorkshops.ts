import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../live'

const WORKSHOPS_QUERY = defineQuery(`
  *[_type == "workshop" && date >= $now] | order(date asc) {
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

export async function getWorkshops() {
  const now = new Date().toISOString()
  const { data } = await sanityFetch({ query: WORKSHOPS_QUERY, params: { now } })
  return data ?? []
}
