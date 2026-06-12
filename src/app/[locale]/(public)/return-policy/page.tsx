'use client'

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
import { useTranslations } from 'next-intl'

const ReturnPolicyPage = () => {
  const t = useTranslations('pages.returnPolicy')
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

          <div className="bg-secondary text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 border-2 border-white mb-8">
            {t('hero.tag')}
          </div>
          <h1 className="text-5xl lg:text-[7rem] font-black text-foreground tracking-tighter leading-[0.85] mb-6">
            {t('hero.title')} <br />
            <span className="text-orange-500 italic font-serif">
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
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-card border border-border rounded-[3rem] space-y-4">
              <h2 className="font-bold flex items-center gap-2 text-secondary tracking-tight">
                <Scissors className="w-4 h-4" /> {t('sections.scope.number')}.{' '}
                {t('sections.scope.title')}
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {t('sections.scope.description')}
              </p>
            </div>
            <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-[3rem] space-y-4">
              <h2 className="font-bold flex items-center gap-2 text-orange-600 tracking-tight">
                <AlertCircle className="w-4 h-4" /> {t('sections.ethos.number')}
                . {t('sections.ethos.title')}
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed italic">
                {t('sections.ethos.description')}
              </p>
            </div>
          </div>

          <div className="p-10 border-2 border-dashed border-border rounded-[3rem] space-y-6">
            <h3 className="text-2xl font-black tracking-tighter uppercase">
              {t('sections.upcycling.number')}. {t('sections.upcycling.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground font-light">
              <p>
                <strong className="text-foreground">
                  {t('sections.upcycling.deadstock.label')}
                </strong>{' '}
                {t('sections.upcycling.deadstock.description')}
              </p>
              <p>
                <strong className="text-foreground">
                  {t('sections.upcycling.colourVariance.label')}
                </strong>{' '}
                {t('sections.upcycling.colourVariance.description')}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="bg-secondary text-white p-3 rounded-2xl">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                {t('sections.physicalProducts.number')}.{' '}
                {t('sections.physicalProducts.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">
                  {t('sections.physicalProducts.eligibilityWindow.title')}
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  {t('sections.physicalProducts.eligibilityWindow.description')}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">
                  {t('sections.physicalProducts.exclusions.title')}
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  {t('sections.physicalProducts.exclusions.description')}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">
                  {t('sections.physicalProducts.faultyItems.title')}
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  {t('sections.physicalProducts.faultyItems.description')}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">
                  {t('sections.physicalProducts.shipping.title')}
                </h4>
                <p className="text-sm text-muted-foreground font-light">
                  {t('sections.physicalProducts.shipping.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-foreground text-background rounded-[3.5rem] space-y-4 relative overflow-hidden">
              <Download className="w-8 h-8 text-orange-500 mb-2" />
              <h3 className="text-2xl font-black tracking-tighter uppercase">
                {t('sections.digitalGoods.number')}.{' '}
                {t('sections.digitalGoods.title')}
              </h3>
              <p className="text-sm text-background/70 font-light leading-relaxed">
                {t('sections.digitalGoods.description')}
              </p>
            </div>
            <div className="p-10 bg-secondary text-white rounded-[3.5rem] space-y-4">
              <Calendar className="w-8 h-8 text-white mb-2" />
              <h3 className="text-2xl font-black tracking-tighter uppercase">
                {t('sections.workshops.number')}.{' '}
                {t('sections.workshops.title')}
              </h3>
              <p className="text-sm text-white/80 font-light leading-relaxed">
                {t('sections.workshops.description')}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-border">
            <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Truck className="w-6 h-6 text-orange-500" />{' '}
              {t('sections.taxes.number')}. {t('sections.taxes.title')}
            </h3>
            <div className="prose prose-sm max-w-none text-muted-foreground font-light grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="font-bold text-foreground mb-1">
                  {t('sections.taxes.eu.label')}
                </p>
                <p>{t('sections.taxes.eu.description')}</p>
              </div>
              <div>
                <p className="font-bold text-foreground mb-1">
                  {t('sections.taxes.nonEu.label')}
                </p>
                <p>{t('sections.taxes.nonEu.description')}</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-card border border-border rounded-[2.5rem] flex items-center gap-6">
            <div className="hidden sm:flex bg-orange-500/10 text-orange-600 p-4 rounded-full">
              <Hammer className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold">
                {t('sections.repairs.number')}. {t('sections.repairs.title')}
              </h4>
              <p className="text-sm text-muted-foreground font-light">
                {t('sections.repairs.description')}
              </p>
            </div>
          </div>

          <div className="relative group p-12 lg:p-16 bg-white rounded-[4rem] border border-border shadow-2xl text-center overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Undo2 className="w-32 h-32" />
            </div>
            <Mail className="w-12 h-12 text-secondary mb-6 mx-auto" />
            <h3 className="text-4xl font-black tracking-tighter mb-4">
              {t('footer.heading')}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto font-light italic">
              {t('footer.description')}
            </p>
            <a
              href="mailto:info@intetkon.com"
              className="text-2xl font-bold hover:text-orange-500 transition-colors underline decoration-secondary underline-offset-8 decoration-2"
            >
              {t('footer.email')}
            </a>
            <p className="mt-12 text-[10px] uppercase tracking-widest text-muted-foreground font-black">
              {t('footer.address')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-secondary overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-reverse text-white">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              {t('marquee.0')} <Scissors className="w-4 h-4" />
              {t('marquee.1')} <Undo2 className="w-4 h-4" />
              {t('marquee.2')} <Package className="w-4 h-4" />
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ReturnPolicyPage
