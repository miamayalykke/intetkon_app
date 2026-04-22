'use client'

import { SignInButton, useAuth, useUser } from '@clerk/nextjs'
import { bookWorkshopSession } from '../../../../../actions/bookWorkshopSession'
import type { WorkshopBookingMetadata } from '../../../../../actions/bookWorkshopSession'
import { Button } from '@ui/button'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface Props {
  workshop: {
    _id: string
    title: string | null
    price: number | null
    image: object | null
  }
  isFull: boolean
}

const BookWorkshopButton = ({ workshop, isFull }: Props) => {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleBook = async () => {
    if (!isSignedIn || !user) return
    setIsLoading(true)
    try {
      const metadata: WorkshopBookingMetadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user.fullName ?? 'Unknown',
        customerEmail: user.emailAddresses[0].emailAddress ?? 'Unknown',
        clerkUserId: user.id,
        workshopId: workshop._id,
      }
      const url = await bookWorkshopSession(workshop, metadata)
      if (url) window.location.href = url
    } catch (err) {
      console.error('Error booking workshop:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFull) {
    return (
      <Button
        disabled
        size="2xl"
        className="w-full h-16 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed font-black uppercase tracking-widest"
      >
        At Capacity
      </Button>
    )
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button
          size="2xl"
          className="w-full h-16 rounded-full bg-secondary hover:bg-foreground text-white font-black uppercase tracking-widest transition-all"
        >
          Sign In to Book
        </Button>
      </SignInButton>
    )
  }

  return (
    <Button
      onClick={handleBook}
      disabled={isLoading}
      size="2xl"
      className="w-full h-16 rounded-full bg-orange-500 hover:bg-black text-white font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 group"
    >
      {isLoading ? 'Redirecting...' : 'Book Session'}
      {!isLoading && (
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      )}
    </Button>
  )
}

export default BookWorkshopButton
