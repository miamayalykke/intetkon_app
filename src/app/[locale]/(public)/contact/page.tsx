'use client'

import { ArrowRight, Mail, MapPin, Scissors } from 'lucide-react'

const ContactPage = () => {
  return (
    <main className="w-full overflow-x-clip">
      {/* --- Section 1: Header --- */}
      <section className="pt-24 pb-12">
        <div className="relative isolate flex flex-col items-center justify-center min-h-[40vh] w-full overflow-hidden text-center">
          {/* Decorative Thread SVGs (Consistent with About/Hero) */}
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

          <div className="bg-orange-500 text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg rotate-2 border-2 border-white mb-8">
            Get in touch
          </div>

          <h1 className="text-6xl lg:text-[8rem] font-black text-foreground tracking-tighter leading-[0.85] mb-6">
            CONTACT <br />
            <span className="text-secondary italic font-serif">STUDIO</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground font-light leading-relaxed italic">
            Questions about a pattern, a bespoke order, or just want to say hi?
            Our digital atelier is always open.
          </p>
        </div>
      </section>

      {/* --- Section 2: Contact Info Grid --- */}
      <section className="container mx-auto px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Side: Email Inquiries */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/5 border border-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-widest">
              <Mail className="w-4 h-4" /> Email Inquiries
            </div>

            <div className="grid gap-6">
              {[
                {
                  label: 'Customer Service & Bespoke',
                  email: 'info@intetkon.com',
                  desc: 'Inquiries about sizing, fit, or custom commissions.',
                },
                {
                  label: 'Press & Loans',
                  email: 'info@intetkon.com',
                  desc: 'Editorial features, stylist pulls, and media kits.',
                },
                {
                  label: 'Wholesale & Business',
                  email: 'info@intetkon.com',
                  desc: 'Partnering with Intetkøn for retail or collaborations.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-[2.5rem] bg-card border border-border transition-all hover:border-orange-500/30 hover:shadow-xl"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    {item.label}
                  </p>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-2xl font-bold text-foreground hover:text-orange-500 transition-colors flex items-center gap-3"
                  >
                    {item.email}
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                  <p className="mt-2 text-sm text-muted-foreground font-light italic">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: The Studio Label */}
          <div className="relative top-32">
            {/* The "Pattern Piece" Frames */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-secondary/5 rounded-[4rem] rotate-3 border-2 border-dashed border-secondary/20 -z-10" />

            <div className="relative p-12 lg:p-16 bg-white rounded-[3rem] shadow-2xl border border-border overflow-hidden">
              {/* Studio Stamp */}
              <div className="absolute top-8 right-8 bg-secondary/10 text-secondary p-4 rounded-full rotate-12">
                <Scissors className="w-8 h-8" />
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
                    <MapPin className="w-4 h-4" /> Physical Space
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter">
                    The Studio
                  </h2>
                </div>

                <div className="space-y-4 text-xl text-muted-foreground font-light leading-relaxed">
                  <p className="text-foreground font-bold italic">
                    Open by appointment only
                  </p>
                  <p>
                    Bentzonsvej 50B
                    <br />
                    2000, Frederiksberg
                    <br />
                    Denmark
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-4 text-8xl font-black text-secondary/5  select-none">
                INTETKØN
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-24 py-12 bg-secondary overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee text-white">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-[15px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4 opacity-80"
            >
              Drop by us today
              <span className="w-3 h-3 rounded-full bg-primary" />
              Studio Frederiksberg{' '}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ContactPage
