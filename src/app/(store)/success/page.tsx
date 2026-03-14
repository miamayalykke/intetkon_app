'use client'

import { Button } from '@ui/button'
import { ArrowRight, Check, Heart, Scissors, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useBasketStore from '../../../../store/store'

function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('orderNumber')
  const clearBasket = useBasketStore((state) => state.clearBasket)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (!orderNumber) {
      router.replace('/basket')
      return
    }
    clearBasket()
    setIsHydrated(true)
  }, [orderNumber, clearBasket, router])

  if (!orderNumber || !isHydrated) return null

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col justify-between">
      <div className="pt-8 text-center opacity-40">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-border bg-card/50 text-[9px] font-black uppercase tracking-[0.3em]">
          <Sparkles className="w-3 h-3 text-orange-500" /> Payment Verified
        </div>
      </div>

      <section className="relative grow flex flex-col items-center justify-center px-6 text-center">
        <svg
          className="absolute inset-0 w-full h-full -z-10 opacity-10 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <title>threads</title>
          <path
            d="M-10,30 Q30,20 60,35 T110,30"
            fill="none"
            stroke="#f97316"
            strokeWidth="0.05"
          />
          <path
            d="M-10,70 Q40,80 70,60 T110,70"
            fill="none"
            stroke="#22c55e"
            strokeWidth="0.05"
          />
        </svg>

        <div className="max-w-4xl w-full">
          {/* Floating Sticker (Smaller) */}
          <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] shadow-lg -rotate-2 border-2 border-white mb-6">
            Confirmed
          </div>

          <h1 className="text-6xl lg:text-[7rem] font-black text-foreground tracking-tighter leading-[0.8] mb-6">
            THANK <br />
            <span className="text-secondary italic font-serif">YOU!</span>
          </h1>

          <p className="max-w-lg mx-auto text-lg text-muted-foreground font-light leading-relaxed italic mb-8">
            &ldquo;Your order is being prepped in our studio. Check your inbox
            for the digital receipt.&rdquo;
          </p>

          {/* Condensed Order Card */}
          <div className="relative inline-block group mb-10">
            <div className="absolute -top-3 -right-3 w-full h-full bg-orange-500/5 rounded-3xl rotate-2 border border-dashed border-orange-500/20 -z-10" />
            <div className="relative bg-card border border-border py-4 px-10 rounded-3xl shadow-lg flex items-center gap-6">
              <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                <Check className="h-5 w-5 stroke-[3px]" />
              </div>
              <div className="text-left">
                <p className="text-[8px] uppercase font-black tracking-widest text-muted-foreground leading-none mb-1">
                  Order Ref
                </p>
                <p className="font-mono text-base text-orange-500 font-bold tracking-tighter">
                  {orderNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app/orders">
              <Button
                size="lg"
                className="bg-foreground text-white hover:bg-orange-500 font-bold px-10 h-14 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                My Orders
              </Button>
            </Link>
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-foreground/20 font-bold px-10 h-14 rounded-full transition-all hover:scale-105"
              >
                Back to Shop
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- Marquee Footer (Fixed at Bottom) --- */}
      <footer className="relative w-full overflow-hidden py-6 bg-foreground -rotate-1 bottom-10 translate-y-2">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-white text-[9px] font-black uppercase tracking-[0.4em] mx-10 flex items-center gap-4"
            >
              Intetkøn Family{' '}
              <Heart className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
              Sustainable Craft <Sparkles className="w-2.5 h-2.5" />
              Genderless Future <Scissors className="w-2.5 h-2.5" />
            </span>
          ))}
        </div>
      </footer>
    </main>
  )
}

export default SuccessPage
