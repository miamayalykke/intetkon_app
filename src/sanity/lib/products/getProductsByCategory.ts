import { defineQuery } from 'next-sanity'
import { client } from '../client'

export const getProductByCategory = async (categorySlug: string) => {
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
        *[
        _type == "product"
        && references(*[_type == "category" && slug.current == $categorySlug]._id)
        ] | order(name asc)
        `)

  try {
    const products = await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { categorySlug })
    return products || []
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}
