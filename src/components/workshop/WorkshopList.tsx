'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { WORKSHOPS_QUERYResult } from '../../../sanity.types'
import WorkshopCard from './WorkshopCard'

const LEVEL_VALUES = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const
type Filter = (typeof LEVEL_VALUES)[number]

export default function WorkshopList({
  workshops,
}: {
  workshops: WORKSHOPS_QUERYResult
}) {
  const t = useTranslations()
  const [filter, setFilter] = useState<Filter>('All')

  const filtered =
    filter === 'All' ? workshops : workshops.filter((w) => w.level === filter)

  return (
    <>
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="h-px grow bg-border hidden sm:block" />
        <div className="flex gap-2 flex-wrap">
          {LEVEL_VALUES.map((level) => (
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
              {level === 'All' ? t('pages.workshops.filters.all') : t(`pages.workshops.filters.${level.toLowerCase()}`)}
            </button>
          ))}
        </div>
        <div className="h-px grow bg-border hidden sm:block" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground italic py-24">
          {t('workshops.noUpcoming')}
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
