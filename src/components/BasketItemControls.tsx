'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CartItem } from '../../store/store'
import useBasketStore from '../../store/store'

interface BasketItemControlsProps {
  item: CartItem
}

const BasketItemControls = ({ item }: BasketItemControlsProps) => {
  const itemCount = useBasketStore((state) => state.getItemCount(item.data._id))
  const addItem = useBasketStore((state) => state.addItem)
  const addWorkshop = useBasketStore((state) => state.addWorkshop)
  const removeItem = useBasketStore((state) => state.removeItem)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="w-32 h-10 animate-pulse bg-gray-100 rounded-full" />
  }

  const isDigital =
    item.itemType === 'product' && item.data.productType === 'digital'

  const isAtMax =
    item.itemType === 'product'
      ? (item.data.stock ?? 0) > 0 && itemCount >= (item.data.stock ?? 0)
      : itemCount >= (item.data.maxAllocation ?? 0) - (item.data.currentSignUps ?? 0)

  const handleAdd = () => {
    if (item.itemType === 'product') addItem(item.data)
    else addWorkshop(item.data)
  }

  return (
    <div className="flex items-center gap-3">
      {!isDigital && (
        <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-full shadow-sm">
          <button
            type="button"
            onClick={() => removeItem(item.data._id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${
                itemCount === 0
                  ? 'opacity-30 cursor-not-allowed grayscale'
                  : 'bg-background hover:bg-orange-500 hover:text-white border border-border shadow-sm active:scale-90'
              }`}
            disabled={itemCount === 0}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-6 text-center text-sm font-black tabular-nums">
            {itemCount}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
              ${
                isAtMax
                  ? 'bg-gray-100 cursor-not-allowed opacity-50'
                  : 'bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 active:scale-95'
              }`}
            disabled={isAtMax}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          for (let i = 0; i < itemCount; i++) {
            removeItem(item.data._id)
          }
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center border border-border bg-background hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 active:scale-90"
        title="Remove item"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export default BasketItemControls
