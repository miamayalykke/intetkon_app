import { imageUrl } from '@src/lib/imageUrl'
import { getWorkshopBySlug } from '@src/sanity/lib/workshops/getWorkshopBySlug'
import { format } from 'date-fns'
import { ArrowLeft, Clock, MapPin, Scissors, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BookWorkshopButton from './BookWorkshopButton'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WorkshopDetailPage({ params }: Props) {
  const { slug } = await params
  const workshop = await getWorkshopBySlug(slug)

  if (!workshop) notFound()

  const signUps = workshop.currentSignUps ?? 0
  const maxSpots = workshop.maxAllocation ?? 0
  const isFull = signUps >= maxSpots
  const spotsLeft = maxSpots - signUps
  const eventDate = new Date(workshop.date ?? '')

  return (
    <main className="container mx-auto px-6 pt-24 pb-32 max-w-5xl">
      {/* Back link */}
      <Link
        href="/workshops"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors mb-12 font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> All Workshops
      </Link>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left: Image */}
        <div className="relative aspect-[4/5] rounded-4xl overflow-hidden border border-border shadow-2xl">
          {workshop.image ? (
            <Image
              src={imageUrl(workshop.image).url()}
              alt={workshop.title ?? 'Workshop'}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
              <Scissors className="w-24 h-24 text-secondary opacity-20" />
            </div>
          )}

          {/* Date badge */}
          <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-3xl px-5 py-4 text-center shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
              {format(eventDate, 'MMM')}
            </p>
            <p className="text-4xl font-black tracking-tighter leading-none">
              {format(eventDate, 'dd')}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {format(eventDate, 'yyyy')}
            </p>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-8 py-4">
          {/* Level badge */}
          <div className="inline-flex">
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {workshop.level}
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none uppercase">
            {workshop.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-6">
            <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <Clock className="w-4 h-4 text-secondary" /> {workshop.duration}
            </span>
            <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <MapPin className="w-4 h-4 text-secondary" /> {workshop.location}
            </span>
            <span
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-orange-500'}`}
            >
              <Users className="w-4 h-4" />
              {isFull ? 'Sold Out' : `${spotsLeft} Spots Remaining`}
            </span>
          </div>

          {/* Time */}
          <p className="text-sm text-muted-foreground font-light uppercase tracking-widest">
            {format(eventDate, 'EEEE, d MMMM yyyy')} at{' '}
            {format(eventDate, 'HH:mm')}
          </p>

          {/* Description */}
          <p className="text-base text-muted-foreground font-light leading-relaxed italic border-l-2 border-orange-500 pl-4">
            {workshop.description}
          </p>

          {/* Price + Book */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black tracking-tighter">
                {(workshop.price ?? 0).toFixed(2)}
              </span>
              <span className="text-lg font-bold text-muted-foreground">
                DKK
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4">
              Materials Included in Price
            </p>
            <BookWorkshopButton workshop={workshop} isFull={isFull} />
          </div>
        </div>
      </div>
    </main>
  )
}
