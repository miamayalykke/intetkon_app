import { COUPON_CODES } from '@sanity/lib/sales/couponCodes'
import { getActiveSaleByCouponCode } from '@sanity/lib/sales/getActiveSaleByCouponCode'
import { Sparkles, Ticket } from 'lucide-react'

const DiscountBanner = async () => {
  const sale = await getActiveSaleByCouponCode(COUPON_CODES.BFRIDAY)

  if (!sale?.isActive) return null

  return (
    <section className="relative w-full py-12 px-6 overflow-hidden bg-orange-500">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div className="space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest -rotate-2">
            <Sparkles className="w-3 h-3 text-orange-500" /> {sale.title}
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none uppercase">
            {sale.description}
          </h2>
        </div>

        <div className="relative group">
          {/* Decorative "Tape" effect */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/20 backdrop-blur-sm -rotate-3 z-20" />

          <div className="bg-white text-black p-8 rounded-4xl shadow-2xl flex flex-col items-center gap-2 rotate-2 transition-transform group-hover:rotate-0">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
              Use Code
            </span>
            <div className="flex items-center gap-3">
              <Ticket className="w-6 h-6 text-orange-500" />
              <span className="text-4xl font-black tracking-tighter">
                {sale.couponCode}
              </span>
            </div>
            <div className="mt-2 px-4 py-1 bg-secondary text-white text-[10px] font-black rounded-full uppercase">
              Save {sale.discountAmount}% OFF
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 text-white/10 font-black text-[20rem] leading-none pointer-events-none select-none translate-x-1/4">
        SALE
      </div>
    </section>
  )
}

export default DiscountBanner
