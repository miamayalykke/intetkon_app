import { defineQuery } from 'next-sanity'
import { client } from '../client'

export const searchProductsByName = async (searchParam: string) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(`
        *[
        _type == "product"
        && name match $searchParam
        ] | order(name asc)
            `)

  try {
    const products = await client.fetch(PRODUCT_SEARCH_QUERY, {
      searchParam: `${searchParam}*`,
    })

    return products || []
  } catch (error) {
    console.error('Error fetching products by name:', error)
    return []
  }
}
