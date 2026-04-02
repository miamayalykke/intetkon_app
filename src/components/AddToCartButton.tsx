'use client'

import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '../../sanity.types'
import useBasketStore from '../../store/store'

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

const AddToCartButton = ({ product, disabled }: AddToCartButtonProps) => {
  const addItem = useBasketStore((state) => state.addItem)
  const itemCount = useBasketStore((state) => state.getItemCount(product._id))
  const [quantity, setQuantity] = useState(1)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="w-64 h-12 animate-pulse bg-muted rounded-full" />
  }

  const totalStock = product.stock ?? 0
  const availableToAdd = totalStock > 0 ? totalStock - itemCount : Infinity
  const isAtMaxStock = availableToAdd <= 0
  const isDisabled = disabled || isAtMaxStock

  const handleAddToCart = () => {
    if (isDisabled) return
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setQuantity(1)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-4 bg-card border border-border p-1.5 pr-4 rounded-full shadow-sm w-fit">
        <div className="flex items-center gap-2">
          {/* Decrease */}
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${
                quantity <= 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-background hover:bg-orange-500 hover:text-white border border-border shadow-sm active:scale-90'
              }`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Increase */}
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(q + 1, availableToAdd === Infinity ? q + 1 : availableToAdd))}
            disabled={isDisabled || quantity >= availableToAdd}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${
                isDisabled || quantity >= availableToAdd
                  ? 'bg-gray-100 cursor-not-allowed opacity-50'
                  : 'bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 active:scale-95'
              }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Counter */}
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
            Quantity
          </span>
          <div className="flex items-baseline gap-1 font-black tabular-nums tracking-tighter">
            <span className="text-orange-500 text-sm">{quantity}</span>
            {totalStock > 0 && (
              <>
                <span className="text-muted-foreground/40 text-[10px]">/</span>
                <span className="text-muted-foreground text-xs">{totalStock}</span>
              </>
            )}
          </div>
        </div>

        {itemCount > 0 && (
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-l border-border pl-3">
            {itemCount} in bag
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`flex items-center gap-3 px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200
          ${
            isDisabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              : 'bg-foreground text-background hover:bg-orange-500 active:scale-95'
          }`}
      >
        <ShoppingBag className="w-4 h-4" />
        {isAtMaxStock ? 'Max Reached' : 'Add to Cart'}
      </button>
    </div>
  )
}

export default AddToCartButton
