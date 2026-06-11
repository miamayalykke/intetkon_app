import {
  CreditCard,
  FileText,
  Gavel,
  Mail,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShoppingBag,
} from 'lucide-react'

const TermsPage = () => {
  return (
    <main className="w-full overflow-x-clip">
      {/* --- Section 1: Header --- */}
      <section className="pt-24 pb-12">
        <div className="relative isolate flex flex-col items-center justify-center min-h-[40vh] w-full overflow-hidden text-center px-6">
          {/* Brand Signature Threads */}
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

          <div className="bg-foreground text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg rotate-1 border-2 border-white mb-8">
            Usage Agreement
          </div>

          <h1 className="text-5xl lg:text-[7rem] font-black text-foreground tracking-tighter leading-[0.85] mb-6">
            TERMS OF <br />
            <span className="text-secondary italic font-serif">SERVICE</span>
          </h1>
          <p className="max-w-xl text-muted-foreground font-light italic">
            Last updated: 19 October 2025. <br />
            By using our atelier services, you agree to the following rules of
            the house.
          </p>
        </div>
      </section>

      {/* --- Section 2: Terms Content --- */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Operator Info Card */}
          <div className="mb-16 p-8 bg-card border border-border rounded-[3rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                Operator
              </p>
              <p className="font-bold text-lg">INTETKØN / Emilie Kallager</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                Location
              </p>
              <p className="text-muted-foreground">Frederiksberg, Denmark</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div className="space-y-1 text-center md:text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                Contact
              </p>
              <p className="text-muted-foreground">info@intetkon.com</p>
            </div>
          </div>

          {/* Detailed Terms Grid */}
          <div className="space-y-12">
            {/* 1. Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-xs">
                  01
                </span>
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light italic">
                By visiting our website and/or purchasing something from us, you
                engage in our “Service” and agree to be bound by these Terms of
                Service (“Terms”), including additional terms, policies and
                notices referenced here or available by hyperlink.
              </p>
            </div>

            {/* 2 & 3 Online Store & General Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-orange-500/5 border border-orange-500/10 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Store Terms
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You confirm you are of the age of majority. You may not use
                  our products for any unauthorized or illegal purpose,
                  including copyright violations.
                </p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-secondary/10 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Gavel className="w-4 h-4" /> General Conditions
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We reserve the right to refuse service. Your content may be
                  transferred unencrypted (excluding payment data which is
                  always encrypted).
                </p>
              </div>
            </div>

            {/* Middle Sections (Text Focused) */}
            <div className="space-y-10 prose prose-sm prose-orange max-w-none text-muted-foreground font-light">
              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg">
                  4. Accuracy & Timeliness
                </h3>
                <p>
                  We are not responsible if information on this site is not
                  accurate or current. Material is for general information and
                  reliance is at your own risk.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg">
                  5 & 6. Modifications & Products
                </h3>
                <p>
                  Prices are subject to change without notice. We reserve the
                  right to modify or discontinue services. We have made every
                  effort to display colors accurately, but monitor displays
                  vary.
                </p>
              </div>

              {/* Highlight Card for Billing */}
              <div className="bg-card border-2 border-dashed border-border p-8 rounded-[3rem] my-8">
                <h3 className="text-foreground font-bold text-lg mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" /> 7 & 8.
                  Billing & Payments
                </h3>
                <p>
                  We reserve the right to refuse any order. Payments are
                  processed by third-party providers like{' '}
                  <strong>Stripe</strong>. You agree to provide current,
                  complete, and accurate purchase information for all
                  transactions.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg">
                  10. User Content & Feedback
                </h3>
                <p>
                  If you submit creative ideas or comments, we may edit, copy,
                  and distribute them in any medium without obligation to pay
                  compensation or respond.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-destructive" /> 13.
                  Prohibited Uses
                </h3>
                <p>
                  You are prohibited from using the site for unlawful purposes,
                  infringing on intellectual property, transmitting viruses, or
                  scraping content. Violation results in immediate termination.
                </p>
              </div>
            </div>

            {/* Liability Section (Styled like a warning label) */}
            <div className="p-10 bg-foreground text-background rounded-[3rem] space-y-6">
              <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                <Scale className="text-orange-500 w-8 h-8" /> 14. Limitation of
                Liability
              </h3>
              <p className="text-background/80 font-light leading-relaxed italic">
                The Service and all products are provided “as is” and “as
                available” without warranties of any kind. In no case shall
                INTETKØN be liable for any injury, loss, claim, or consequential
                damages arising from your use of the service.
              </p>
            </div>

            {/* Closing Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border">
              <div className="space-y-4">
                <h4 className="font-bold text-foreground italic">
                  19. Governing Law
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  These Terms shall be governed by and construed in accordance
                  with the laws of <strong>Denmark</strong>.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-foreground italic">
                  20. Changes to Terms
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  We reserve the right to update or replace any part of these
                  Terms by posting updates to our website.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Footer */}
          <div className="mt-24 p-12 lg:p-16 bg-secondary rounded-[4rem] text-center text-white relative overflow-hidden">
            <RefreshCw className="absolute -top-10 -left-10 w-48 h-48 text-white/5 rotate-12" />
            <Mail className="w-12 h-12 text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black tracking-tighter mb-4">
              Questions about the Terms?
            </h3>
            <p className="text-white/80 mb-8 max-w-md mx-auto font-light italic">
              Send us an email and our studio team will get back to you.
            </p>
            <a
              href="mailto:info@intetkon.com"
              className="text-2xl font-bold hover:text-orange-500 transition-colors underline decoration-white underline-offset-8"
            >
              info@intetkon.com
            </a>
          </div>
        </div>
      </section>

      {/* --- Bottom Marquee --- */}
      <section className="py-6 bg-foreground overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee text-white">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              Terms of Service <FileText className="w-4 h-4 text-orange-500" />
              Bound by Choice <Scale className="w-4 h-4 text-secondary" />
              The Studio Rules <Gavel className="w-4 h-4 text-orange-500" />
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default TermsPage
