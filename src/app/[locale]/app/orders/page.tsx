import { auth } from '@clerk/nextjs/server'
import { getMyOrders } from '@sanity/lib/orders/getMyOrders'
import { formatCurrency } from '@src/lib/formatCurrency'
import { imageUrl } from '@src/lib/imageUrl'
import { Clock, Download, MapPin, Receipt, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export const dynamic = 'force-dynamic'

async function Orders({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('pages.orders')

  const { userId } = await auth()
  if (!userId) return redirect(`/${locale}`)

  const orders = await getMyOrders(userId, locale)

  return (
    <main className="w-full overflow-x-clip min-h-screen pb-20">
      <div className="container mx-auto px-6 pt-24">
        <header className="mb-16 relative">
          <div className="bg-orange-500 text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 border-2 border-white mb-8 w-fit">
            {t('tag')}
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
            {t('title')}{' '}
            <span className="text-secondary italic font-serif">
              {t('titleItalic')}
            </span>
          </h1>
          <p className="text-muted-foreground font-light italic uppercase tracking-[0.2em] text-[10px]">
            {t('subtitle')}
          </p>
        </header>

        {orders.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem]">
            <p className="text-xl font-serif italic text-muted-foreground">
              {t('empty')}
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {orders.map((order: Record<string, any>) => (
              <div key={order.orderNumber} className="relative group">
                <div className="absolute -top-4 -right-4 w-full h-full bg-orange-500/5 rounded-[3rem] rotate-1 border-2 border-dashed border-orange-500/10 -z-10 group-hover:rotate-2 transition-transform duration-500" />

                <div className="bg-white border-2 border-border rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="bg-card/50 p-6 lg:p-10 border-b-2 border-border flex flex-col lg:flex-row justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4">
                        <span
                          className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                            order.status === 'paid'
                              ? 'bg-secondary text-white border-white shadow-md'
                              : 'bg-card border-border text-muted-foreground'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
                          {t('logReference')}
                        </p>
                        <p className="font-mono text-sm font-bold text-orange-500 tracking-tighter uppercase">
                          {order.orderNumber}
                        </p>
                      </div>
                    </div>

                    <div className="lg:text-right flex flex-col justify-end">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
                        {t('totalValuation')}
                      </p>
                      <p className="text-4xl font-black tracking-tighter">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                      {order.amountDiscount ? (
                        <div className="inline-flex items-center lg:justify-end gap-2 text-secondary text-[10px] font-black uppercase mt-2">
                          <Sparkles className="w-3 h-3" />{' '}
                          {t('discountApplied')}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-6 lg:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        ...(order.products ?? []).map(
                          (item: Record<string, any>) => ({
                            type: 'product',
                            product: item.product,
                            quantity: item.quantity,
                          }),
                        ),
                        ...(order.workshops ?? []).map(
                          (workshop: Record<string, any>) => ({
                            type: 'workshop',
                            product: workshop,
                            quantity: 1,
                          }),
                        ),
                      ].map((item: Record<string, any>) => {
                        const displayName =
                          item.product?.name ?? item.product?.title ?? 'Item'
                        const slug = item.product?.slug ?? ''
                        const href =
                          item.product?._type === 'workshop'
                            ? `/${locale}/workshops/${slug}`
                            : `/${locale}/product/${slug}`
                        const linePrice =
                          item.product?.price != null && item.quantity != null
                            ? formatCurrency(
                                (item.product.price ?? 0) * item.quantity,
                                order.currency,
                              )
                            : null

                        return (
                          <div
                            key={item.product?._id}
                            className="flex gap-6 items-center group/item"
                          >
                            {item.product?.image && (
                              <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden border border-border group-hover/item:rotate-3 transition-transform">
                                <Image
                                  src={imageUrl(item.product.image).url()}
                                  alt={
                                    typeof displayName === 'string'
                                      ? displayName
                                      : ''
                                  }
                                  className="object-cover"
                                  fill
                                />
                              </div>
                            )}
                            <div className="space-y-1">
                              <Link
                                href={href}
                                className="text-sm font-black uppercase tracking-tight hover:text-orange-500 transition-colors"
                              >
                                {typeof displayName === 'string'
                                  ? displayName
                                  : 'Item'}
                              </Link>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                {t('quantity')}: {item.quantity ?? '0'}
                              </p>
                              {linePrice !== null && (
                                <p className="font-mono text-xs font-bold text-foreground/70">
                                  {linePrice}
                                </p>
                              )}
                              {item.product?.productType === 'digital' &&
                                item.product?._id && (
                                  <a
                                    href={`/api/download/${item.product._id}`}
                                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-secondary/70 transition-colors mt-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    {t('download')}
                                  </a>
                                )}
                              {item.product?._type === 'workshop' && (
                                <div className="mt-1 space-y-0.5">
                                  {item.product?.date && (
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                      {new Date(
                                        item.product.date,
                                      ).toLocaleDateString('da-DK', {
                                        dateStyle: 'long',
                                      })}
                                    </p>
                                  )}
                                  {item.product?.location && (
                                    <p className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                      <MapPin className="w-3 h-3 shrink-0" />
                                      {item.product.location}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-foreground py-3 px-10 flex justify-between items-center">
                    <span className="text-white text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                      <Receipt className="w-3 h-3 text-orange-500" />{' '}
                      {t('receiptGenerated')}
                    </span>
                    <span className="text-white/40 text-[9px] font-mono">
                      {t('studioLog')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Orders
