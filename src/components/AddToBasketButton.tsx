'use client'

import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '../../sanity.types'
import useBasketStore from '../../store/store'

interface AddToBasketButtonProps {
  product: Product
  disabled?: boolean
}

const AddToBasketButton = ({ product, disabled }: AddToBasketButtonProps) => {
  const addItem = useBasketStore((state) => state.addItem)

  const [quantity, setQuantity] = useState(1)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="w-48 h-10 animate-pulse bg-gray-100 rounded-full" />
  }

  const totalStock = product.stock ?? 0
  const isAtMaxStock = totalStock > 0 && quantity >= totalStock

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Quantity counter */}
      <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-full shadow-sm">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
            ${
              quantity <= 1
                ? 'opacity-30 cursor-not-allowed grayscale'
                : 'bg-background hover:bg-orange-500 hover:text-white border border-border shadow-sm active:scale-90'
            }`}
          disabled={quantity <= 1 || disabled}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex flex-col items-center leading-none px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
            Qty
          </span>
          <div className="flex items-baseline gap-1 font-black tabular-nums tracking-tighter">
            <span className="text-orange-500 text-sm">{quantity}</span>
            <span className="text-muted-foreground/40 text-[10px]">/</span>
            <span className="text-muted-foreground text-xs">{totalStock}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(totalStock, q + 1))}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
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

      {/* Add to Cart button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-200 shadow-sm
          ${
            disabled
              ? 'bg-gray-100 text-muted-foreground cursor-not-allowed opacity-50'
              : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-orange-500/20 shadow-md'
          }`}
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Add to Cart
      </button>
    </div>
  )
}

export default AddToBasketButton
