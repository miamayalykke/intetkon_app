import { getAllCategories } from '@sanity/lib/products/getAllCategories'
import { getAllProducts } from '@sanity/lib/products/getAllProducts'
import DiscountBanner from '@src/components/product/DiscountBanner'
import ProductsView from '@src/components/product/ProductsView'

export const dynamic = 'force-static'
export const revalidate = 60

const ShopPage = async () => {
  const products = await getAllProducts()
  const categories = await getAllCategories()

  return (
    <main className="min-h-screen pb-32">
      <DiscountBanner />

      <div className="container mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
            THE{' '}
            <span className="text-orange-500 italic font-serif">ATELIER</span>
          </h1>
          <p className="text-muted-foreground font-light italic mt-4 uppercase tracking-[0.2em] text-xs">
            Hand-picked physical products & limited items
          </p>
        </header>

        <ProductsView products={products} categories={categories} />
      </div>
    </main>
  )
}

export default ShopPage
