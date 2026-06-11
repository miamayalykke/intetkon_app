import { getWorkshops } from '@sanity/lib/workshops/getWorkshops'
import LocalizedWorkshopList from '@src/components/workshop/LocalizedWorkshopList'

const WorkshopPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const workshops = await getWorkshops()

  return (
    <main className="min-h-screen bg-background pb-32">
      <section className="container mx-auto px-6 pt-24">
        <header className="mb-20 relative">
          <div className="bg-secondary text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-3 border-2 border-white mb-8 w-fit">
            Live Learning
          </div>

          <h1 className="text-6xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-8">
            STUDIO <br />
            <span className="text-orange-500 italic font-serif">SESSIONS</span>
          </h1>

          <p className="max-w-xl text-xl text-muted-foreground font-light italic leading-relaxed">
            &ldquo;From needle threading to advanced draping. Join us in the
            atelier to master the craft of genderless fashion.&rdquo;
          </p>
        </header>

        <LocalizedWorkshopList workshops={workshops} locale={locale} />
      </section>
    </main>
  )
}

export default WorkshopPage
