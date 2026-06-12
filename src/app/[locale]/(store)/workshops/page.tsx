import { getWorkshops } from '@sanity/lib/workshops/getWorkshops'
import LocalizedWorkshopList from '@src/components/workshop/LocalizedWorkshopList'
import { locales } from '@src/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const revalidate = 3600

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const WorkshopPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()
  const workshops = await getWorkshops()

  return (
    <main className="min-h-screen bg-background pb-32">
      <section className="container mx-auto px-6 pt-24">
        <header className="mb-20 relative">
          <div className="bg-secondary text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-3 border-2 border-white mb-8 w-fit">
            {t('pages.workshops.tag')}
          </div>

          <h1 className="text-6xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-8">
            {t('pages.workshops.title')} <br />
            <span className="text-orange-500 italic font-serif">{t('pages.workshops.titleItalic')}</span>
          </h1>

          <p className="max-w-xl text-xl text-muted-foreground font-light italic leading-relaxed">
            &ldquo;{t('pages.workshops.subtitle')}&rdquo;
          </p>
        </header>

        <LocalizedWorkshopList workshops={workshops} locale={locale} />
      </section>
    </main>
  )
}

export default WorkshopPage
