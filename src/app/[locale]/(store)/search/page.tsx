'use client'

import { searchProductsByName } from '@sanity/lib/products/searchProductsByName'
import ProductGrid from '@src/components/product/ProductGrid'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([])
        setLoading(false)
        return
      }
      const result = await searchProductsByName(query)
      setProducts(result || [])
      setLoading(false)
    }

    fetchProducts()
  }, [query])

  if (loading) {
    return (
      <main className="min-h-screen pb-32">
        <div className="container mx-auto px-6 pt-12">
          <p className="text-center text-muted-foreground">
            {t('shop.loading')}
          </p>
        </div>
      </main>
    )
  }

  if (!products.length) {
    return (
      <main className="min-h-screen pb-32">
        <div className="container mx-auto px-6 pt-12">
          <header className="mb-12 text-center">
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
              {t('shop.noResults')}
            </h1>
            <p className="text-muted-foreground font-light italic mt-4 uppercase tracking-[0.2em] text-xs">
              {t('shop.tryDifferent')}
            </p>
          </header>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-32">
      <div className="container mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
            {t('shop.resultsFor')}: <span className="text-orange-500">{query}</span>
          </h1>
        </header>

        <ProductGrid products={products} />
      </div>
    </main>
  )
}
