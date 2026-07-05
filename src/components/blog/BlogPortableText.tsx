import { imageUrl } from '@src/lib/imageUrl'
import Image from 'next/image'
import type { PortableTextComponents } from 'next-sanity'

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  return match?.[1] ?? null
}

export const blogPortableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="my-8">
          <Image
            src={imageUrl(value).width(1200).url()}
            alt={value.alt ?? ''}
            width={1200}
            height={800}
            className="w-full h-auto rounded-3xl"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
              {value.alt}
            </figcaption>
          )}
        </figure>
      ) : null,
    youtube: ({ value }) => {
      const id = value?.url ? getYouTubeId(value.url) : null
      if (!id) return null
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-3xl shadow-lg">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={value.caption ?? 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-orange-500 underline-offset-4 hover:text-orange-500 transition-colors"
      >
        {children}
      </a>
    ),
  },
}
