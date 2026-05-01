'use client'

import { SignInButton, useAuth } from '@clerk/nextjs'
import { Button } from '@ui/button'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { WorkshopCartData } from '../../store/store'
import useBasketStore from '../../store/store'

type Props = {
  workshop: WorkshopCartData
  isFull: boolean
}

export function BookWorkshopButton({ workshop, isFull }: Props) {
  const { isSignedIn } = useAuth()
  const addWorkshop = useBasketStore((state) => state.addWorkshop)
  const router = useRouter()

  const handleAddToCart = () => {
    if (!isSignedIn || isFull) return
    addWorkshop(workshop)
    router.push('/basket')
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
      onClick={handleAddToCart}
      disabled={isFull}
      size="2xl"
      className={buttonClass}
    >
      {isFull ? 'At Capacity' : 'Add to Basket'}
      {!isFull && <ShoppingBag className="ml-2 w-4 h-4" />}
    </Button>
  )
}
