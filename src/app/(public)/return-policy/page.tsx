import {
  AlertCircle,
  Calendar,
  Download,
  Hammer,
  Mail,
  Package,
  Scissors,
  Truck,
  Undo2,
} from 'lucide-react'

const ReturnPolicyPage = () => {
  return (
    <main className="w-full overflow-x-clip">
      {/* --- Section 1: Header --- */}
      <section className="pt-24 pb-12">
        <div className="relative isolate flex flex-col items-center justify-center min-h-[40vh] w-full overflow-hidden text-center px-6">
          {/* Signature Threads */}
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
            Returns & Refunds
          </div>

          <h1 className="text-5xl lg:text-[7rem] font-black text-foreground tracking-tighter leading-[0.85] mb-6">
            KINDNESS & <br />
            <span className="text-orange-500 italic font-serif">CLARITY</span>
          </h1>
          <p className="max-w-xl text-muted-foreground font-light italic">
            Last updated: 19 October 2025. <br />
            We design for longevity. If something isn&apos;t right, let&apos;s
            find a solution.
          </p>
        </div>
      </section>

      {/* --- Section 2: Policy Content --- */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* 1 & 2: Overview & Ethos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-card border border-border rounded-[3rem] space-y-4">
              <h2 className="font-bold flex items-center gap-2 text-secondary tracking-tight">
                <Scissors className="w-4 h-4" /> 1. Scope
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Covers physical products (kits, garments), digital items
                (patterns, videos), and workshops.
              </p>
            </div>
            <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-[3rem] space-y-4">
              <h2 className="font-bold flex items-center gap-2 text-orange-600 tracking-tight">
                <AlertCircle className="w-4 h-4" /> 2. Our Ethos
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed italic">
                Distance sales rely on good faith. Email us before buying if you
                are unsure; we seek amicable solutions.
              </p>
            </div>
          </div>

          {/* 3. Materials & Colour Disclaimer */}
          <div className="p-10 border-2 border-dashed border-border rounded-[3rem] space-y-6">
            <h3 className="text-2xl font-black tracking-tighter uppercase">
              3. Upcycling & Colour
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground font-light">
              <p>
                <strong className="text-foreground">
                  Deadstock Materials:
                </strong>{' '}
                Some products use upcycled components and may have minor
                imperfections. We preserve the usable area.
              </p>
              <p>
                <strong className="text-foreground">Colour Variance:</strong>{' '}
                Screen displays vary. Colour variance alone does not qualify for
                a refund.
              </p>
            </div>
          </div>

          {/* 4. Physical Products (The Big Section) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-secondary text-white p-3 rounded-2xl">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                4. Physical Products
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">
                  Eligibility Window
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  14 days from delivery (EU withdrawal right). Items must be
                  unused and in original packaging.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Exclusions</h4>
                <p className="text-sm text-muted-foreground font-light">
                  Custom/made-to-order items, hygiene-sensitive items (if
                  opened), and used/washed goods.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Faulty Items</h4>
                <p className="text-sm text-muted-foreground font-light">
                  Contact us within 14 days with photos if an item is defective
                  or damaged in transit.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Shipping</h4>
                <p className="text-sm text-muted-foreground font-light">
                  Customer covers return shipping unless faulty. Original
                  shipping is non-refundable.
                </p>
              </div>
            </div>
          </div>

          {/* 5 & 6: Digital & Workshops (Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-foreground text-background rounded-[3.5rem] space-y-4 relative overflow-hidden">
              <Download className="w-8 h-8 text-orange-500 mb-2" />
              <h3 className="text-2xl font-black tracking-tighter uppercase">
                5. Digital Goods
              </h3>
              <p className="text-sm text-background/70 font-light leading-relaxed">
                Patterns and videos are{' '}
                <span className="text-orange-500 font-bold">
                  non-refundable
                </span>{' '}
                once delivery begins. Your right of withdrawal ends once access
                starts.
              </p>
            </div>

            <div className="p-10 bg-secondary text-white rounded-[3.5rem] space-y-4">
              <Calendar className="w-8 h-8 text-white mb-2" />
              <h3 className="text-2xl font-black tracking-tighter uppercase">
                6. Workshops
              </h3>
              <p className="text-sm text-white/80 font-light leading-relaxed">
                Reschedule possible up to 7 days before. Inside 7 days, we
                cannot refund as materials are committed. No-shows are not
                refundable.
              </p>
            </div>
          </div>

          {/* 7 & 8: VAT & Duties */}
          <div className="space-y-6 pt-12 border-t border-border">
            <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Truck className="w-6 h-6 text-orange-500" /> 7 & 8. Taxes &
              Duties
            </h3>
            <div className="prose prose-sm max-w-none text-muted-foreground font-light grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="font-bold text-foreground mb-1">EU Orders</p>
                <p>
                  VAT is charged at checkout. B2B customers with valid VAT
                  numbers may be zero-rated upon verification.
                </p>
              </div>
              <div>
                <p className="font-bold text-foreground mb-1">
                  Non-EU (UK, etc.)
                </p>
                <p>
                  Exported without Danish VAT. Import duties and local fees are
                  the{' '}
                  <span className="underline">
                    customer&apos;s responsibility
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* 9: Repairs Goodwill */}
          <div className="p-8 bg-card border border-border rounded-[2.5rem] flex items-center gap-6">
            <div className="hidden sm:flex bg-orange-500/10 text-orange-600 p-4 rounded-full">
              <Hammer className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold">9. Repairs (Goodwill)</h4>
              <p className="text-sm text-muted-foreground font-light">
                We may offer complimentary minor repairs on INTETKØN products.
                Shipping is the customer&apos;s responsibility.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="relative group p-12 lg:p-16 bg-white rounded-[4rem] border border-border shadow-2xl text-center overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Undo2 className="w-32 h-32" />
            </div>

            <Mail className="w-12 h-12 text-secondary mb-6 mx-auto" />
            <h3 className="text-4xl font-black tracking-tighter mb-4">
              Start a Return
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto font-light italic">
              Email us with your order number and photos before sending anything
              back.
            </p>
            <a
              href="mailto:info@intetkon.com"
              className="text-2xl font-bold hover:text-orange-500 transition-colors underline decoration-secondary underline-offset-8 decoration-2"
            >
              info@intetkon.com
            </a>

            <p className="mt-12 text-[10px] uppercase tracking-widest text-muted-foreground font-black">
              Address: Bentzonsvej 50B, 2000 Frederiksberg, Denmark
            </p>
          </div>
        </div>
      </section>

      {/* --- Bottom Marquee --- */}
      <section className="py-6 bg-secondary overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-reverse text-white">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              Built to Last <Scissors className="w-4 h-4" />
              Transparent Policy <Undo2 className="w-4 h-4" />
              Kindness Always <Package className="w-4 h-4" />
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ReturnPolicyPage
