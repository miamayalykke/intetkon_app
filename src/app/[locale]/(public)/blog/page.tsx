import { getAllPosts } from '@sanity/lib/posts/getAllPosts'
import { imageUrl } from '@src/lib/imageUrl'
import { staticPageMetadata } from '@src/lib/seo'
import { getLocalizedSlug } from '@src/lib/slug-helpers'
import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return staticPageMetadata(locale, '/blog', {
    en: {
      title: 'Blog — sewing tutorials & guides',
      description:
        'Free sewing tutorials, guides and behind-the-scenes stories from the Intetkøn atelier.',
    },
    da: {
      title: 'Blog — syguides & tutorials',
      description:
        'Gratis syguides, tutorials og behind-the-scenes fra Intetkøns atelier. Lær at sy med vores guides.',
    },
  })
}

const BlogPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const posts = await getAllPosts()
  const t = await getTranslations('blog')

  return (
    <main className="container mx-auto px-6 py-16">
      <h1 className="text-5xl lg:text-7xl font-black tracking-tighter italic font-serif mb-4">
        {t('title')}
      </h1>
      <p className="text-muted-foreground font-light italic mb-16 max-w-xl">
        {t('subtitle')}
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground italic py-24 text-center">
          {t('empty')}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => {
            const slug = getLocalizedSlug(post.slug, locale)
            const title = getLocalizedField<string>(post.title, locale)
            const excerpt = getLocalizedField<string>(post.excerpt, locale)
            if (!slug) return null
            return (
              <Link
                key={post._id}
                href={`/${locale}/blog/${slug}`}
                className="group block"
              >
                <article>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-white shadow-lg bg-white mb-5">
                    {post.mainImage && (
                      <Image
                        src={imageUrl(post.mainImage)
                          .width(800)
                          .height(600)
                          .url()}
                        alt={post.mainImage.alt ?? title ?? ''}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <time
                    dateTime={post.publishedAt}
                    className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground"
                  >
                    {new Date(post.publishedAt).toLocaleDateString(
                      locale === 'da' ? 'da-DK' : 'en-GB',
                      { day: 'numeric', month: 'long', year: 'numeric' },
                    )}
                  </time>
                  <h2 className="text-2xl font-black tracking-tight mt-2 mb-2 group-hover:text-orange-500 transition-colors">
                    {title}
                  </h2>
                  <p className="text-muted-foreground font-light line-clamp-3">
                    {excerpt}
                  </p>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default BlogPage
