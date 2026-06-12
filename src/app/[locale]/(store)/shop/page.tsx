import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllCategories } from '@sanity/lib/products/getAllCategories'
import { getPhysicalProducts } from '@sanity/lib/products/getPhysicalProducts'
import { locales } from '@src/i18n'
import DiscountBanner from '@src/components/product/DiscountBanner'
import LocalizedProductsView from '@src/components/product/LocalizedProductsView'

export const revalidate = 3600

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const ShopPage = async () => {
  const locale = await getLocale()
  setRequestLocale(locale)
  
  const t = await getTranslations()
  const products = await getPhysicalProducts()
  const categories = await getAllCategories()

  return (
    <main className="min-h-screen pb-32">
      <DiscountBanner />

      <div className="container mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none">
            {t('shop.title')}{' '}
            <span className="text-orange-500 italic font-serif">{t('shop.titleItalic')}</span>
          </h1>
          <p className="text-muted-foreground font-light italic mt-4 uppercase tracking-[0.2em] text-xs">
            {t('shop.subtitle')}
          </p>
        </header>

        <LocalizedProductsView products={products} categories={categories} />
      </div>
    </main>
  )
}

export default ShopPage
