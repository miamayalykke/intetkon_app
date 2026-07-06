import { defineQuery } from 'next-sanity'

import { client } from '../client'

export interface PrivateEventSlot {
  _id: string
  date: string
  endDate?: string
  minGroupSize: number
  maxGroupSize: number
  pricingMode: 'perPerson' | 'total'
  price: number
}

export interface PrivateEventAddon {
  _id: string
  title: unknown
  price: number
}

const SLOTS_QUERY = defineQuery(`
  *[_type == "privateEventSlot" && status == "available" && date >= now()]
    | order(date asc) {
    _id,
    date,
    endDate,
    minGroupSize,
    maxGroupSize,
    pricingMode,
    price
  }
`)

const ADDONS_QUERY = defineQuery(`
  *[_type == "privateEventAddon" && active == true] | order(price asc) {
    _id,
    title,
    price
  }
`)

export async function getPrivateEventData(): Promise<{
  slots: PrivateEventSlot[]
  addons: PrivateEventAddon[]
}> {
  try {
    const [slots, addons] = await Promise.all([
      client.fetch(SLOTS_QUERY),
      client.fetch(ADDONS_QUERY),
    ])
    return { slots: slots ?? [], addons: addons ?? [] }
  } catch (error) {
    console.error('Error fetching private event data:', error)
    return { slots: [], addons: [] }
  }
}
