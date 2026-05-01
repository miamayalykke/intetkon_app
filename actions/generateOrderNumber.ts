'use server'
import { backendClient } from '@src/sanity/lib/backendClient'

export async function generateOrderNumber(): Promise<string> {
  while (true) {
    const candidate = Math.floor(100000 + Math.random() * 900000).toString()
    const existing = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $num][0]._id`,
      { num: candidate },
    )
    if (!existing) return candidate
  }
}
