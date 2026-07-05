import { defineQuery } from 'next-sanity'

import { client } from '../client'

export const getPostBySlug = async (slug: string) => {
  const POST_BY_SLUG_QUERY = defineQuery(`
    *[
      _type == "post" &&
      publishedAt <= now() &&
      (slug[0].value.current == $slug || slug[1].value.current == $slug)
    ][0] {
      ...,
      _updatedAt
    }
  `)
  try {
    const post = await client.fetch(POST_BY_SLUG_QUERY, { slug })
    return post || null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}
