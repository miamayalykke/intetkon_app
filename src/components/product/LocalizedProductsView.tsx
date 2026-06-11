import { getLocale } from 'next-intl/server'

import { getLocalizedField } from '@src/sanity/lib/utils/getLocalizedFields'

import ProductsView from './ProductsView'

interface LocalizedProduct {
  _id: string
  [key: string]: any
}

export default async function LocalizedProductsView({
  products,
  categories,
}: {
  products: LocalizedProduct[]
  categories: any[]
}) {
  const locale = await getLocale()

  // Extract localized fields from products
  const localizedProducts = products.map((product: any) => {
    const name = getLocalizedField(product.name, locale)
    const slug = getLocalizedField(product.slug, locale)
    const description = getLocalizedField(product.description, locale)

    return {
      ...product,
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description && { description }),
    } as any
  })

  // Extract localized fields from categories
  const localizedCategories = categories.map((category: any) => {
    const title = getLocalizedField(category.title, locale)
    const slug = getLocalizedField(category.slug, locale)
    const description = getLocalizedField(category.description, locale)

    return {
      ...category,
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description && { description }),
    } as any
  })

  return <ProductsView products={localizedProducts} categories={localizedCategories} />
}
