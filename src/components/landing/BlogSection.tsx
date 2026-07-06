'use client'

import HangaroundBagImage from '@public/hangaroundBag.jpeg'
import BookAtelierImage from '@public/hero2.jpeg'
import JoinCommunityImage from '@public/joinCommunity.png'
import workshopImage from '@public/workshop.jpg'
import { Bookmark, BookOpen, Newspaper } from 'lucide-react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

const HANGAROUND_PRODUCT_SLUG: Record<string, string> = {
  en: 'walter-pennell-crescent-bag-danish',
  da: 'walter-pennell-halvmane-taske-dansk',
}

function BlogSection() {
  const t = useTranslations()
  const locale = useLocale()

  const featuredPosts: Array<{
    title: string
    excerpt: string
    image: StaticImageData
    category: string
    href: string
    featured?: boolean
  }> = [
    {
      title: t('pages.home.products.workshops.label'),
      excerpt: t('pages.home.products.workshops.description'),
      image: workshopImage,
      category: t('pages.home.products.workshops.badge'),
      href: `/${locale}/workshops`,
      featured: true,
    },
    {
      title: t('pages.home.products.hangaroundBag.label'),
      excerpt: t('pages.home.products.hangaroundBag.description'),
      image: HangaroundBagImage,
      category: t('pages.home.products.hangaroundBag.badge'),
      href: `/${locale}/product/${HANGAROUND_PRODUCT_SLUG[locale] ?? HANGAROUND_PRODUCT_SLUG.en}`,
    },
    {
      title: t('pages.home.bookAtelier.label'),
      excerpt: t('pages.home.bookAtelier.description'),
      image: BookAtelierImage,
      category: t('pages.home.bookAtelier.badge'),
      href: `/${locale}/book-atelieret`,
    },
    {
      title: t('pages.home.community.title'),
      excerpt: t('pages.home.community.description'),
      image: JoinCommunityImage,
      category: t('pages.home.community.badge'),
      href: `/${locale}/pattern-testing`,
    },
  ]

  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* --- Background Decorations --- */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl -z-10" />

      <svg
        className="absolute top-0 left-0 w-full h-full -z-10 opacity-15 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <title>Decorations</title>
        <path
          d="M0,50 Q20,30 40,50 T100,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.08"
          className="text-secondary"
        />
        <path
          d="M0,10 Q40,30 70,10 T100,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.08"
          className="text-orange-400"
        />
      </svg>

      {/* --- Marquee Ribbon --- */}
      <div className="relative mb-24 py-5 bg-orange-500 rotate-1 shadow-lg overflow-hidden border-y-2 border-orange-600">
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {[...Array(8)].map((_, i) => {
            const marqueeItems = t.raw('pages.home.newsletter.marquee')
            return (
              <span
                key={i}
                className="text-white text-2xl lg:text-3xl font-black uppercase tracking-tighter mx-10 flex items-center gap-5"
              >
                {marqueeItems[0]} <BookOpen className="w-7 h-7" />
                {marqueeItems[1]} <Newspaper className="w-7 h-7" />
                {marqueeItems[2]} <Bookmark className="w-7 h-7" />
              </span>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-16 items-start">
          {/* Left Side: Sticky CTA */}
          <div className="lg:sticky lg:top-32 flex flex-col gap-10">
            <div className="space-y-6">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
                {t('pages.home.newsletter.label')}
              </span>
              <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-foreground leading-none">
                {t('pages.home.newsletter.heading')}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {t('pages.home.newsletter.title')}
              </p>
            </div>
          </div>

          {/* Right Side: Featured cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
            {featuredPosts.map((post) => (
              <Link
                key={post.title}
                href={post.href}
                className={`group relative flex flex-col gap-6 bg-card rounded-[2.5rem] p-6 shadow-lg border border-border transition-all hover:border-orange-200 hover:shadow-xl ${
                  post.featured
                    ? 'md:col-span-2 md:flex-row md:items-center'
                    : ''
                }`}
              >
                {/* Image Container */}
                <div
                  className={`relative aspect-video overflow-hidden rounded-[1.8rem] z-10 border-4 border-white shadow-lg shrink-0 ${
                    post.featured ? 'md:w-1/2' : 'w-full'
                  }`}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 right-4 bg-secondary text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl">
                    {post.category}
                  </span>
                </div>

                {/* Offset Dashed Background */}
                <div className="absolute top-6 left-6 w-[calc(100%-48px)] h-[calc(100%-48px)] bg-orange-100/50 rounded-[2.5rem] -z-10 rotate-1 border border-dashed border-orange-300 transition-transform group-hover:rotate-2" />

                <div className="flex flex-col gap-4 px-2 pb-2">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground leading-snug group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-light line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
