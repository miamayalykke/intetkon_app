import { Scissors } from 'lucide-react'

const UnderConstruction = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Icon */}
        <div className="relative">
          <div className="bg-orange-500/10 rounded-full p-8 border-2 border-dashed border-orange-500/40">
            <Scissors className="w-16 h-16 text-orange-500 rotate-45" />
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-secondary rounded-full" />
        </div>

        {/* Badge */}
        <div className="bg-secondary text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-1 border-2 border-white">
          Coming Soon
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-foreground leading-[0.85]">
            We&apos;re cutting <br />
            <span className="text-orange-500 italic font-serif">
              new patterns.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Something beautiful is being sewn together. Check back soon.
          </p>
        </div>

        {/* Decorative thread line */}
        <div className="w-px h-12 bg-linear-to-b from-orange-500 to-transparent opacity-40" />
      </div>
    </div>
  )
}

export default UnderConstruction
