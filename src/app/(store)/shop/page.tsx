import { getAllCategories } from '@sanity/lib/products/getAllCategories'
import { getAllProducts } from '@sanity/lib/products/getAllProducts'
import BlackFridayBanner from '@src/components/BlackFridayBanner'
import ProductsView from '@src/components/ProductsView'

export const dynamic = 'force-static'
export const revalidate = 60

export default async function ShopPage() {
  const products = await getAllProducts()
  const categories = await getAllCategories()

  return (
    <div>
      <BlackFridayBanner />
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  )
}
