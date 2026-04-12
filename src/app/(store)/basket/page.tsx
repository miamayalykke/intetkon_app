'use client'

import { SignInButton, useAuth, useUser } from '@clerk/nextjs'
import BasketItemControls from '@src/components/BasketItemControls'
import Loader from '@src/components/Loader'
import { imageUrl } from '@src/lib/imageUrl'
import { Button } from '@ui/button'
import { ArrowRight, Lock, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  createCheckoutSession,
  type Metadata,
} from '../../../../actions/createCheckoutSession'
import useBasketStore from '../../../../store/store'

const BasketPage = () => {
  const groupedItems = useBasketStore((state) => state.getGroupedItems())
  const getTotalPrice = useBasketStore((state) => state.getTotalPrice())
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { totalItems, totalPrice } = useMemo(
    () => ({
      totalItems: groupedItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      totalPrice: getTotalPrice.toFixed(2),
    }),
    [groupedItems, getTotalPrice],
  )

  if (!isClient) return <Loader />

  if (groupedItems.length === 0) {
    return (
      <main className="container mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-10 h-10 text-secondary opacity-40" />
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 italic font-serif">
          Empty Atelier
        </h1>
        <p className="text-muted-foreground max-w-sm mb-12 font-light italic">
          Your basket is looking a bit light. Time to start your next sewing
          project.
        </p>
        <Link href="/patterns">
          <Button
            size="2xl"
            className="rounded-full px-12 bg-foreground hover:bg-orange-500 font-bold gap-4 transition-all hover:scale-105"
          >
            Browse Patterns <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </main>
    )
  }

  const handleCheckout = async () => {
    if (!isSignedIn) return
    setIsLoading(true)
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? 'Unknown',
        customerEmail: user?.emailAddresses[0].emailAddress ?? 'Unknown',
        clerkUserId: user?.id ?? '',
      }
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata)
      if (checkoutUrl) window.location.href = checkoutUrl
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
      {/* --- Header Section --- */}
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 mb-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest -rotate-1 shadow-lg">
          <ShoppingBag className="w-3 h-3" /> Review Your Gear
        </div>
        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
          YOUR <span className="text-orange-500 italic font-serif">BASKET</span>
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* --- Product List --- */}
        <section className="grow w-full space-y-8">
          {groupedItems.map((item) => (
            <div
              key={item.product._id}
              className="group relative flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border"
            >
              <Link
                href={`/product/${item.product.slug?.current}`}
                className="relative w-full sm:w-40 aspect-square shrink-0 overflow-hidden rounded-4xl border border-border bg-muted transition-all group-hover:border-orange-500/50"
              >
                {item.product.image && (
                  <Image
                    src={imageUrl(item.product.image).url()}
                    alt={item.product.name ?? 'Product'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </Link>

              <div className="flex-1 flex flex-col justify-between h-full py-2">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tighter group-hover:text-orange-500 transition-colors">
                    {item.product.name}
                  </h2>
                  <p className="text-sm text-muted-foreground font-light uppercase tracking-widest">
                    {item.product.price?.toFixed(2)} DKK per unit
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between sm:justify-start gap-8">
                  <div className="scale-110">
                    <BasketItemControls product={item.product} />
                  </div>
                  <p className="text-xl font-bold font-mono">
                    {((item.product.price ?? 0) * item.quantity).toFixed(2)} DKK
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* --- Order Summary --- */}
        <aside className="w-full lg:w-100 lg:sticky lg:top-24">
          <div className="relative p-10 bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -top-10 -right-10 text-secondary/5 -rotate-12 pointer-events-none">
              <ShoppingBag className="w-48 h-48" />
            </div>

            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" /> Checkout Summary
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-muted-foreground font-light">
                <span>Total Items</span>
                <span className="font-bold text-foreground">{totalItems}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-light">
                <span>Shipping</span>
                <span className="italic">Calculated at next step</span>
              </div>
              <div className="pt-6 border-t border-dashed border-border flex justify-between items-baseline">
                <span className="text-lg font-black uppercase tracking-tighter">
                  Total
                </span>
                <span className="text-4xl font-black text-orange-500 tracking-tighter">
                  {totalPrice} DKK
                </span>
              </div>
            </div>

            {isSignedIn ? (
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                size="4xl"
                className="w-full rounded-full bg-foreground hover:bg-orange-500 text-white font-bold h-20 text-xl transition-all shadow-xl shadow-orange-500/10 group"
              >
                {isLoading ? 'Processing...' : 'Complete Purchase'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full rounded-full bg-secondary hover:bg-foreground text-white font-black h-20 text-xl transition-all">
                  Sign In to Pay
                </Button>
              </SignInButton>
            )}

            <p className="mt-6 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Secure checkout powered by Stripe
            </p>
          </div>

          <div className="mt-8 p-6 text-center">
            <p className="text-xs text-muted-foreground font-light italic leading-relaxed">
              By purchasing, you support gender-neutral design and local Danish
              craft. Read our{' '}
              <Link href="/returns" className="underline hover:text-orange-500">
                Return Policy
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default BasketPage
