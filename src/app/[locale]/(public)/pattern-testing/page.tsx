'use client'
import TesterHero from '@public/hero.jpeg'
import {
  applyPatternTester,
  type PatternTesterState,
} from '@src/lib/newsletter-actions'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { Label } from '@ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { Textarea } from '@ui/textarea'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Ruler,
  Scissors,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useActionState, useState } from 'react'

const initialState: PatternTesterState = { status: 'idle' }

const PatternTesterPage = () => {
  const [state, formAction, isPending] = useActionState(
    applyPatternTester,
    initialState,
  )
  const [sewingLevel, setSewingLevel] = useState('')
  const t = useTranslations('pages.patternTester')

  return (
    <main className="w-full overflow-x-clip">
      <section className="pt-18 pb-12">
        <div className="relative isolate flex flex-col items-center justify-center min-h-[50vh] w-full overflow-hidden text-center px-6">
          <svg
            className="absolute inset-0 w-full h-full -z-10 opacity-20 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <title>hero</title>
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

          <div className="bg-orange-500 text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-3 border-2 border-white mb-8">
            {t('hero.tag')}
          </div>

          <h1 className="text-5xl lg:text-[8rem] font-black text-foreground tracking-tighter leading-[0.85] mb-8">
            {t('hero.title')} <br />
            <span className="text-secondary italic font-serif">
              {t('hero.titleItalic')}
            </span>
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground font-light leading-relaxed italic">
            &ldquo;{t('hero.subtitle')}&rdquo;
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Side: Visuals & Requirements */}
          <div className="space-y-12 sticky top-24">
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-full h-full bg-secondary/5 rounded-[4rem] rotate-3 border-2 border-dashed border-secondary/30 -z-10" />
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={TesterHero}
                  alt="Pattern Drafting"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tighter uppercase">
                {t('lookingFor.title')}
              </h3>
              <ul className="space-y-4">
                {(
                  [
                    {
                      icon: <Scissors className="w-5 h-5 text-orange-500" />,
                      key: 0,
                    },
                    {
                      icon: <Ruler className="w-5 h-5 text-secondary" />,
                      key: 1,
                    },
                    {
                      icon: (
                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                      ),
                      key: 2,
                    },
                  ] as const
                ).map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center gap-4 text-lg font-light text-muted-foreground"
                  >
                    {item.icon} {t(`lookingFor.items.${item.key}` as any)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side: The Form */}
          <div className="relative p-8 lg:p-12 bg-card border border-border rounded-[3rem] shadow-xl">
            {state.status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-secondary" />
                <h2 className="text-3xl font-black tracking-tighter">
                  {t('form.youreInPool')}
                </h2>
                <p className="text-muted-foreground font-light italic max-w-xs">
                  {t('form.successMessage')}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="text-4xl font-black tracking-tighter mb-2">
                    {t('form.applyNow')}
                  </h2>
                  <p className="text-muted-foreground font-light italic">
                    {t('form.description')}
                  </p>
                </div>

                <form action={formAction} className="space-y-6">
                  <input type="hidden" name="sewingLevel" value={sewingLevel} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-[10px] uppercase font-black tracking-widest ml-1"
                      >
                        {t('form.firstName')}
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder={t('form.firstNamePlaceholder')}
                        className="rounded-xl border-border/50 bg-background h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-[10px] uppercase font-black tracking-widest ml-1"
                      >
                        {t('form.emailAddress')}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('form.emailPlaceholder')}
                        className="rounded-xl border-border/50 bg-background h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="level"
                        className="text-[10px] uppercase font-black tracking-widest ml-1"
                      >
                        {t('form.sewingLevel')}
                      </Label>
                      <Select
                        value={sewingLevel}
                        onValueChange={setSewingLevel}
                      >
                        <SelectTrigger className="rounded-xl border-border/50 bg-background h-12">
                          <SelectValue placeholder={t('form.selectLevel')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">
                            {t('form.beginner')}
                          </SelectItem>
                          <SelectItem value="intermediate">
                            {t('form.intermediate')}
                          </SelectItem>
                          <SelectItem value="advanced">
                            {t('form.advanced')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-[10px] uppercase font-black tracking-widest ml-1"
                    >
                      {t('form.tellUsAbout')}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t('form.stylePlaceholder')}
                      className="rounded-2xl border-border/50 bg-background min-h-30"
                    />
                  </div>

                  {state.status === 'conflict' && (
                    <p className="text-sm text-muted-foreground italic">
                      {t('form.alreadyInPool')}
                    </p>
                  )}
                  {state.status === 'error' && (
                    <p className="text-sm text-red-500">{t('form.error')}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    size="2xl"
                    className="w-full rounded-full bg-foreground hover:bg-orange-500 text-white font-bold h-16 text-lg transition-all group"
                  >
                    {isPending ? t('form.submitting') : t('form.submitButton')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-tighter">
                    {t('form.privacy')}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="relative w-full mt-12 overflow-hidden py-12 bg-secondary">
        <div className="flex whitespace-nowrap animate-marquee text-white">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[11px] font-black uppercase tracking-[0.4em] mx-12 flex items-center gap-4"
            >
              {t('marqueeBottom.0')} <ClipboardCheck className="w-4 h-4" />
              {t('marqueeBottom.1')} <Sparkles className="w-4 h-4" />
              {t('marqueeBottom.2')} <Scissors className="w-4 h-4" />
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default PatternTesterPage
