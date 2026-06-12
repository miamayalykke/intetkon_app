'use client'

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
import { useTranslations } from 'next-intl'

const TermsPage = () => {
  const t = useTranslations('pages.terms')
  return (
    <main className="w-full overflow-x-clip">
      <section className="pt-24 pb-12">
        <div className="relative isolate flex flex-col items-center justify-center min-h-[40vh] w-full overflow-hidden text-center px-6">
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
            {t('hero.tag')}
          </div>
          <h1 className="text-5xl lg:text-[7rem] font-black text-foreground tracking-tighter leading-[0.85] mb-6">
            {t('hero.title')} <br />
            <span className="text-secondary italic font-serif">
              {t('hero.titleItalic')}
            </span>
          </h1>
          <p className="max-w-xl text-muted-foreground font-light italic">
            {t('hero.effectiveDate')} <br />
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 p-8 bg-card border border-border rounded-[3rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                {t('operator.operatorTitle')}
              </p>
              <p className="font-bold text-lg">{t('operator.label')}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div className="space-y-1 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                {t('operator.locationTitle')}
              </p>
              <p className="text-muted-foreground">{t('operator.location')}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-border" />
            <div className="space-y-1 text-center md:text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                {t('operator.contactTitle')}
              </p>
              <p className="text-muted-foreground">{t('operator.contact')}</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-xs">
                  {t('sections.overview.number')}
                </span>
                {t('sections.overview.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light italic">
                {t('sections.overview.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-orange-500/5 border border-orange-500/10 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />{' '}
                  {t('sections.storeTerms.title')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('sections.storeTerms.description')}
                </p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-secondary/10 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Gavel className="w-4 h-4" />{' '}
                  {t('sections.generalConditions.title')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('sections.generalConditions.description')}
                </p>
              </div>
            </div>

            <div className="space-y-10 prose prose-sm prose-orange max-w-none text-muted-foreground font-light">
              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg">
                  {t('sections.accuracy.number')}.{' '}
                  {t('sections.accuracy.title')}
                </h3>
                <p>{t('sections.accuracy.description')}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg">
                  {t('sections.modifications.number')}.{' '}
                  {t('sections.modifications.title')}
                </h3>
                <p>{t('sections.modifications.description')}</p>
              </div>
              <div className="bg-card border-2 border-dashed border-border p-8 rounded-[3rem] my-8">
                <h3 className="text-foreground font-bold text-lg mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />{' '}
                  {t('sections.billing.number')}. {t('sections.billing.title')}
                </h3>
                <p>{t('sections.billing.description')}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg">
                  {t('sections.userContent.number')}.{' '}
                  {t('sections.userContent.title')}
                </h3>
                <p>{t('sections.userContent.description')}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-foreground font-bold text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-destructive" />{' '}
                  {t('sections.prohibitedUses.number')}.{' '}
                  {t('sections.prohibitedUses.title')}
                </h3>
                <p>{t('sections.prohibitedUses.description')}</p>
              </div>
            </div>

            <div className="p-10 bg-foreground text-background rounded-[3rem] space-y-6">
              <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                <Scale className="text-orange-500 w-8 h-8" />{' '}
                {t('sections.liability.number')}.{' '}
                {t('sections.liability.title')}
              </h3>
              <p className="text-background/80 font-light leading-relaxed italic">
                {t('sections.liability.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border">
              <div className="space-y-4">
                <h4 className="font-bold text-foreground italic">
                  {t('sections.governingLaw.number')}.{' '}
                  {t('sections.governingLaw.title')}
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  {t('sections.governingLaw.description')}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-foreground italic">
                  {t('sections.changes.number')}. {t('sections.changes.title')}
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  {t('sections.changes.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24 p-12 lg:p-16 bg-secondary rounded-[4rem] text-center text-white relative overflow-hidden">
            <RefreshCw className="absolute -top-10 -left-10 w-48 h-48 text-white/5 rotate-12" />
            <Mail className="w-12 h-12 text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black tracking-tighter mb-4">
              {t('footer.heading')}
            </h3>
            <p className="text-white/80 mb-8 max-w-md mx-auto font-light italic">
              {t('footer.description')}
            </p>
            <a
              href="mailto:info@intetkon.com"
              className="text-2xl font-bold hover:text-orange-500 transition-colors underline decoration-white underline-offset-8"
            >
              {t('footer.email')}
            </a>
          </div>
        </div>
      </section>

      <section className="py-6 bg-foreground overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee text-white">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              {t('marquee.0')} <FileText className="w-4 h-4 text-orange-500" />
              {t('marquee.1')} <Scale className="w-4 h-4 text-secondary" />
              {t('marquee.2')} <Gavel className="w-4 h-4 text-orange-500" />
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default TermsPage
