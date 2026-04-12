'use client'

import type { Workshop } from '@sanity/lib/workshops/workshopType'
import { useState } from 'react'
import WorkshopCard from './WorkshopCard'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const
type Filter = (typeof LEVELS)[number]

export default function WorkshopList({ workshops }: { workshops: Workshop[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered =
    filter === 'All' ? workshops : workshops.filter((w) => w.level === filter)

  return (
    <>
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="h-px grow bg-border hidden sm:block" />
        <div className="flex gap-2 flex-wrap">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFilter(level)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border-2 transition-all ${
                filter === level
                  ? 'bg-foreground text-white border-foreground'
                  : 'border-border text-muted-foreground hover:border-orange-500 hover:text-orange-500'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="h-px grow bg-border hidden sm:block" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground italic py-24">
          No upcoming workshops at this level.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {filtered.map((workshop) => (
            <WorkshopCard key={workshop._id} workshop={workshop} />
          ))}
        </div>
      )}
    </>
  )
}
