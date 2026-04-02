import { getProductBySlug } from '@sanity/lib/products/getProductBySlug'
import AddToCartButton from '@src/components/AddToCartButton'
import { imageUrl } from '@src/lib/imageUrl'
import { ArrowLeft, Info, Ruler, Scissors, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'

export const dynamic = 'force-static'
export const revalidate = 60

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const isOutOfStock = product.stock != null && product.stock <= 0

  return (
    <main className="w-full overflow-x-clip min-h-screen pt-4 pb-12 lg:pt-8">
      <div className="container mx-auto px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-orange-500 transition-colors mb-6 lg:mb-8 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Atelier
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="relative lg:sticky lg:top-24">
            <div className="absolute -top-4 -right-4 w-full h-full bg-orange-500/5 rounded-[3rem] rotate-2 border-2 border-dashed border-orange-500/20 -z-10" />

            {/* Changed aspect-4/5 to aspect-square to save vertical space */}
            <div
              className={`relative aspect-square overflow-hidden rounded-[2.5rem] shadow-xl border-4 lg:border-8 border-white bg-white ${isOutOfStock ? 'grayscale' : ''}`}
            >
              {product.image && (
                <Image
                  src={imageUrl(product.image).url()}
                  alt={product.name ?? 'Product image'}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              )}

              {/* Status Stickers (Scaled Down) */}
              <div
                className={`absolute top-4 right-4 px-4 py-1.5 rounded-full font-bold text-[9px] uppercase tracking-widest shadow-lg ${
                  isOutOfStock
                    ? 'bg-foreground text-white rotate-3'
                    : 'bg-secondary text-white -rotate-6 border-2 border-white'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : 'Limited Edition'}
              </div>
            </div>
          </div>

          {/* --- Right Column: Condensed Info --- */}
          <div className="flex flex-col space-y-6 lg:space-y-8">
            {/* Title & Price (Reduced Scaling) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase tracking-[0.4em]">
                <Sparkles className="w-3 h-3" /> New Drop
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
                {product.name?.split(' ').slice(0, -1).join(' ')} <br />
                <span className="text-orange-500 italic font-serif">
                  {product.name?.split(' ').pop()}
                </span>
              </h1>
              <div className="text-3xl font-black tracking-tighter text-foreground/90">
                {product.price?.toFixed(2)} kr.
              </div>
            </div>

            {/* Description (Reduced padding/spacing) */}
            <div className="prose prose-sm prose-orange max-w-none text-muted-foreground font-light leading-relaxed italic border-l-2 border-orange-500/20 pl-4">
              {Array.isArray(product.description) && (
                <PortableText value={product.description} />
              )}
            </div>

            {/* Action Area (Tightened) */}
            <div className="pt-4 border-t border-border">
              <div className="flex flex-col gap-3">
                <div className="origin-left">
                  <AddToCartButton
                    product={product}
                    disabled={isOutOfStock}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" /> Secure Checkout & Worldwide
                  Shipping
                </p>
              </div>
            </div>

            {/* Technical Specs (Smaller padding) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-3xl bg-card border border-border flex items-center gap-4">
                <Scissors className="w-4 h-4 text-secondary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                    Craft
                  </p>
                  <p className="text-[10px] font-bold truncate">
                    Gender-Neutral
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-card border border-border flex items-center gap-4">
                <Ruler className="w-4 h-4 text-orange-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                    Format
                  </p>
                  <p className="text-[10px] font-bold truncate">Layered PDF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor (Smaller Scissors) */}
      <div className="absolute top-1/2 right-0 -z-10 opacity-5 pointer-events-none translate-x-1/2">
        <Scissors className="w-80 h-80 -rotate-12 text-secondary" />
      </div>
    </main>
  )
}

export default ProductPage
