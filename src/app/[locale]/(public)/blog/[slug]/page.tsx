import { getPostBySlug } from '@sanity/lib/posts/getPostBySlug'
import { blogPortableTextComponents } from '@src/components/blog/BlogPortableText'
import { imageUrl } from '@src/lib/imageUrl'
import { alternatesFor, BASE_URL } from '@src/lib/seo'
import { getLocalizedSlug } from '@src/lib/slug-helpers'
import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PortableText } from 'next-sanity'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = getLocalizedField<string>(post.title, locale) ?? 'Blog post'
  const description = getLocalizedField<string>(post.excerpt, locale) ?? ''
  const enSlug = getLocalizedSlug(post.slug, 'en')
  const daSlug = getLocalizedSlug(post.slug, 'da')

  return {
    title,
    description,
    alternates: alternatesFor(locale, {
      en: enSlug ? `/blog/${enSlug}` : undefined,
      da: daSlug ? `/blog/${daSlug}` : undefined,
    }),
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: post.publishedAt,
      images: post.mainImage
        ? [{ url: imageUrl(post.mainImage).width(1200).height(630).url() }]
        : undefined,
    },
  }
}

const BlogPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) => {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug)
  const t = await getTranslations('blog')

  if (!post) notFound()

  const title = getLocalizedField<string>(post.title, locale) ?? ''
  const excerpt = getLocalizedField<string>(post.excerpt, locale) ?? ''
  const body = getLocalizedField(post.body, locale)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: post.mainImage ? imageUrl(post.mainImage).url() : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    inLanguage: locale === 'da' ? 'da' : 'en',
    author: { '@type': 'Organization', name: 'Intetkøn', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Intetkøn', url: BASE_URL },
    mainEntityOfPage: `${BASE_URL}/${locale}/blog/${slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'da' ? 'Forside' : 'Home',
        item: `${BASE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/${locale}/blog`,
      },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  }

  return (
    <main className="container mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-orange-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          {t('backToBlog')}
        </Link>

        <time
          dateTime={post.publishedAt}
          className="block text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4"
        >
          {new Date(post.publishedAt).toLocaleDateString(
            locale === 'da' ? 'da-DK' : 'en-GB',
            { day: 'numeric', month: 'long', year: 'numeric' },
          )}
        </time>
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter italic font-serif mb-6">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground font-light italic mb-10">
          {excerpt}
        </p>

        {post.mainImage && (
          <div className="relative aspect-video overflow-hidden rounded-4xl border-4 border-white shadow-xl bg-white mb-12">
            <Image
              src={imageUrl(post.mainImage).width(1600).url()}
              alt={post.mainImage.alt ?? title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-orange-600">
          {Array.isArray(body) && (
            <PortableText
              value={body}
              components={blogPortableTextComponents}
            />
          )}
        </div>
      </article>
    </main>
  )
}

export default BlogPostPage

export async function generateStaticParams() {
  const { client } = await import('@src/sanity/lib/client')

  const POSTS_QUERY = `*[_type == "post" && publishedAt <= now()] { slug }`
  const posts = await client.fetch(POSTS_QUERY)

  const params: Array<{ locale: string; slug: string }> = []
  for (const post of posts) {
    const enSlug = getLocalizedSlug(post.slug, 'en')
    const daSlug = getLocalizedSlug(post.slug, 'da')
    if (enSlug) params.push({ locale: 'en', slug: enSlug })
    if (daSlug) params.push({ locale: 'da', slug: daSlug })
  }
  return params
}
