'use client'

import { SignInButton, useAuth, useUser } from '@clerk/nextjs'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Button } from '@ui/button'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import {
  createWorkshopCheckoutSession,
  type WorkshopCheckoutMetadata,
} from '../../actions/createWorkshopCheckoutSession'

type Props = {
  workshop: {
    _id: string
    title: string | null
    price: number | null
    slug: { current: string } | null
    image?: SanityImageSource
    date?: string | null
    location?: string | null
    duration?: string | null
  }
  isFull: boolean
}

export function BookWorkshopButton({ workshop, isFull }: Props) {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleBooking = async () => {
    if (!isSignedIn || isFull) return
    setIsLoading(true)
    try {
      const metadata: WorkshopCheckoutMetadata = {
        checkoutType: 'workshop',
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? 'Unknown',
        customerEmail: user?.emailAddresses[0].emailAddress ?? 'Unknown',
        clerkUserId: user?.id ?? '',
        workshopId: workshop._id,
        workshopTitle: workshop.title ?? 'Workshop',
        workshopDate: workshop.date ?? '',
        workshopLocation: workshop.location ?? '',
        workshopDuration: workshop.duration ?? '',
        workshopSlug: workshop.slug?.current ?? '',
      }
      const checkoutUrl = await createWorkshopCheckoutSession(workshop, metadata)
      if (checkoutUrl) window.location.href = checkoutUrl
    } catch (error) {
      console.error('Error creating workshop checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const buttonClass = `w-full h-16 rounded-full font-black uppercase tracking-widest transition-all ${
    isFull
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-orange-500 text-white hover:bg-black hover:scale-105 shadow-lg shadow-orange-500/20'
  }`

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button size="2xl" disabled={isFull} className={buttonClass}>
          {isFull ? 'At Capacity' : 'Sign In to Book'}
          {!isFull && <ArrowRight className="ml-2 w-4 h-4" />}
        </Button>
      </SignInButton>
    )
  }

  return (
    <Button
      onClick={handleBooking}
      disabled={isFull || isLoading}
      size="2xl"
      className={buttonClass}
    >
      {isLoading ? 'Processing...' : isFull ? 'At Capacity' : 'Book Session'}
      {!isFull && !isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
    </Button>
  )
}
