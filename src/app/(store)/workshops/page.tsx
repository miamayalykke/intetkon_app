import type { Workshop } from '@sanity/lib/workshops/workshopType'
import WorkshopCard from '@src/components/workshop/WorkshopCard'

export async function getWorkshops(): Promise<Workshop[]> {
  // Simulate network delay for realistic testing
  await new Promise((resolve) => setTimeout(resolve, 800))

  const mockWorkshops: Workshop[] = [
    {
      _id: 'w1',
      title: 'Draping the Fluid Form',
      slug: { current: 'draping-fluid-form' },
      description:
        'A deep dive into three-dimensional design. Learn to manipulate fabric directly on the mannequin to create silhouettes that ignore traditional gender lines.',
      date: '2026-04-12T10:00:00Z',
      duration: '5 Hours',
      price: 85.0,
      location: 'Copenhagen Studio',
      maxAllocation: 10,
      currentSignUps: 4,
      level: 'Intermediate',
    },
    {
      _id: 'w2',
      title: 'Zero Waste Pattern Cutting',
      slug: { current: 'zero-waste-cutting' },
      description:
        'Master the art of jigsaw-style pattern layout. We will teach you how to use every square inch of your fabric, leaving zero scraps behind.',
      date: '2026-05-05T13:00:00Z',
      duration: '4 Hours',
      price: 65.0,
      location: 'Berlin Atelier',
      maxAllocation: 12,
      currentSignUps: 12, // This one will show as "Sold Out"
      level: 'Beginner',
    },
    {
      _id: 'w3',
      title: 'Digital Patterns & Projectors',
      slug: { current: 'digital-patterns-workshop' },
      description:
        'Move your sewing practice into the future. Learn how to calibrate projectors for sewing and use layered PDF files for instant adjustments.',
      date: '2026-06-20T09:00:00Z',
      duration: '3 Hours',
      price: 45.0,
      location: 'Online / Zoom',
      maxAllocation: 25,
      currentSignUps: 18,
      level: 'Advanced',
    },
  ]

  // Filtering for today or the future and sorting by date
  const now = new Date()
  return mockWorkshops
    .filter((w) => new Date(w.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
const WorkshopPage = async () => {
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

        {/* --- Schedule View --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px grow bg-border" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
              Upcoming Schedule
            </span>
            <div className="h-px grow bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-12">
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop._id} workshop={workshop} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default WorkshopPage
