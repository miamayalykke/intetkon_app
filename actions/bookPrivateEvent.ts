'use server'

import 'server-only'
import { backendClient } from '@sanity/lib/backendClient'
import stripe from '@src/lib/stripe'
import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'
import { generateOrderNumber } from './generateOrderNumber'

export type BookPrivateEventInput = {
  slotId: string
  groupSize: number
  occasion: string
  projectWish?: string
  addonQuantities: Record<string, number>
  customerName: string
  customerEmail: string
  locale?: string
}

export type BookPrivateEventResult =
  | { success: true; checkoutUrl: string }
  | { success: false; message: string }

type SlotDoc = {
  _id: string
  date: string
  endDate?: string
  minGroupSize: number
  maxGroupSize: number
  pricingMode: 'perPerson' | 'total'
  price: number
}

type AddonDoc = {
  _id: string
  title: unknown
  price: number
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function bookPrivateEvent(
  input: BookPrivateEventInput,
): Promise<BookPrivateEventResult> {
  const locale = input.locale === 'da' ? 'da' : 'en'
  const customerName = input.customerName?.trim()
  const customerEmail = input.customerEmail?.trim()
  const groupSize = Math.floor(Number(input.groupSize))

  if (!customerName || !customerEmail || !EMAIL_REGEX.test(customerEmail)) {
    return {
      success: false,
      message:
        locale === 'da'
          ? 'Udfyld venligst navn og en gyldig e-mailadresse'
          : 'Please enter your name and a valid email address',
    }
  }

  try {
    // Re-fetch the slot server-side: it must still be available and in the future
    const slot = await backendClient.fetch<SlotDoc | null>(
      `*[_type == "privateEventSlot" && _id == $id && status == "available" && date >= now()][0] {
        _id, date, endDate, minGroupSize, maxGroupSize, pricingMode, price
      }`,
      { id: input.slotId },
    )

    if (!slot) {
      return {
        success: false,
        message:
          locale === 'da'
            ? 'Denne dato er desværre ikke længere ledig. Vælg en anden dato eller send en forespørgsel.'
            : 'This date is unfortunately no longer available. Pick another date or send a request.',
      }
    }

    if (
      !Number.isFinite(groupSize) ||
      groupSize < slot.minGroupSize ||
      groupSize > slot.maxGroupSize
    ) {
      return {
        success: false,
        message:
          locale === 'da'
            ? `Gruppestørrelsen skal være mellem ${slot.minGroupSize} og ${slot.maxGroupSize} personer`
            : `Group size must be between ${slot.minGroupSize} and ${slot.maxGroupSize} people`,
      }
    }

    // Prices always come from Sanity, never from the client
    const requestedAddonIds = Object.entries(input.addonQuantities ?? {})
      .filter(([, qty]) => Number(qty) > 0)
      .map(([id]) => id)
    const addons =
      requestedAddonIds.length > 0
        ? await backendClient.fetch<AddonDoc[]>(
            `*[_type == "privateEventAddon" && _id in $ids && active == true] {
              _id, title, price
            }`,
            { ids: requestedAddonIds },
          )
        : []

    const dateLabel = new Date(slot.date).toLocaleDateString(
      locale === 'da' ? 'da-DK' : 'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric' },
    )

    const eventName =
      locale === 'da'
        ? `Book ateliéret – ${dateLabel}`
        : `Private atelier event – ${dateLabel}`

    const lineItems: Array<{
      price_data: {
        currency: string
        product_data: { name: string }
        unit_amount: number
      }
      quantity: number
    }> = [
      {
        price_data: {
          currency: 'dkk',
          product_data: { name: eventName },
          unit_amount: Math.round(slot.price * 100),
        },
        quantity: slot.pricingMode === 'total' ? 1 : groupSize,
      },
    ]

    const addonSummaryParts: string[] = []
    for (const addon of addons ?? []) {
      const qty = Math.min(
        Math.max(Math.floor(Number(input.addonQuantities[addon._id])), 0),
        20,
      )
      if (qty <= 0) continue
      const title =
        getLocalizedField<string>(addon.title as never, locale) ?? 'Add-on'
      // Add-ons are always charged per person, on top of the event price
      const quantity = qty * groupSize
      lineItems.push({
        price_data: {
          currency: 'dkk',
          product_data: { name: title },
          unit_amount: Math.round(addon.price * 100),
        },
        quantity,
      })
      addonSummaryParts.push(`${quantity}× ${title}`)
    }

    const orderNumber = await generateOrderNumber()

    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })
    const customerId = customers.data[0]?.id

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? customerEmail : undefined,
      metadata: {
        orderNumber,
        customerName,
        customerEmail,
        clerkUserId: '',
        locale,
        privateEventSlotId: slot._id,
        privateEventGroupSize: String(groupSize),
        privateEventOccasion: (input.occasion ?? '').slice(0, 100),
        privateEventProjectWish: (input.projectWish ?? '').slice(0, 400),
        privateEventAddons: addonSummaryParts.join(', ').slice(0, 400),
      },
      locale: locale === 'da' ? 'da' : 'en',
      mode: 'payment',
      payment_method_configuration: 'pmc_1SDjXTJoZ0voIfvhegmhzz3s',
      success_url: `${baseUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${orderNumber}`,
      cancel_url: `${baseUrl}/${locale}/book-atelieret`,
      line_items: lineItems,
    })

    if (!session.url) {
      return {
        success: false,
        message:
          locale === 'da'
            ? 'Kunne ikke starte betalingen. Prøv igen.'
            : 'Could not start the payment. Please try again.',
      }
    }

    return { success: true, checkoutUrl: session.url }
  } catch (error) {
    console.error('Error booking private event:', error)
    return {
      success: false,
      message:
        locale === 'da'
          ? 'Noget gik galt. Prøv igen eller kontakt os.'
          : 'Something went wrong. Please try again or contact us.',
    }
  }
}
