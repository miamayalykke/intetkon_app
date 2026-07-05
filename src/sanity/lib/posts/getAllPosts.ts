import { defineQuery } from 'next-sanity'

import { client } from '../client'

export const getAllPosts = async () => {
  const ALL_POSTS_QUERY = defineQuery(`
    *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    }
  `)
  try {
    const posts = await client.fetch(ALL_POSTS_QUERY)
    return posts || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}
