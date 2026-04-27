'use client'

import { Button } from '@ui/button'
import { format } from 'date-fns'
import { ArrowRight, Clock, MapPin, Scissors, Users } from 'lucide-react'
import Link from 'next/link'
import type { WORKSHOPS_QUERYResult } from '../../../sanity.types'

type WorkshopItem = WORKSHOPS_QUERYResult[number]

const WorkshopCard = ({ workshop }: { workshop: WorkshopItem }) => {
  const signUps = workshop.currentSignUps ?? 0
  const maxSpots = workshop.maxAllocation ?? 0
  const isFull = signUps >= maxSpots
  const spotsLeft = maxSpots - signUps
  const eventDate = new Date(workshop.date ?? '')

  return (
    <div
      className={`relative flex flex-col lg:flex-row group ${isFull ? 'opacity-60' : ''}`}
    >
      {/* --- Date Block (The "Ticket Stub") --- */}
      <div className="flex flex-col items-center justify-center bg-card border-2 border-border p-8 rounded-4xl lg:rounded-r-none lg:w-48 transition-colors group-hover:border-orange-500/50">
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">
          {format(eventDate, 'MMM')}
        </span>
        <span className="text-6xl font-black tracking-tighter leading-none mb-2">
          {format(eventDate, 'dd')}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {format(eventDate, 'yyyy')}
        </span>
      </div>

      {/* --- Main Info --- */}
      <div className="grow bg-white border-2 border-l-0 border-border p-8 lg:p-12 rounded-4xl lg:rounded-l-none flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm group-hover:shadow-xl transition-all">
        <div className="space-y-4 text-center lg:text-left">
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Clock className="w-3 h-3 text-secondary" /> {workshop.duration}
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <MapPin className="w-3 h-3 text-secondary" /> {workshop.location}
            </span>
            <span
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isFull ? 'text-red-500' : 'text-orange-500'}`}
            >
              <Users className="w-3 h-3" />{' '}
              {isFull ? 'Sold Out' : `${spotsLeft} Spots Remaining`}
            </span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
            {workshop.title}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground font-light leading-relaxed italic">
            {workshop.description}
          </p>
        </div>

        {/* --- Action Area --- */}
        <div className="flex flex-col items-center lg:items-end gap-4 min-w-50">
          <div className="text-3xl font-black tracking-tighter">
            {(workshop.price ?? 0).toFixed(2)} DKK
          </div>

          <Link href={`/workshops/${workshop.slug?.current}`} className="w-full">
            <Button
              disabled={isFull}
              size="2xl"
              className={`w-full h-16 rounded-full font-black uppercase tracking-widest transition-all
                ${
                  isFull
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-black hover:scale-105 shadow-lg shadow-orange-500/20'
                }`}
            >
              {isFull ? 'At Capacity' : 'View Details'}
              {!isFull && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </Link>

          <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
            Materials Included in Price
          </p>
        </div>
      </div>

      {/* Background Decorative "Scissors" */}
      <div className="absolute -top-6 -left-6 -z-10 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
        <Scissors className="w-32 h-32 -rotate-12" />
      </div>
    </div>
  )
}

export default WorkshopCard
