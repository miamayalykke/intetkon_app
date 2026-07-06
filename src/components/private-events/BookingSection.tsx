'use client'

import { bookPrivateEvent } from '@actions/bookPrivateEvent'
import { submitPrivateEventRequest } from '@actions/submitPrivateEventRequest'
import type { PrivateEventSlot } from '@sanity/lib/privateEvents/getPrivateEventData'
import { Button } from '@ui/button'
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Mail,
  Minus,
  Plus,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

interface SerializedAddon {
  _id: string
  title: string
  price: number
}

interface BookingSectionProps {
  slots: PrivateEventSlot[]
  addons: SerializedAddon[]
  locale: string
}

const OCCASIONS = ['polterabend', 'birthday', 'corporate', 'other'] as const

const inputClass =
  'w-full px-4 py-2.5 text-sm border border-border rounded-2xl bg-background focus:outline-none focus:border-orange-500 transition-colors'

const BookingSection = ({ slots, addons, locale }: BookingSectionProps) => {
  const t = useTranslations('privateEvents')
  const dateLocale = locale === 'da' ? 'da-DK' : 'en-GB'

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const selectedSlot = slots.find((s) => s._id === selectedSlotId) ?? null

  const [groupSize, setGroupSize] = useState<number>(4)
  const [occasion, setOccasion] = useState<string>('polterabend')
  const [projectWish, setProjectWish] = useState('')
  const [addonQty, setAddonQty] = useState<Record<string, number>>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)

  const total = useMemo(() => {
    if (!selectedSlot) return 0
    let sum =
      selectedSlot.pricingMode === 'total'
        ? selectedSlot.price
        : selectedSlot.price * groupSize
    // Add-ons are always charged per person, on top of the event price
    for (const addon of addons) {
      const qty = addonQty[addon._id] ?? 0
      if (qty <= 0) continue
      sum += addon.price * qty * groupSize
    }
    return sum
  }, [selectedSlot, groupSize, addonQty, addons])

  const selectSlot = (slot: PrivateEventSlot) => {
    setSelectedSlotId(slot._id)
    setGroupSize((current) =>
      Math.min(Math.max(current, slot.minGroupSize), slot.maxGroupSize),
    )
    setBookingError(null)
  }

  const changeAddonQty = (id: string, delta: number) => {
    setAddonQty((prev) => ({
      ...prev,
      [id]: Math.min(Math.max((prev[id] ?? 0) + delta, 0), 20),
    }))
  }

  const handleBook = async () => {
    if (!selectedSlot) return
    setBookingLoading(true)
    setBookingError(null)
    try {
      const result = await bookPrivateEvent({
        slotId: selectedSlot._id,
        groupSize,
        occasion,
        projectWish,
        addonQuantities: addonQty,
        customerName: name,
        customerEmail: email,
        locale,
      })
      if (result.success) {
        window.location.href = result.checkoutUrl
      } else {
        setBookingError(result.message)
      }
    } catch {
      setBookingError(t('genericError'))
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="space-y-20">
      {/* --- Step 1: pick a date --- */}
      <section>
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-orange-500" />
          {t('chooseDate')}
        </h2>

        {slots.length === 0 ? (
          <p className="text-muted-foreground italic font-light border-l-2 border-orange-500/30 pl-4">
            {t('noSlots')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => {
              const start = new Date(slot.date)
              const selected = slot._id === selectedSlotId
              return (
                <button
                  key={slot._id}
                  type="button"
                  onClick={() => selectSlot(slot)}
                  className={`text-left p-6 rounded-4xl border-2 transition-all ${
                    selected
                      ? 'border-orange-500 bg-orange-500/5 shadow-lg'
                      : 'border-border bg-card hover:border-orange-500/50'
                  }`}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">
                    {start.toLocaleDateString(dateLocale, { weekday: 'long' })}
                  </p>
                  <p className="text-2xl font-black tracking-tighter mb-2">
                    {start.toLocaleDateString(dateLocale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {start.toLocaleTimeString(dateLocale, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {slot.endDate &&
                      ` – ${new Date(slot.endDate).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                  <p className="mt-3 text-sm font-bold">
                    {slot.price} DKK{' '}
                    <span className="text-muted-foreground font-light">
                      {slot.pricingMode === 'total'
                        ? t('priceTotal')
                        : t('perPerson')}
                    </span>
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* --- Step 2: booking form --- */}
      {selectedSlot && (
        <section className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-6">
            {t('bookingFormTitle')}
          </h2>
          <div className="p-8 bg-card border border-border rounded-[3rem] shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="pe-name"
                  className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                >
                  {t('name')}
                </label>
                <input
                  id="pe-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="pe-email"
                  className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                >
                  {t('email')}
                </label>
                <input
                  id="pe-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="pe-groupsize"
                  className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                >
                  {t('groupSize')}
                </label>
                <select
                  id="pe-groupsize"
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  className={inputClass}
                >
                  {Array.from(
                    {
                      length:
                        selectedSlot.maxGroupSize -
                        selectedSlot.minGroupSize +
                        1,
                    },
                    (_, i) => selectedSlot.minGroupSize + i,
                  ).map((n) => (
                    <option key={n} value={n}>
                      {n} {t('people')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="pe-occasion"
                  className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
                >
                  {t('occasion')}
                </label>
                <select
                  id="pe-occasion"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className={inputClass}
                >
                  {OCCASIONS.map((value) => (
                    <option key={value} value={value}>
                      {t(`occasions.${value}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="pe-project"
                className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
              >
                {t('projectWish')}
              </label>
              <textarea
                id="pe-project"
                value={projectWish}
                onChange={(e) => setProjectWish(e.target.value)}
                placeholder={t('projectWishPlaceholder')}
                rows={3}
                className={inputClass}
              />
            </div>

            {addons.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                  {t('addons')}
                </p>
                <div className="space-y-3">
                  {addons.map((addon) => {
                    const qty = addonQty[addon._id] ?? 0
                    return (
                      <div
                        key={addon._id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-bold">{addon.title}</p>
                          <p className="text-xs text-muted-foreground font-light">
                            {addon.price} DKK {t('perPerson')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => changeAddonQty(addon._id, -1)}
                            disabled={qty === 0}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-orange-500 disabled:opacity-30 transition-colors"
                            aria-label={`${t('remove')} ${addon.title}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold font-mono">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeAddonQty(addon._id, 1)}
                            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-orange-500 transition-colors"
                            aria-label={`${t('add')} ${addon.title}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-dashed border-border flex justify-between items-baseline">
              <span className="text-lg font-black uppercase tracking-tighter">
                {t('total')}
              </span>
              <span className="text-4xl font-black text-orange-500 tracking-tighter">
                {total.toFixed(2)} DKK
              </span>
            </div>

            {bookingError && (
              <p className="text-sm text-red-500 font-bold">{bookingError}</p>
            )}

            <Button
              onClick={handleBook}
              disabled={bookingLoading || !name.trim() || !email.trim()}
              size="lg"
              className="w-full rounded-full bg-foreground hover:bg-orange-500 font-bold text-white transition-all"
            >
              {bookingLoading ? t('processing') : t('payNow')}
            </Button>
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest text-center">
              {t('securePayment')}
            </p>
          </div>
        </section>
      )}

      {/* --- Request another date --- */}
      <RequestForm locale={locale} />
    </div>
  )
}

const RequestForm = ({ locale }: { locale: string }) => {
  const t = useTranslations('privateEvents')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredDates, setPreferredDates] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [occasion, setOccasion] = useState('polterabend')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await submitPrivateEventRequest({
        name,
        email,
        phone,
        preferredDates,
        groupSize: groupSize ? Number(groupSize) : undefined,
        occasion,
        message,
        locale,
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.message)
      }
    } catch {
      setError(t('genericError'))
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="max-w-2xl">
        <div className="p-8 bg-green-50 border border-green-200 rounded-[3rem] flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-black tracking-tighter mb-1">
              {t('requestSuccessTitle')}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              {t('requestSuccessMessage')}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-2xl">
      <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
        <Mail className="w-6 h-6 text-orange-500" />
        {t('requestTitle')}
      </h2>
      <p className="text-muted-foreground font-light italic mb-6">
        {t('requestIntro')}
      </p>

      <div className="p-8 bg-card border border-border rounded-[3rem] shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="req-name"
              className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
            >
              {t('name')}
            </label>
            <input
              id="req-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="req-email"
              className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
            >
              {t('email')}
            </label>
            <input
              id="req-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="req-phone"
              className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
            >
              {t('phone')}
            </label>
            <input
              id="req-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="req-groupsize"
              className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
            >
              {t('groupSize')}
            </label>
            <input
              id="req-groupsize"
              type="number"
              min={1}
              max={10}
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="req-dates"
              className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
            >
              {t('preferredDates')}
            </label>
            <input
              id="req-dates"
              type="text"
              value={preferredDates}
              onChange={(e) => setPreferredDates(e.target.value)}
              placeholder={t('preferredDatesPlaceholder')}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="req-occasion"
              className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
            >
              {t('occasion')}
            </label>
            <select
              id="req-occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className={inputClass}
            >
              {OCCASIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`occasions.${value}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="req-message"
            className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2"
          >
            {t('message')}
          </label>
          <textarea
            id="req-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

        <Button
          onClick={handleSubmit}
          disabled={
            loading || !name.trim() || !email.trim() || !preferredDates.trim()
          }
          size="lg"
          className="w-full rounded-full bg-foreground hover:bg-orange-500 font-bold text-white transition-all"
        >
          {loading ? t('processing') : t('requestSubmit')}
        </Button>
      </div>
    </section>
  )
}

export default BookingSection
