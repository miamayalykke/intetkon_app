import { getWorkshopBySlug } from '@sanity/lib/workshops/getWorkshopBySlug'
import { BookWorkshopButton } from '@src/components/BookWorkshopButton'
import { imageUrl } from '@src/lib/imageUrl'
import { getLocalizedSlug } from '@src/lib/slug-helpers'
import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'
import { addMinutes, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { ArrowLeft, Clock, MapPin, Scissors, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PortableText } from 'next-sanity'

export const revalidate = 60

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-orange-100 text-orange-700 border-orange-200',
  Advanced: 'bg-red-100 text-red-700 border-red-200',
}

const TIMEZONE = 'Europe/Copenhagen'

const WorkshopDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) => {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  const workshop = await getWorkshopBySlug(slug)

  if (!workshop) notFound()

  const correctSlug = getLocalizedSlug(workshop.slug, locale)
  if (correctSlug && correctSlug !== slug) {
    redirect(`/${locale}/workshops/${correctSlug}`)
  }

  const title = getLocalizedField(workshop.title, locale)
  const body = getLocalizedField(workshop.body, locale)
  const levelDisplay = workshop.level
    ? t(`workshops.levels.${workshop.level}`)
    : null

  const signUps = workshop.currentSignUps ?? 0
  const maxSpots = workshop.maxAllocation ?? 0
  const isFull = signUps >= maxSpots
  const spotsLeft = maxSpots - signUps
  const utcDate = new Date(workshop.date ?? '')
  const eventDate = toZonedTime(utcDate, TIMEZONE)
  const levelColor =
    LEVEL_COLORS[workshop.level ?? ''] ??
    'bg-gray-100 text-gray-700 border-gray-200'

  const parseLegacyDuration = (d: string | null | undefined): number => {
    if (!d) return 0
    const m = d.match(/(\d+\.?\d*)\s*(?:hour|hr)/i)
    return m ? Math.round(parseFloat(m[1]) * 60) : 0
  }
  const endDate = workshop.endDate
    ? toZonedTime(new Date(workshop.endDate), TIMEZONE)
    : workshop.duration
      ? addMinutes(eventDate, parseLegacyDuration(workshop.duration))
      : null
  const timeRange = endDate
    ? t('workshops.detail.timeRange', {
        start: format(eventDate, 'HH:mm'),
        end: format(endDate, 'HH:mm'),
      })
    : format(eventDate, 'HH:mm')

  return (
    <main className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-6 pt-8">
        <Link
          href={`/${locale}/workshops`}
          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-orange-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          {t('workshops.detail.backToSessions')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* --- Left: Image --- */}
          <div className="relative lg:sticky lg:top-24">
            <div className="absolute -top-4 -right-4 w-full h-full bg-orange-500/5 rounded-[3rem] rotate-2 border-2 border-dashed border-orange-500/20 -z-10" />
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-xl border-4 lg:border-8 border-white bg-card">
              {workshop.image ? (
                <Image
                  src={imageUrl(workshop.image).url()}
                  alt={title ?? 'Workshop image'}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card">
                  <Scissors className="w-24 h-24 text-border" />
                </div>
              )}

              {/* Level badge */}
              {levelDisplay && (
                <div
                  className={`absolute top-4 right-4 px-4 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-widest border-2 shadow-lg -rotate-3 ${levelColor}`}
                >
                  {levelDisplay}
                </div>
              )}
            </div>
          </div>

          {/* --- Right: Details --- */}
          <div className="flex flex-col gap-8">
            {/* Date badge */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center bg-card border-2 border-border rounded-3xl p-4 w-20 shrink-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">
                  {format(eventDate, 'MMM')}
                </span>
                <span className="text-4xl font-black tracking-tighter leading-none">
                  {format(eventDate, 'dd')}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {format(eventDate, 'yyyy')}
                </span>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">
                  {t('workshops.detail.studioSession')}
                </p>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                  {title}
                </h1>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Clock className="w-3 h-3 text-secondary" /> {timeRange}
              </span>
              {workshop.location === 'studio' && (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <MapPin className="w-3 h-3 text-secondary" /> Bentzonzvej 50b,
                  2000 Frederiksberg
                </span>
              )}
              {workshop.location === 'online' && (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <MapPin className="w-3 h-3 text-secondary" />{' '}
                  {t('workshops.detail.online')}
                </span>
              )}
              <span
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-orange-500'}`}
              >
                <Users className="w-3 h-3" />
                {isFull
                  ? t('workshops.detail.soldOut')
                  : t('workshops.detail.spotsRemaining', { count: spotsLeft })}
              </span>
            </div>

            {/* Rich body content */}
            {Array.isArray(body) && body.length > 0 && (
              <div className="prose prose-sm prose-orange max-w-none text-foreground leading-relaxed">
                <PortableText
                  value={body.filter((b: any) => b?._type !== undefined)}
                />
              </div>
            )}

            {/* Booking action */}
            <div className="pt-6 border-t border-border flex flex-col gap-4">
              <div className="text-4xl font-black tracking-tighter">
                {(workshop.price ?? 0).toFixed(2)} DKK
              </div>

              <BookWorkshopButton workshop={workshop} isFull={isFull} />

              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
                {t('workshops.detail.materialsIncluded')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decor */}
      <div className="absolute top-1/2 right-0 -z-10 opacity-5 pointer-events-none translate-x-1/2">
        <Scissors className="w-80 h-80 -rotate-12 text-secondary" />
      </div>
    </main>
  )
}

export default WorkshopDetailPage

export async function generateStaticParams() {
  const { client } = await import('@src/sanity/lib/client')
  const { getLocalizedSlug } = await import('@src/lib/slug-helpers')

  const WORKSHOPS_QUERY = `*[_type == "workshop"] { slug }`
  const workshops = await client.fetch(WORKSHOPS_QUERY)

  const params: Array<{ locale: string; slug: string }> = []

  for (const workshop of workshops) {
    const enSlug = getLocalizedSlug(workshop.slug, 'en')
    const daSlug = getLocalizedSlug(workshop.slug, 'da')

    if (enSlug) {
      params.push({ locale: 'en', slug: enSlug })
    }
    if (daSlug) {
      params.push({ locale: 'da', slug: daSlug })
    }
  }

  return params
}
