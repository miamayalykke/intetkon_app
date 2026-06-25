import { defineQuery } from 'next-sanity'
import type { MY_ORDERS_QUERYResult } from '../../../../sanity.types'
import { backendClient } from '../backendClient'

export async function getMyOrders(
  userId: string,
  locale = 'en',
): Promise<MY_ORDERS_QUERYResult> {
  if (!userId) {
    throw new Error('User ID is required')
  }

  const MY_ORDERS_QUERY = defineQuery(`
    *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
      ...,
      products[] {
        ...,
        product->{
          _id,
          _type,
          "name": coalesce(name[language == $locale][0].value, name[language == "en"][0].value, name),
          "slug": coalesce(slug[$locale][0].value.current, slug[0].value.current, slug.current),
          price,
          productType,
          image,
          s3KeyEn,
          s3KeyDa,
        }
      },
      workshops[]->{
        _id,
        _type,
        "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value, title),
        "slug": coalesce(slug[$locale][0].value.current, slug[0].value.current, slug.current),
        price,
        date,
        location,
        image,
      }
    }
  `)

  try {
    const orders = await backendClient.fetch<MY_ORDERS_QUERYResult>(
      MY_ORDERS_QUERY,
      { userId, locale },
    )
    return orders || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Error fetching orders')
  }
}
