import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllCategories } from '@sanity/lib/products/getAllCategories'
import { getDigitalProducts } from '@sanity/lib/products/getDigitalProducts'
import { locales } from '@src/i18n'
import DiscountBanner from '@src/components/product/DiscountBanner'
import LocalizedProductsView from '@src/components/product/LocalizedProductsView'
import { FileText, Monitor, Zap } from 'lucide-react'

export const revalidate = 3600

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const PatternsShopPage = async () => {
  const locale = await getLocale()
  setRequestLocale(locale)
  
  const t = await getTranslations()
  const products = await getDigitalProducts()
  const categories = await getAllCategories()

  return (
    <main className="min-h-screen pb-32">
      <DiscountBanner />

      <div className="container mx-auto px-6 pt-12">
        <header className="mb-16 relative">
          <div className="inline-flex items-center gap-2 mb-4 bg-secondary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest -rotate-2 shadow-lg">
            <Zap className="w-3 h-3 fill-white" /> {t('patterns.instantDownload')}
          </div>

          <h1 className="text-6xl lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-6">
            {t('patterns.title')} <br />
            <span className="text-orange-500 italic font-serif">{t('patterns.titleItalic')}</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mt-8">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <FileText className="w-4 h-4 text-orange-500" /> {t('patterns.features.pdf')}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Monitor className="w-4 h-4 text-orange-500" /> {t('patterns.features.projector')}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Zap className="w-4 h-4 text-orange-500" /> {t('patterns.features.lifetime')}
            </div>
          </div>
        </header>

        <LocalizedProductsView products={products} categories={categories} />
      </div>
    </main>
  )
}

export default PatternsShopPage
