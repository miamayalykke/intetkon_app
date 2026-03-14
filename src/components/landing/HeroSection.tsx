import HeroImage from '@public/hero.jpeg'
import { Button } from '@ui/button'
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Scissors,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <div className="w-full pb-4 overflow-x-clip">
      <section
        className="relative isolate flex h-[calc(100vh-7rem)] w-full items-center  
        rounded-t-[3rem] rounded-bl-[3rem] rounded-br-[8rem]"
      >
        <svg
          className="absolute inset-0 w-full h-full -z-10 opacity-30 pointer-events-none"
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
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6 sm:px-12 lg:px-16 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
            {/* Left: Content Area */}
            <div className="flex flex-col items-start gap-6 lg:gap-8 z-10">
              {/* Secondary Color Badge */}
              <div className="relative group md:mt-5 animate-bounce-slow">
                <div className="bg-secondary text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 border-2 border-white">
                  Atelier & Studio
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tighter text-foreground sm:text-7xl lg:text-[8rem] leading-[0.85]">
                  Clothes should <br />
                  <span className="text-orange-500 italic font-serif">
                    fit you,
                  </span>
                </h1>
                <p className="text-3xl lg:text-5xl font-light text-muted-foreground/80 tracking-tight">
                  not the other way around.
                </p>
              </div>

              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed md:text-xl italic font-light">
                Sewing, sewing patterns & workshops for those who want to create{' '}
                <span className="text-foreground font-semibold border-b-2 border-orange-500/20">
                  something themselves.
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href="/patterns">
                  <Button
                    size="2xl"
                    className="font-bold gap-3 shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Scissors className="w-5 h-5" />
                    Shop Patterns
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/workshops">
                  <Button
                    size="2xl"
                    variant="secondary"
                    className="font-bold gap-3 shadow-xl shadow-black-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Workshops
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              {/* Decorative Dashed Frames in Orange & Green */}
              <div className="absolute -top-10 -right-10 w-full h-full bg-orange-500/5 rounded-[4rem] rotate-6 border-2 border-dashed border-orange-500/30 -z-10" />
              <div className="absolute -bottom-8 -left-8 w-full h-full bg-secondary/5 rounded-[4rem] -rotate-3 border-2 border-dashed border-secondary/30 -z-10" />

              <div className="relative aspect-4/5 w-full max-w-110 mx-auto overflow-hidden rounded-[4rem] border-12 border-white shadow-2xl transition-transform duration-700 hover:rotate-2">
                <Image
                  src={HeroImage}
                  alt="Intetkøn Concept"
                  fill
                  priority
                  className="object-cover"
                />

                <div className="absolute bottom-12 -left-4 bg-secondary text-white py-3 px-6 rounded-2xl font-bold text-xs rotate-[-10deg] shadow-2xl flex items-center gap-2 border-2 border-white">
                  <HeartHandshake className="w-4 h-4" /> Inclusive Universe
                </div>

                <div className="absolute top-10 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg rotate-12">
                  <Scissors className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Line */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-linear-to-b from-orange-500 to-transparent opacity-40" />
        </div>
      </section>
    </div>
  )
}

export default HeroSection
