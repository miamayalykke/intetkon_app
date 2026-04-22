import { defineQuery } from 'next-sanity'
import { client } from '../client'

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_ID_QUERY = defineQuery(`
        *[
            _type== "product" &&slug.current == $slug
        ] | order(name asc)[0]
            `)

  try {
    const product = await client.fetch(PRODUCT_BY_ID_QUERY, { slug })
    return product || null
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }
}
