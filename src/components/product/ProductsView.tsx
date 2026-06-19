'use client'

import ProductGrid from '@src/components/product/ProductGrid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import type { Category, Product } from 'sanity.types'

interface ProductsViewProps {
  products: Product[]
  categories: Category[]
}

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

type SortableProduct = Product & {
  sortWeight?: number
  salesCount?: number
  _createdAt?: string
}

const SORTS: Record<
  string,
  (a: SortableProduct, b: SortableProduct) => number
> = {
  featured: (a, b) => (b.sortWeight ?? 0) - (a.sortWeight ?? 0),
  priceAsc: (a, b) => (a.price ?? 0) - (b.price ?? 0),
  priceDesc: (a, b) => (b.price ?? 0) - (a.price ?? 0),
  newest: (a, b) => +new Date(b._createdAt ?? 0) - +new Date(a._createdAt ?? 0),
  popularity: (a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0),
}

const DEFAULT_SORT = 'featured'

const ProductsView = ({ products, categories }: ProductsViewProps) => {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCategory = searchParams.get('category')
  const activeDifficulty = searchParams.get('difficulty') ?? ''
  const activeSort = searchParams.get('sort') ?? DEFAULT_SORT

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router, searchParams],
  )

  const filteredProducts = (products as SortableProduct[]).filter((p) => {
    const matchesCategory =
      !activeCategory ||
      p.categories?.some(
        (cat: any) =>
          cat._ref === activeCategory || (cat as any)._id === activeCategory,
      )
    const matchesDifficulty =
      !activeDifficulty || (p as any).difficulty === activeDifficulty
    return matchesCategory && matchesDifficulty
  })

  const compare = SORTS[activeSort] ?? SORTS[DEFAULT_SORT]
  const visibleProducts = [...filteredProducts].sort(compare)

  return (
    <div className="flex flex-col space-y-8">
      {/* --- Category Sticker Nav --- */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={() => setParam('category', '')}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
              ${
                !activeCategory
                  ? 'bg-orange-500 text-white shadow-lg -rotate-2 scale-105'
                  : 'bg-card border border-border text-muted-foreground hover:border-orange-500'
              }`}
          >
            {t('patterns.categories.allPieces')}
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category._id}
              onClick={() => setParam('category', category._id)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                ${
                  activeCategory === category._id
                    ? 'bg-secondary text-white shadow-lg rotate-1 scale-105'
                    : 'bg-card border border-border text-muted-foreground hover:border-secondary'
                }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      )}

      {/* --- Filter / Sort Toolbar (extensible) --- */}
      <div className="flex flex-wrap gap-4 items-center">
        <ToolbarSelect
          label={t('patterns.difficulty.label')}
          value={activeDifficulty}
          onChange={(v) => setParam('difficulty', v)}
          placeholder={t('patterns.difficulty.all')}
          options={DIFFICULTY_LEVELS.map((level) => ({
            value: level,
            label: t(`patterns.difficulty.${level}`),
          }))}
        />
        <ToolbarSelect
          label={t('patterns.sort.label')}
          value={activeSort}
          onChange={(v) => setParam('sort', v === DEFAULT_SORT ? '' : v)}
          options={Object.keys(SORTS).map((key) => ({
            value: key,
            label: t(`patterns.sort.${key}`),
          }))}
        />
        {/* Future filters/sorts: add more <ToolbarSelect /> here */}
      </div>

      {/* --- Grid View --- */}
      <div className="min-h-100 pt-4">
        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} />
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem]">
            <p className="text-sm font-serif italic text-muted-foreground">
              {t('shop.noPieces')}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-12">
        <div className="w-1/3 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>
    </div>
  )
}

interface ToolbarSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  /** Optional empty/"all" option rendered first. */
  placeholder?: string
}

const ToolbarSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}: ToolbarSelectProps) => (
  <label className="flex items-center gap-2">
    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-card border border-border rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-foreground transition-all focus:outline-none focus:border-foreground"
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
)

export default ProductsView
