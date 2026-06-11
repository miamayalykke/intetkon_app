import {
  Cookie,
  Eye,
  FileText,
  Globe,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

const PrivacyPage = () => {
  return (
    <main className="w-full overflow-x-clip bg-background">
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
            Legal & Privacy
          </div>

          <h1 className="text-5xl lg:text-[7rem] font-black text-foreground tracking-tighter leading-[0.85] mb-6">
            PRIVACY <br />
            <span className="text-orange-500 italic font-serif">POLICY</span>
          </h1>
          <p className="max-w-xl text-muted-foreground font-light italic">
            Effective date: 14 March 2026. <br />
            Your data is handled with the same care as our garments.
          </p>
        </div>
      </section>

      {/* --- Section 2: Core Policy Content --- */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Who We Are Intro */}
          <div className="p-8 lg:p-12 bg-card border border-border rounded-[3rem] shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-secondary w-6 h-6" /> Who we are
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong>INTETKØN</strong> ("we", "us", "our") takes your privacy
                seriously. This Policy explains what personal data we collect,
                how we use it, and your rights under the{' '}
                <strong>
                  EU/EEA General Data Protection Regulation (GDPR)
                </strong>
                .
              </p>
              <div className="pt-4 text-sm font-mono text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>Address: Bentzonsvej 50B, 2000 Frederiksberg, Denmark</p>
                <p>Contact: info@intetkon.com</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-secondary/5 font-black text-8xl italic select-none">
              GDPR
            </div>
          </div>

          {/* Data Collection Grid */}
          <div className="space-y-8">
            <h3 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <Eye className="text-orange-500 w-8 h-8" /> Data We Collect
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Browsing',
                  desc: 'Device usage, IP address, and interaction data via cookies.',
                },
                {
                  title: 'Shopping',
                  desc: 'Name, email, shipping address, and order history.',
                },
                {
                  title: 'Subscribing',
                  desc: 'Email address and preferences for our sewing revolution updates.',
                },
                {
                  title: 'Workshops',
                  desc: 'Registration details, sessions, and accessibility preferences.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-4xl border border-border bg-background hover:border-secondary transition-colors"
                >
                  <h4 className="font-bold mb-2 text-secondary uppercase text-xs tracking-widest">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Purpose & Legal Basis */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black tracking-tighter">
              Purposes & Legal Bases
            </h3>
            <div className="prose prose-orange max-w-none text-muted-foreground font-light leading-relaxed space-y-4">
              <p>
                We process your data to provide our services (contract
                necessity), process payments via <strong>Stripe</strong>{' '}
                (legitimate interests), communicate with you, and ensure legal
                compliance with tax and accounting obligations.
              </p>
            </div>
          </div>

          {/* Rights Section */}
          <div className="relative p-10 bg-secondary/5 rounded-[3rem] border border-secondary/20">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <Scale className="text-secondary w-8 h-8" /> Your Rights
              </h3>
              <p className="text-muted-foreground font-light">
                Under GDPR, you have the right to{' '}
                <strong>access, correct, delete, or restrict</strong> your data.
                To exercise these rights or lodge a complaint, simply contact
                our studio team.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  'Access',
                  'Correction',
                  'Deletion',
                  'Portability',
                  'Objection',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full bg-white border border-secondary/20 text-[10px] font-bold uppercase tracking-wider text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Payments & Third Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Lock className="text-orange-500 w-5 h-5" /> Payments (Stripe)
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                We use Stripe for secure transactions. They act as a processor
                and receive identifiers necessary for fraud detection. We do not
                store your payment card data on our servers.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Cookie className="text-secondary w-5 h-5" /> Cookies
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                We use cookies for core site functionality, analytics, and
                performance. You can manage your preferences via our cookie
                banner or browser settings at any time.
              </p>
            </div>
          </div>

          {/* Final Details */}
          <div className="space-y-8 pt-12 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground font-light">
              <div className="space-y-2">
                <h5 className="font-bold text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4" /> International Transfers
                </h5>
                <p>
                  Data transferred outside the EU/EEA relies on Standard
                  Contractual Clauses or recognized frameworks.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-foreground flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Age of Consent
                </h5>
                <p>
                  By using this site, you confirm you are of legal age or have
                  parental consent.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Contact Card */}
          <div className="flex flex-col items-center py-16 bg-foreground text-background rounded-[4rem] text-center px-6">
            <Mail className="w-12 h-12 text-orange-500 mb-6" />
            <h3 className="text-4xl font-black tracking-tighter mb-4">
              Questions or Requests?
            </h3>
            <p className="text-background/70 mb-8 max-w-md font-light italic">
              Our studio team is here to help with any privacy concerns.
            </p>
            <a
              href="mailto:info@intetkon.com"
              className="text-2xl font-bold hover:text-orange-500 transition-colors underline decoration-orange-500 underline-offset-8"
            >
              info@intetkon.com
            </a>
          </div>
        </div>
      </section>

      {/* --- Bottom Marquee --- */}
      <section className="py-8 bg-orange-500 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-reverse text-white">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              Privacy First <ShieldCheck className="w-4 h-4" />
              Your Data Your Rules <FileText className="w-4 h-4" />
              Secure Atelier <Lock className="w-4 h-4" />
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default PrivacyPage
