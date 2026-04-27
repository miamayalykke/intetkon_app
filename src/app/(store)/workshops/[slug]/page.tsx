import { getWorkshopBySlug } from '@sanity/lib/workshops/getWorkshopBySlug'
import { imageUrl } from '@src/lib/imageUrl'
import { Button } from '@ui/button'
import { format } from 'date-fns'
import { ArrowLeft, ArrowRight, Clock, MapPin, Scissors, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

export const dynamic = 'force-static'
export const revalidate = 60

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-orange-100 text-orange-700 border-orange-200',
  Advanced: 'bg-red-100 text-red-700 border-red-200',
}

const WorkshopDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const workshop = await getWorkshopBySlug(slug)

  if (!workshop) notFound()

  const signUps = workshop.currentSignUps ?? 0
  const maxSpots = workshop.maxAllocation ?? 0
  const isFull = signUps >= maxSpots
  const spotsLeft = maxSpots - signUps
  const eventDate = new Date(workshop.date ?? '')
  const levelColor = LEVEL_COLORS[workshop.level ?? ''] ?? 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <main className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-6 pt-8">
        <Link
          href="/workshops"
          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-orange-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Studio Sessions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* --- Left: Image --- */}
          <div className="relative lg:sticky lg:top-24">
            <div className="absolute -top-4 -right-4 w-full h-full bg-orange-500/5 rounded-[3rem] rotate-2 border-2 border-dashed border-orange-500/20 -z-10" />
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-xl border-4 lg:border-8 border-white bg-card">
              {workshop.image ? (
                <Image
                  src={imageUrl(workshop.image).url()}
                  alt={workshop.title ?? 'Workshop image'}
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
              {workshop.level && (
                <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-widest border-2 shadow-lg -rotate-3 ${levelColor}`}>
                  {workshop.level}
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
                  Studio Session
                </p>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                  {workshop.title}
                </h1>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Clock className="w-3 h-3 text-secondary" /> {workshop.duration}
              </span>
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <MapPin className="w-3 h-3 text-secondary" /> {workshop.location}
              </span>
              <span className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-orange-500'}`}>
                <Users className="w-3 h-3" />
                {isFull ? 'Sold Out' : `${spotsLeft} Spots Remaining`}
              </span>
            </div>

            {/* Short description */}
            <p className="text-base text-muted-foreground font-light leading-relaxed italic border-l-2 border-orange-500/30 pl-4">
              {workshop.description}
            </p>

            {/* Rich body content */}
            {Array.isArray(workshop.body) && workshop.body.length > 0 && (
              <div className="prose prose-sm prose-orange max-w-none text-foreground leading-relaxed">
                <PortableText value={workshop.body} />
              </div>
            )}

            {/* Booking action */}
            <div className="pt-6 border-t border-border flex flex-col gap-4">
              <div className="text-4xl font-black tracking-tighter">
                {(workshop.price ?? 0).toFixed(2)} DKK
              </div>

              <Button
                disabled={isFull}
                size="2xl"
                className={`w-full h-16 rounded-full font-black uppercase tracking-widest transition-all
                  ${isFull
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-black hover:scale-105 shadow-lg shadow-orange-500/20'
                  }`}
              >
                {isFull ? 'At Capacity' : 'Book Session'}
                {!isFull && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>

              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
                Materials Included in Price
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
