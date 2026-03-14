'use client'

import ProductGrid from '@src/components/product/ProductGrid'
import { useState } from 'react'
import type { Category, Product } from 'sanity.types'

interface ProductsViewProps {
  products: Product[]
  categories: Category[]
}

const ProductsView = ({ products, categories }: ProductsViewProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredProducts = activeCategory
    ? products.filter((p) =>
        p.categories?.some(
          (cat: any) =>
            cat._ref === activeCategory || (cat as any)._id === activeCategory,
        ),
      )
    : products

  return (
    <div className="flex flex-col space-y-12">
      {/* --- Category Sticker Nav --- */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
              ${
                !activeCategory
                  ? 'bg-orange-500 text-white shadow-lg -rotate-2 scale-105'
                  : 'bg-card border border-border text-muted-foreground hover:border-orange-500'
              }`}
          >
            All Pieces
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
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

      {/* --- Grid View --- */}
      <div className="min-h-100">
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem]">
            <p className="text-sm font-serif italic text-muted-foreground">
              No pieces found in this collection...
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

export default ProductsView
