import { Wrench } from 'lucide-react'

interface UnderConstructionProps {
  locale: string
}

const copy = {
  en: {
    label: 'A little sewing in progress',
    title: 'We’re making things better.',
    message:
      'Our website is getting a refresh. We’ll be back soon — in the meantime, come say hello on Instagram.',
    link: 'Follow along on Instagram',
  },
  da: {
    label: 'Vi syr lidt på hjemmesiden',
    title: 'Vi gør hjemmesiden endnu bedre.',
    message:
      'Vi opdaterer hjemmesiden og er snart tilbage. Indtil da kan du følge med på Instagram.',
    link: 'Følg med på Instagram',
  },
} as const

export default function UnderConstruction({ locale }: UnderConstructionProps) {
  const text = locale === 'da' ? copy.da : copy.en

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#f7f5f0] px-6 py-16 text-[#252521]">
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-28 size-80 rounded-full bg-[#e7ede5] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-20 size-96 rounded-full bg-[#f7dfcc] blur-3xl"
      />

      <section className="relative w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full border border-[#252521]/10 bg-white/70 shadow-sm">
          <Wrench aria-hidden="true" className="size-8 text-[#e87536]" strokeWidth={1.5} />
        </div>
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#64866b]">
          {text.label}
        </p>
        <h1 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
          {text.title}
        </h1>
        <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-[#66645e] sm:text-xl">
          {text.message}
        </p>
        <a
          className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-[#252521] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#e87536] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e87536]"
          href="https://www.instagram.com/_intetkon_/"
          rel="noreferrer"
          target="_blank"
        >
          {text.link}
        </a>
        <p className="mt-14 text-sm font-medium tracking-[0.16em] text-[#8a8880]">
          INTETKØN
        </p>
      </section>
    </main>
  )
}
