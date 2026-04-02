import { imageUrl } from '@src/lib/imageUrl'
import { ArrowUpRight, Layers, Scissors } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from 'sanity.types'

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0
  const isPattern = product.categories?.some((c) =>
    (c as any).title?.toLowerCase().includes('pattern'),
  )

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className="group relative flex flex-col w-full"
    >
      <div className="relative aspect-3/4 w-full mb-6">
        {/* Background "Pattern Paper" Layer */}
        <div
          className={`absolute inset-0 rounded-[2.5rem] rotate-1 group-hover:rotate-2 transition-transform duration-500 -z-10
          ${isPattern ? 'bg-secondary/10 border border-dashed border-secondary/20' : 'bg-orange-500/5'}
        `}
        />

        <div
          className={`relative h-full w-full overflow-hidden rounded-[2.5rem] border-2 border-border bg-white shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 ${isOutOfStock ? 'grayscale' : ''}`}
        >
          {product.image && (
            <Image
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              src={imageUrl(product.image).url()}
              alt={product.name || 'Product'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {product.categories?.slice(0, 1).map((cat: any) => (
              <span
                key={cat._ref}
                className="bg-white/90 backdrop-blur-md border border-border px-3 py-1 rounded-full flex items-center gap-2 shadow-sm scale-90 origin-left uppercase text-[8px] font-black tracking-widest"
              >
                {isPattern ? (
                  <Layers className="w-3 h-3 text-secondary" />
                ) : (
                  <Scissors className="w-3 h-3 text-orange-500" />
                )}
                {cat.title}
              </span>
            ))}
          </div>

          <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div
              className={`p-3 rounded-full shadow-xl ${isPattern ? 'bg-secondary' : 'bg-orange-500'} text-white`}
            >
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span className="bg-white text-black px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest rotate-3">
                Archived
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-2 space-y-1">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-black tracking-tighter leading-tight group-hover:text-orange-500 transition-colors uppercase max-w-[70%]">
            {product.name}
          </h2>
          <p className="text-lg font-mono font-bold tracking-tighter">
            {product.price?.toFixed(2)} kr.
          </p>
        </div>

        <div className="flex items-center gap-2 opacity-60">
          <div
            className={`w-1 h-1 rounded-full ${isPattern ? 'bg-secondary' : 'bg-orange-500'}`}
          />
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            {isPattern ? 'Digital Download' : 'Physical Drop'}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ProductThumb
