'use client'

import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '../../sanity.types'
import useBasketStore from '../../store/store'

interface AddToBasketButtonProps {
  product: Product
  disabled?: boolean
}

const AddToBasketButton = ({ product, disabled }: AddToBasketButtonProps) => {
  const itemCount = useBasketStore((state) => state.getItemCount(product._id))
  const addItem = useBasketStore((state) => state.addItem)
  const removeItem = useBasketStore((state) => state.removeItem)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="w-32 h-10 animate-pulse bg-gray-100 rounded-full" />
  }

  // Stock logic
  const totalStock = product.stock ?? 0
  const isAtMaxStock = totalStock > 0 && itemCount >= totalStock

  return (
    <div className="flex items-center gap-4 bg-card border border-border p-1.5 pr-4 rounded-full shadow-sm w-fit">
      <div className="flex items-center gap-2">
        {/* --- Decrease Button --- */}
        <button
          type="button"
          onClick={() => removeItem(product._id)}
          className={`group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 
            ${
              itemCount === 0
                ? 'opacity-30 cursor-not-allowed grayscale'
                : 'bg-background hover:bg-orange-500 hover:text-white border border-border shadow-sm active:scale-90'
            }`}
          disabled={itemCount === 0 || disabled}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* --- Increase Button --- */}
        <button
          type="button"
          onClick={() => addItem(product)}
          className={`group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 
            ${
              disabled || isAtMaxStock
                ? 'bg-gray-100 cursor-not-allowed opacity-50'
                : 'bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 active:scale-95'
            }`}
          disabled={disabled || isAtMaxStock}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* --- Fractional Counter --- */}
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
          Quantity
        </span>
        <div className="flex items-baseline gap-1 font-black tabular-nums tracking-tighter">
          <span
            className={
              itemCount > 0
                ? 'text-orange-500 text-sm'
                : 'text-foreground text-sm'
            }
          >
            {itemCount}
          </span>
          <span className="text-muted-foreground/40 text-[10px]">/</span>
          <span className="text-muted-foreground text-xs">{totalStock}</span>
        </div>
      </div>

      {/* Visual Indicator for max stock */}
      {isAtMaxStock && (
        <div className="hidden lg:block ml-2 px-2 py-0.5 bg-foreground text-white text-[8px] font-bold rounded uppercase tracking-tighter">
          Max
        </div>
      )}
    </div>
  )
}

export default AddToBasketButton
