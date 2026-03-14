'use client'
import AboutHero from '@public/hero.jpeg'
import { Button } from '@ui/button'
import {
  ArrowRight,
  Heart,
  HeartHandshake,
  Leaf,
  PlayCircle,
  Scissors,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const AboutPage = () => {
  return (
    <main className="w-full overflow-x-clip">
      <section className="pt-18 pb-12">
        <div className="relative isolate flex flex-col items-center justify-center min-h-[60vh] w-full overflow-hidden text-center">
          {/* Decorative Thread SVGs */}
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

          {/* Floating Sticker */}
          <div className="bg-secondary text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-3 border-2 border-white mb-8">
            Our Story
          </div>

          <h1 className="text-5xl lg:text-[8rem] font-black text-foreground tracking-tighter leading-[0.85] mb-8">
            ABOUT <br />
            <span className="text-orange-500 italic font-serif">INTETKØN</span>
          </h1>
          <p className="max-w-2xl text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed italic">
            &ldquo;Breaking the binary in fashion through freedom of expression
            and long-lasting craft.&rdquo;
          </p>
        </div>
      </section>

      {/* --- Section 2: Mission & Why (Split Layout) --- */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative">
            {/* The "Pattern Piece" Frames (Matching Hero Style) */}
            <div className="absolute -top-8 -right-8 w-full h-full bg-orange-500/5 rounded-[4rem] rotate-6 border-2 border-dashed border-orange-500/30 -z-10" />
            <div className="absolute -bottom-6 -left-6 w-full h-full bg-secondary/5 rounded-[4rem] -rotate-3 border-2 border-dashed border-secondary/30 -z-10" />

            <div className="relative aspect-4/5 rounded-[3rem] overflow-hidden shadow-2xl border-12 border-white">
              <Image
                src={AboutHero}
                alt="Intetkøn Workshop"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-10 -left-6 bg-secondary text-white py-3 px-6 rounded-2xl font-bold text-xs rotate-[-8deg] shadow-2xl flex items-center gap-2 border-2 border-white">
                <HeartHandshake className="w-4 h-4" /> Planet First Choice
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tighter">
                Our{' '}
                <span className="text-orange-500 italic font-serif">
                  Mission
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                Fast fashion wasn’t built for everyone or for the Earth. We
                started INTETKØN to offer a different path: gender-neutral
                design, transparent making, and open knowledge.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">
                Why we started
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-light italic">
                Every piece and pattern is an invitation to create clothes that
                fit your body, your values, and your vibe, no gender labels
                needed. By sharing patterns and workshops, we give you the tools
                to make garments you’re proud to wear and repair.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {['Gender-Neutral', 'Open Knowledge', 'Eco-Conscious'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full border border-border bg-card text-[10px] font-bold uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: What Sets Us Apart (Modern Grid) --- */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-foreground/2 select-none -z-10">
          STUDIO
        </div>

        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-7xl font-extrabold tracking-tighter">
              What Sets Us{' '}
              <span className="text-secondary italic font-serif">Apart</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Scissors className="w-6 h-6" />,
                title: 'Genderless Design',
                desc: 'Silhouettes and sizing that fit bodies, not boxes. Genderless from the first sketch.',
                color: 'bg-orange-500',
              },
              {
                icon: <PlayCircle className="w-6 h-6" />,
                title: 'Learning Hub',
                desc: 'Step-by-step tutorials and projector-ready files so you can sew confidently at home.',
                color: 'bg-secondary',
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: 'Circular Mindset',
                desc: "We champion upcycling and repair, encouraging re-use long after 'new'.",
                color: 'bg-orange-500',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-10 rounded-[3rem] bg-card border border-border transition-all hover:shadow-lg"
              >
                <div
                  className={`${feature.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full mt-24 overflow-hidden">
        {/* --- Top Frame Ribbon --- */}
        <div className="absolute top-20 left-0 w-full py-3 bg-white -rotate-1 shadow-md z-20 border-b border-secondary/10">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
              >
                No Gender Labels <Heart className="w-3 h-3 fill-secondary" />
                Freedom of Expression <Sparkles className="w-3 h-3" />
                Sustainable Craft <Scissors className="w-3 h-3" />
              </span>
            ))}
          </div>
        </div>

        <div className="relative isolate bg-secondary py-32 lg:py-48 px-6 text-center">
          <svg
            className="absolute inset-0 w-full h-full -z-10 opacity-20 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <title>ribbon</title>
            <path
              d="M-10,50 Q25,40 50,50 T110,50"
              fill="none"
              stroke="white"
              strokeWidth="0.2"
            />
            <path
              d="M-10,20 Q50,80 110,20"
              fill="none"
              stroke="white"
              strokeWidth="0.1"
            />
          </svg>

          <div className="max-w-4xl mx-auto z-10">
            <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-[0.3em]">
                Join the Sewing Revolution
              </span>
            </div>

            <h2 className="text-6xl lg:text-9xl font-black tracking-tighter mb-8 text-white leading-none">
              REWRITE THE <br />
              <span className="text-white italic font-serif opacity-90">
                Rules
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-white/90 text-xl lg:text-2xl mb-12 font-light leading-relaxed italic">
              Pick a pattern. Grab a kit. Upcycle your closet. Let’s rewrite the
              rules of fashion, one stitch at a time.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/patterns">
                <Button
                  size="2xl"
                  className="bg-white text-secondary hover:bg-orange-500 hover:text-white font-black px-12 h-20 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Get a Pattern
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/workshops">
                <Button
                  size="2xl"
                  variant="outline"
                  className="text-white border-white/30 bg-white/5 backdrop-blur-md hover:bg-white hover:text-secondary font-black px-12 h-20 rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  Join a Workshop
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-15 left-0 w-full py-4 bg-foreground rotate-1 z-20">
          <div className="flex whitespace-nowrap animate-marquee-reverse">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="text-white text-[11px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
              >
                Rewrite the Rules{' '}
                <span className="w-1 h-1 rounded-full bg-orange-500" />
                One Stitch at a Time{' '}
                <span className="w-1 h-1 rounded-full bg-orange-500" />
                The Future is Genderless
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
