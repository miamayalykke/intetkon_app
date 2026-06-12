'use client'

import {
  createCheckoutSession,
  type Metadata,
} from '@actions/createCheckoutSession'
import { generateOrderNumber } from '@actions/generateOrderNumber'
import {
  type ItemForValidation,
  type PromoValidationResult,
  validatePromoCode,
} from '@actions/validatePromoCode'
import { SignInButton, useAuth, useUser } from '@clerk/nextjs'
import BasketItemControls from '@src/components/BasketItemControls'
import Loader from '@src/components/Loader'
import { imageUrl } from '@src/lib/imageUrl'
import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'
import useBasketStore from '@store/store'
import { Button } from '@ui/button'
import {
  ArrowRight,
  CheckCircle,
  Lock,
  ShoppingBag,
  Tag,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'

const BasketPage = () => {
  const t = useTranslations()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  const groupedItems = useBasketStore((state) => state.getGroupedItems())
  const getTotalPrice = useBasketStore((state) => state.getTotalPrice())
  const { isSignedIn, userId } = useAuth()
  const { user } = useUser()

  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<Extract<
    PromoValidationResult,
    { valid: true }
  > | null>(null)
  const appliedPromoCodeRef = useRef<string | null>(null)

  const [showGuestForm, setShowGuestForm] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestFormError, setGuestFormError] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Re-validate the applied promo whenever the cart changes
  useEffect(() => {
    if (!appliedPromoCodeRef.current) return

    const code = appliedPromoCodeRef.current
    const items: ItemForValidation[] = groupedItems.map((item) => ({
      id: item.data._id,
      itemType: item.itemType,
      quantity: item.quantity,
      price: item.data.price ?? 0,
      categoryIds:
        item.itemType === 'product'
          ? (item.data.categories ?? [])
              .map((c) => ('_ref' in c ? c._ref : ''))
              .filter(Boolean)
          : [],
    }))

    validatePromoCode(code, items).then((result) => {
      if (!result.valid) {
        setAppliedPromo(null)
        appliedPromoCodeRef.current = null
        setPromoError(result.message)
      }
    })
  }, [groupedItems])

  const { totalItems, totalPrice, discountedTotal } = useMemo(() => {
    const subtotal = getTotalPrice
    let discounted = subtotal
    if (appliedPromo) {
      discounted =
        appliedPromo.discountType === 'fixed'
          ? Math.max(0, subtotal - appliedPromo.discountAmount)
          : subtotal * (1 - appliedPromo.discountAmount / 100)
    }
    return {
      totalItems: groupedItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      totalPrice: subtotal.toFixed(2),
      discountedTotal: discounted.toFixed(2),
    }
  }, [groupedItems, getTotalPrice, appliedPromo])

  if (!isClient) return <Loader />

  if (groupedItems.length === 0) {
    return (
      <main className="container mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-10 h-10 text-secondary opacity-40" />
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 italic font-serif">
          {t('basket.emptyTitle')}
        </h1>
        <p className="text-muted-foreground max-w-sm mb-12 font-light italic">
          {t('basket.emptyMessage')}
        </p>
        <Link href={`/${locale}/patterns`}>
          <Button
            size="2xl"
            className="rounded-full px-12 bg-foreground hover:bg-orange-500 font-bold gap-4 transition-all hover:scale-105"
          >
            {t('basket.browsePatterns')} <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </main>
    )
  }

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    setPromoError(null)
    setAppliedPromo(null)

    const items: ItemForValidation[] = groupedItems.map((item) => ({
      id: item.data._id,
      itemType: item.itemType,
      quantity: item.quantity,
      price: item.data.price ?? 0,
      categoryIds:
        item.itemType === 'product'
          ? (item.data.categories ?? [])
              .map((c) => ('_ref' in c ? c._ref : ''))
              .filter(Boolean)
          : [],
    }))

    const result = await validatePromoCode(promoInput.trim(), items)

    if (result.valid) {
      setAppliedPromo(result)
      appliedPromoCodeRef.current = promoInput.trim()
    } else {
      setPromoError(result.message)
    }
    setPromoLoading(false)
  }

  const handleCheckout = async (email?: string, name?: string) => {
    setIsLoading(true)
    setCheckoutError(null)
    setGuestFormError(null)
    try {
      const orderNumber = await generateOrderNumber()
      const checkoutEmail = email || user?.emailAddresses[0].emailAddress || ''
      const checkoutName = name || user?.fullName || ''

      const metadata: Metadata = {
        orderNumber,
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        clerkUserId: userId ?? '',
      }
      const checkoutUrl = await createCheckoutSession(
        groupedItems,
        metadata,
        appliedPromo?.stripePromoCodeId,
        locale,
      )
      if (checkoutUrl) window.location.href = checkoutUrl
    } catch (error) {
      console.error('Error creating checkout session:', error)
      const msg = t('basket.checkoutError')
      setCheckoutError(msg)
      setGuestFormError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestCheckout = async () => {
    setGuestFormError(null)

    if (!guestEmail.trim() || !guestName.trim()) {
      setGuestFormError('Please enter both name and email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guestEmail)) {
      setGuestFormError('Please enter a valid email address')
      return
    }

    await handleCheckout(guestEmail.trim(), guestName.trim())
  }

  return (
    <main className="container mx-auto px-6 pt-24 pb-32 max-w-7xl">
      {/* --- Header Section --- */}
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 mb-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest -rotate-1 shadow-lg">
          <ShoppingBag className="w-3 h-3" /> {t('basket.headerTag')}
        </div>
        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
          {t('basket.title')}{' '}
          <span className="text-orange-500 italic font-serif">
            {t('basket.titleItalic')}
          </span>
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* --- Product List --- */}
        <section className="grow w-full space-y-8">
          {groupedItems.map((item) => {
            const id = item.data._id
            const name =
              item.itemType === 'product'
                ? (getLocalizedField<string>(item.data.name as any, locale) ??
                  'Unnamed Product')
                : (getLocalizedField<string>(item.data.title as any, locale) ??
                  'Workshop')
            const price = item.data.price ?? 0
            const image = item.data.image
            const rawSlug = item.data.slug
            const slugCurrent =
              typeof rawSlug === 'object' &&
              rawSlug !== null &&
              !Array.isArray(rawSlug)
                ? (rawSlug as any).current
                : (getLocalizedField<{ current: string }>(
                    rawSlug as any,
                    locale,
                  )?.current ?? '')
            const href =
              item.itemType === 'product'
                ? `/${locale}/product/${slugCurrent}`
                : `/${locale}/workshops/${slugCurrent}`
            const tag =
              item.itemType === 'workshop' ? t('basket.workshopTag') : null

            return (
              <div
                key={id}
                className="group relative flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border"
              >
                <Link
                  href={href}
                  className="relative w-full sm:w-40 aspect-square shrink-0 overflow-hidden rounded-4xl border border-border bg-muted transition-all group-hover:border-orange-500/50"
                >
                  {image && (
                    <Image
                      src={imageUrl(image).url()}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </Link>

                <div className="flex-1 flex flex-col justify-between h-full py-2">
                  <div className="space-y-1">
                    {tag && (
                      <p className="text-[9px] font-black uppercase tracking-widest text-orange-500">
                        {tag}
                      </p>
                    )}
                    <h2 className="text-2xl font-black tracking-tighter group-hover:text-orange-500 transition-colors">
                      {name}
                    </h2>
                    <p className="text-sm text-muted-foreground font-light uppercase tracking-widest">
                      {price.toFixed(2)} DKK {t('basket.perUnit')}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between sm:justify-start gap-8">
                    <div className="scale-110">
                      <BasketItemControls item={item} />
                    </div>
                    <p className="text-xl font-bold font-mono">
                      {(price * item.quantity).toFixed(2)} DKK
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* --- Order Summary --- */}
        <aside className="w-full lg:w-100 lg:sticky lg:top-24">
          <div className="relative p-10 bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="absolute -top-10 -right-10 text-secondary/5 -rotate-12 pointer-events-none">
              <ShoppingBag className="w-48 h-48" />
            </div>

            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />{' '}
              {t('basket.checkoutSummary')}
            </h3>

            {/* --- Promo Code Input --- */}
            <div className="mb-6">
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-bold">
                      {appliedPromo.label} {t('basket.applied')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPromo(null)
                      appliedPromoCodeRef.current = null
                      setPromoInput('')
                    }}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value)
                        setPromoError(null)
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      placeholder={t('basket.promoPlaceholder')}
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-bold tracking-widest border border-border rounded-2xl bg-background focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <Button
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    size="sm"
                    className="rounded-2xl bg-foreground hover:bg-orange-500 text-white font-bold px-4 transition-all"
                  >
                    {promoLoading ? '...' : t('basket.applyPromo')}
                  </Button>
                </div>
              )}
              {promoError && (
                <p className="mt-2 text-xs text-red-500 font-bold">
                  {promoError}
                </p>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-muted-foreground font-light">
                <span>{t('basket.totalItems')}</span>
                <span className="font-bold text-foreground">{totalItems}</span>
              </div>
              {appliedPromo && (
                <>
                  <div className="flex justify-between text-muted-foreground font-light">
                    <span>{t('basket.subtotal')}</span>
                    <span className="font-bold text-foreground">
                      {totalPrice} DKK
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>
                      {t('basket.discount')} ({appliedPromo.label})
                    </span>
                    <span>
                      -
                      {(Number(totalPrice) - Number(discountedTotal)).toFixed(
                        2,
                      )}{' '}
                      DKK
                    </span>
                  </div>
                </>
              )}
              {!appliedPromo && (
                <div className="flex justify-between text-muted-foreground font-light">
                  <span>{t('basket.shipping')}</span>
                  <span className="italic">
                    {t('basket.shippingCalculated')}
                  </span>
                </div>
              )}
              <div className="pt-6 border-t border-dashed border-border flex justify-between items-baseline">
                <span className="text-lg font-black uppercase tracking-tighter">
                  {t('basket.total')}
                </span>
                <span className="text-4xl font-black text-orange-500 tracking-tighter">
                  {appliedPromo ? discountedTotal : totalPrice} DKK
                </span>
              </div>
            </div>

            {isSignedIn ? (
              <div className="space-y-3">
                <Button
                  onClick={() => handleCheckout()}
                  disabled={isLoading}
                  size="4xl"
                  className="w-full rounded-full bg-foreground hover:bg-orange-500 text-white font-bold h-20 text-xl transition-all shadow-xl shadow-orange-500/10 group"
                >
                  {isLoading
                    ? t('basket.processing')
                    : t('basket.completePurchase')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                {checkoutError && (
                  <p className="text-sm text-red-500 font-bold text-center">
                    {checkoutError}
                  </p>
                )}
              </div>
            ) : showGuestForm ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block text-sm font-bold mb-2 uppercase tracking-widest"
                  >
                    {t('basket.fullName')}
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value)
                      setGuestFormError(null)
                    }}
                    placeholder={t('basket.namePlaceholder')}
                    className="w-full px-4 py-3 border border-border rounded-2xl bg-background focus:outline-none focus:border-orange-500 transition-colors font-bold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="guest-email"
                    className="block text-sm font-bold mb-2 uppercase tracking-widest"
                  >
                    {t('basket.emailAddress')}
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value)
                      setGuestFormError(null)
                    }}
                    placeholder={t('basket.emailPlaceholder')}
                    className="w-full px-4 py-3 border border-border rounded-2xl bg-background focus:outline-none focus:border-orange-500 transition-colors font-bold"
                  />
                </div>
                {guestFormError && (
                  <p className="text-sm text-red-500 font-bold">
                    {guestFormError}
                  </p>
                )}
                <Button
                  onClick={handleGuestCheckout}
                  disabled={isLoading}
                  size="4xl"
                  className="w-full rounded-full bg-foreground hover:bg-orange-500 text-white font-bold h-20 text-xl transition-all shadow-xl shadow-orange-500/10 group"
                >
                  {isLoading
                    ? t('basket.processing')
                    : t('basket.completePurchase')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button
                  type="button"
                  onClick={() => setShowGuestForm(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  {t('basket.back')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowGuestForm(true)}
                  size="4xl"
                  className="w-full rounded-full bg-foreground hover:bg-orange-500 text-white font-bold h-16 text-base transition-all"
                >
                  {t('basket.continueGuest')}
                </Button>
                <SignInButton mode="modal">
                  <Button
                    size="4xl"
                    className="w-full rounded-full bg-secondary hover:bg-foreground text-white font-black h-16 text-base transition-all"
                  >
                    {t('basket.signIn')}
                  </Button>
                </SignInButton>
              </div>
            )}

            <p className="mt-6 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              {t('basket.stripeText')}
            </p>
          </div>

          <div className="mt-8 p-6 text-center">
            <p className="text-xs text-muted-foreground font-light italic leading-relaxed">
              {t('basket.footerText')}{' '}
              <Link
                href={`/${locale}/return-policy`}
                className="underline hover:text-orange-500"
              >
                {t('basket.returnPolicy')}
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
