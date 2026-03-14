import AboutMeImage from '@public/aboutMe.png'
import { HeartHandshake, Palette, Sparkles } from 'lucide-react'
import Image from 'next/image'

const AboutSection = () => {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <svg
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <title>Decorative thread lines</title>
        <path
          d="M0,20 Q25,10 50,20 T100,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.1"
          className="text-orange-500"
        />
        <path
          d="M0,80 Q30,90 60,70 T100,80"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.1"
          className="text-secondary"
        />
      </svg>

      {/* Ribbon */}
      <div className="relative mb-20 py-4 bg-orange-500 -rotate-1 shadow-lg overflow-hidden border-y-2 border-orange-600">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="text-white text-2xl font-black uppercase tracking-tighter mx-8 flex items-center gap-4"
            >
              Creative Freedom <Sparkles className="w-6 h-6" />
              Inclusive Universe <HeartHandshake className="w-6 h-6" />
              Handmade Aesthetics <Palette className="w-6 h-6" />
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-4/5 overflow-hidden rounded-[3rem] z-10 border-8 border-white shadow-2xl">
              <Image
                src={AboutMeImage}
                alt="Intekøn - Project"
                fill
                priority
                className="object-cover transition-transform duration-1000 hover:scale-110"
              />
            </div>

            {/* Sticker overlyy */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full flex items-center justify-center p-4 text-center text-white font-bold text-sm leading-tight z-20 shadow-xl rotate-12 animate-bounce-slow">
              Built on Presence
            </div>

            {/* Behind the image: A textured "cardboard" or "paper" offset square */}
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-orange-100 rounded-[3rem] -z-10 rotate-2 border-2 border-dashed border-orange-300" />
          </div>

          {/* Right Side: Narrative Content */}
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground leading-tight">
                A creative brand built on <br />
                <span className="text-orange-500 underline decoration-secondary/30 underline-offset-8 italic font-serif">
                  craftsmanship
                </span>
                , aesthetics, and presence.
              </h2>

              <div className="space-y-6 text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                <p>
                  My name is{' '}
                  <span className="text-foreground font-bold border-b-2 border-orange-400">
                    Emilie
                  </span>
                  , and I’m the founder of Intetkøn. Here, I create patterns,
                  products, and workshops with room for personality, learning,
                  and creative freedom.
                </p>

                <p className="bg-secondary/5 p-6 rounded-2xl border-l-4 border-secondary italic">
                  "Intetkøn is an inclusive universe for those who love making
                  things by hand and want to be part of something that feels
                  human, inspiring, and open to everyone."
                </p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                E
              </div>
              <p className="font-serif italic text-3xl text-foreground">
                Emilie
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
