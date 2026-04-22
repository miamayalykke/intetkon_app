import { defineQuery } from 'next-sanity'
import { client } from '../client'

export const getDigitalProducts = async () => {
  const DIGITAL_PRODUCTS_QUERY = defineQuery(`
        *[
            _type == "product" && productType == "digital"
        ] | order(name asc) {
            ...,
            categories[]->
        }
    `)
  try {
    const products = await client.fetch(DIGITAL_PRODUCTS_QUERY)
    return products || []
  } catch (error) {
    console.error('Error fetching digital products:', error)
    return []
  }
}
