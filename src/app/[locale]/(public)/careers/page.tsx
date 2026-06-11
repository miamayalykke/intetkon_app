import { Button } from '@ui/button'
import {
  ArrowRight,
  Briefcase,
  FileText,
  Heart,
  Mail,
  Scissors,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

const CareersPage = () => {
  return (
    <main className="w-full overflow-x-clip">
      <section className="pt-24 pb-12">
        <div className="relative isolate flex flex-col items-center justify-center min-h-[40vh] w-full overflow-hidden text-center">
          <svg
            className="absolute inset-0 w-full h-full -z-10 opacity-20 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <title>threads</title>
            <path
              d="M-10,20 Q30,10 60,25 T110,20"
              fill="none"
              stroke="#f97316"
              strokeWidth="0.1"
            />
            <path
              d="M-10,80 Q40,90 70,70 T110,80"
              fill="none"
              stroke="#22c55e"
              strokeWidth="0.1"
            />
          </svg>

          <div className="bg-secondary text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 border-2 border-white mb-8">
            Opportunities
          </div>

          <h1 className="text-6xl lg:text-[8rem] font-black text-foreground tracking-tighter leading-[0.85] mb-6">
            JOIN THE <br />
            <span className="text-orange-500 italic font-serif">ATELIER</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground font-light leading-relaxed italic">
            Help us rewrite the rules of fashion. We’re building a
            community-driven studio where craft meets inclusivity.
          </p>
        </div>
      </section>

      {/* --- Open Position Section --- */}
      <section className="container mx-auto px-6 py-12 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* Decorative Offset Frames */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-orange-500/5 rounded-[3rem] rotate-2 border-2 border-dashed border-orange-500/20 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-secondary/5 rounded-[3rem] -rotate-1 border-2 border-dashed border-secondary/20 -z-10" />

            {/* The Job Card */}
            <div className="relative bg-card border border-border rounded-[3rem] p-8 lg:p-16 shadow-2xl overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-8 right-8 flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Hiring Now
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-widest">
                    <Briefcase className="w-4 h-4" /> Internship Position
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black tracking-tighter">
                    Motivated Intern
                  </h2>
                </div>

                <p className="text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed italic">
                  &ldquo;If you’re passionate about genderless design,
                  upcycling, and learning by doing, we’d love to hear from
                  you.&rdquo;
                </p>

                <div className="pt-8 border-t border-border">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-secondary" /> How to Apply
                  </h3>
                  <p className="text-muted-foreground mb-8 font-light">
                    Please send your{' '}
                    <strong>application, CV, and portfolio</strong> to our
                    studio team. We review applications on a rolling basis.
                  </p>

                  <Link href="mailto:info@intetkon.com?subject=Internship Application - [Your Name]">
                    <Button
                      size="2xl"
                      className="w-full sm:w-auto rounded-full px-12 h-18 bg-foreground hover:bg-orange-500 text-white font-bold transition-all hover:scale-105 gap-4"
                    >
                      <Mail className="w-5 h-5" />
                      Apply via Email
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Decorative Corner Icon */}
              <div className="absolute -bottom-6 -right-6 text-orange-500/10 rotate-12">
                <Scissors className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Brand Marquee (Inverted style) --- */}
      <section className="mt-12 py-10 bg-secondary overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-reverse text-white">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[11px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              Join the Revolution <Sparkles className="w-4 h-4" />
              Rewrite the Rules <Scissors className="w-4 h-4" />
              Genderless Future <Heart className="w-4 h-4 fill-white" />
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default CareersPage
