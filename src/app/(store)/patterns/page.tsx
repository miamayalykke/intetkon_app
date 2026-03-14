import { getAllCategories } from '@sanity/lib/products/getAllCategories'
import { getAllProducts } from '@sanity/lib/products/getAllProducts'

import DiscountBanner from '@src/components/product/DiscountBanner'
import ProductsView from '@src/components/product/ProductsView'
import { FileText, Monitor, Zap } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = 60

const PatternsShopPage = async () => {
  // Assuming you have a way to filter for digital products/patterns
  // If not, you can filter the array here or via a custom Sanity query
  const allProducts = await getAllProducts()
  const categories = await getAllCategories()

  return (
    <main className="min-h-screen pb-32">
      <DiscountBanner />

      <div className="container mx-auto px-6 pt-12">
        <header className="mb-16 relative">
          <div className="inline-flex items-center gap-2 mb-4 bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest -rotate-2 shadow-lg">
            <Zap className="w-3 h-3 fill-white" /> Instant Download
          </div>

          <h1 className="text-6xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-6">
            DIGITAL <br />
            <span className="text-orange-500 italic font-serif">PATTERNS</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mt-8">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <FileText className="w-4 h-4 text-orange-500" /> A4 / US Letter
              PDF
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Monitor className="w-4 h-4 text-orange-500" /> Projector Files
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Zap className="w-4 h-4 text-orange-500" /> Lifetime Access
            </div>
          </div>
        </header>

        <ProductsView products={allProducts} categories={categories} />
      </div>
    </main>
  )
}

export default PatternsShopPage
