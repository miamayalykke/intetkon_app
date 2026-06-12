'use client'

import { Button } from '@ui/button'
import { ShoppingBag } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import type { WorkshopCartData } from '../../store/store'
import useBasketStore from '../../store/store'

type Props = {
  workshop: WorkshopCartData
  isFull: boolean
}

export function BookWorkshopButton({ workshop, isFull }: Props) {
  const addWorkshop = useBasketStore((state) => state.addWorkshop)
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()

  const handleAddToCart = () => {
    if (isFull) return
    addWorkshop(workshop)
    router.push(`/${locale}/basket`)
  }

  const buttonClass = `w-full h-16 rounded-full font-black uppercase tracking-widest transition-all ${
    isFull
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-orange-500 text-white hover:bg-black hover:scale-105 shadow-lg shadow-orange-500/20'
  }`

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isFull}
      size="2xl"
      className={buttonClass}
    >
      {isFull ? t('workshops.card.atCapacity') : t('products.addToBasket')}
      {!isFull && <ShoppingBag className="ml-2 w-4 h-4" />}
    </Button>
  )
}
