import { defineQuery } from 'next-sanity'
import { client } from '../client'

export const getPhysicalProducts = async () => {
  const PHYSICAL_PRODUCTS_QUERY = defineQuery(`
        *[
            _type == "product" && productType == "physical"
        ] | order(name asc) {
            ...,
            categories[]->
        }
    `)
  try {
    const products = await client.fetch(PHYSICAL_PRODUCTS_QUERY)
    return products || []
  } catch (error) {
    console.error('Error fetching physical products:', error)
    return []
  }
}
