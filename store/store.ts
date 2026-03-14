import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../sanity.types'

export interface BasketItem {
  product: Product
  quantity: number
}

interface BasketState {
  items: BasketItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearBasket: () => void
  getTotalPrice: () => number
  getItemCount: (productId: string) => number
  getGroupedItems: () => BasketItem[]
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product._id === product._id,
          )

          if (existingItemIndex > -1) {
            const currentQuantity = state.items[existingItemIndex].quantity
            // Guard: Check if we have stock information and if we've reached the limit
            if (
              product.stock !== null &&
              product.stock !== undefined &&
              currentQuantity >= product.stock
            ) {
              return state // Do nothing if stock limit is reached
            }

            const newItems = [...state.items]
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: currentQuantity + 1,
            }
            return { items: newItems }
          }

          return { items: [...state.items, { product, quantity: 1 }] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 })
              }
              // If quantity is 1 and we remove, it doesn't get pushed to acc (removed)
            } else {
              acc.push(item)
            }
            return acc
          }, [] as BasketItem[]),
        })),

      clearBasket: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0,
        ),

      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId)
        return item ? item.quantity : 0
      },

      getGroupedItems: () => get().items,
    }),
    {
      name: 'basket-store',
      onRehydrateStorage: () => (_state) => {
        console.info('Basket Store Hydrated')
      },
    },
  ),
)

export default useBasketStore
