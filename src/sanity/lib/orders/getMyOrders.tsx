import { defineQuery } from 'next-sanity'
import { client } from '../client'

export async function getMyOrders(userId: string) {
  if (!userId) {
    throw new Error('User ID is required')
  }
  const MY_ORDERS_QUERY = defineQuery(`
        *[_type == "order" && clerkUserId == $userId] | order(orderDate desc) {
            ...,
            products[] {
                ...,
                product->
            }
        }
    `)

  try {
    const orders = await client.fetch(MY_ORDERS_QUERY, { userId })
    return orders || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Error fetching orders')
  }
}
