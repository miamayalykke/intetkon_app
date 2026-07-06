import { getPrivateEventData } from '@sanity/lib/privateEvents/getPrivateEventData'
import BookingSection from '@src/components/private-events/BookingSection'
import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'
import { PartyPopper, Scissors, Sparkles, Users } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const revalidate = 60

const BookAtelierPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const t = await getTranslations('privateEvents')
  const { slots, addons } = await getPrivateEventData()

  const serializedAddons = addons.map((addon) => ({
    _id: addon._id,
    title: getLocalizedField<string>(addon.title as never, locale) ?? 'Add-on',
    price: addon.price,
  }))

  const perks = [
    { icon: PartyPopper, text: t('perkOccasions') },
    { icon: Scissors, text: t('perkProject') },
    { icon: Users, text: t('perkGroup') },
  ]

  return (
    <main className="container mx-auto px-6 py-16">
      {/* --- Hero --- */}
      <header className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest -rotate-1 shadow-lg">
          <Sparkles className="w-3 h-3" /> {t('headerTag')}
        </div>
        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
          {t('title')}{' '}
          <span className="text-orange-500 italic font-serif">
            {t('titleItalic')}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground font-light italic mb-8">
          {t('intro')}
        </p>
        <div className="flex flex-wrap gap-4">
          {perks.map((perk) => (
            <span
              key={perk.text}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-card border border-border rounded-full px-4 py-2"
            >
              <perk.icon className="w-3 h-3 text-orange-500" /> {perk.text}
            </span>
          ))}
        </div>
      </header>

      <BookingSection slots={slots} addons={serializedAddons} locale={locale} />
    </main>
  )
}

export default BookAtelierPage
