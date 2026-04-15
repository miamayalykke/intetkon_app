'use client'

import { Button } from '@ui/button'
import { ArrowRight, FileText, Heart, Scissors, Sparkles } from 'lucide-react'
import Link from 'next/link'

const CallToActionSection = () => {
  return (
    <section className="relative w-full py-26 overflow-hidden">
      {/* --- Top Ribbon (Orange) --- */}
      <div className="absolute top-5 left-0 w-full py-3 bg-orange-500 -rotate-1 shadow-md z-10 overflow-hidden border-y border-orange-600">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-white text-xs font-black uppercase tracking-[0.3em] mx-12 flex items-center gap-4"
            >
              Join the Movement <Heart className="w-3 h-3 fill-white" />
              Creative Freedom <Sparkles className="w-3 h-3" />
            </span>
          ))}
        </div>
      </div>
      {/* Soft Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/40 rounded-full blur-[100px] -z-10" />

      {/* Floating Thread Lines */}
      <svg
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-15 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <title>Thread Lines</title>
        <path
          d="M0,20 Q50,10 100,20"
          fill="none"
          stroke="#f97316"
          strokeWidth="0.1"
        />
        <path
          d="M0,80 Q50,90 100,80"
          fill="none"
          stroke="#22c55e"
          strokeWidth="0.1"
        />
      </svg>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center gap-6">
          {/* Rotating Stamp Badge (Slightly Smaller) */}
          <div className="relative w-20 h-20 animate-[spin_12s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <title>Stamp</title>
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                />
              </defs>
              <text
                fontSize="8.5"
                fontWeight="900"
                letterSpacing="2.5"
                fill="#f97316"
                style={{ textTransform: 'uppercase' }}
              >
                <textPath xlinkHref="#circlePath">
                  Join the Circle • Intetkøn •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange-500 fill-orange-500/10" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tighter text-foreground leading-tight">
              Become a{' '}
              <span className="text-orange-500 italic font-serif">
                pattern tester
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed font-light">
              Help us refine our latest drops. Join a dedicated group of makers
              who value{' '}
              <span className="text-foreground font-medium">
                precision, inclusive fit, and garment craft
              </span>
              . Shape the future of our atelier.
            </p>
          </div>

          {/* Feature Pills - Small & Clean */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {[
              {
                icon: <Scissors className="w-3.5 h-3.5" />,
                text: 'Early Access',
              },
              {
                icon: <FileText className="w-3.5 h-3.5" />,
                text: 'Feedback Loop',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm text-xs font-bold uppercase tracking-wider"
              >
                {feature.icon}
                {feature.text}
              </div>
            ))}
          </div>

          {/* Call To Action Button */}
          <div className="mt-4">
            <Link href="/pattern-testing">
              <Button
                size="4xl"
                className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold gap-3 group shadow-xl shadow-orange-500/30 transition-all hover:scale-105"
              >
                Apply to Test
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* The Green Banner (Marquee) */}
      <div className="absolute bottom-0 left-0 w-full py-4 bg-secondary shadow-[0_-10px_30px_rgba(34,197,94,0.1)]">
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-white/90 text-sm font-black uppercase tracking-[0.4em] mx-10 flex items-center gap-4"
            >
              Create <span className="w-1 h-1 rounded-full bg-white/40" />
              Learn <span className="w-1 h-1 rounded-full bg-white/40" />
              Grow <span className="w-1 h-1 rounded-full bg-white/40" />
              Together
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CallToActionSection
