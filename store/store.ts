import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, WORKSHOP_BY_SLUG_QUERYResult } from '../sanity.types'

export type WorkshopCartData = NonNullable<WORKSHOP_BY_SLUG_QUERYResult>

export type CartProductItem = {
  itemType: 'product'
  data: Product
  quantity: number
}

export type CartWorkshopItem = {
  itemType: 'workshop'
  data: WorkshopCartData
  quantity: number
}

export type CartItem = CartProductItem | CartWorkshopItem

// Kept for backwards compat
export interface BasketItem {
  product: Product
  quantity: number
}

interface BasketState {
  items: CartItem[]
  addItem: (product: Product) => void
  addWorkshop: (workshop: WorkshopCartData) => void
  removeItem: (id: string) => void
  clearBasket: () => void
  getTotalPrice: () => number
  getItemCount: (id: string) => number
  getGroupedItems: () => CartItem[]
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.data._id === product._id,
          )

          if (existingIndex > -1) {
            const existing = state.items[existingIndex]
            if (existing.itemType !== 'product') return state
            const currentQty = existing.quantity
            if (
              product.stock !== null &&
              product.stock !== undefined &&
              currentQty >= product.stock
            ) {
              return state
            }
            const newItems = [...state.items]
            newItems[existingIndex] = { ...existing, quantity: currentQty + 1 }
            return { items: newItems }
          }

          return {
            items: [...state.items, { itemType: 'product', data: product, quantity: 1 }],
          }
        }),

      addWorkshop: (workshop) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.data._id === workshop._id,
          )

          if (existingIndex > -1) {
            const existing = state.items[existingIndex]
            if (existing.itemType !== 'workshop') return state
            const currentQty = existing.quantity
            const spotsLeft =
              (workshop.maxAllocation ?? 0) - (workshop.currentSignUps ?? 0)
            if (currentQty >= spotsLeft) return state
            const newItems = [...state.items]
            newItems[existingIndex] = { ...existing, quantity: currentQty + 1 }
            return { items: newItems }
          }

          return {
            items: [...state.items, { itemType: 'workshop', data: workshop, quantity: 1 }],
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.data._id === id) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 })
              }
            } else {
              acc.push(item)
            }
            return acc
          }, [] as CartItem[]),
        })),

      clearBasket: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.data.price ?? 0) * item.quantity,
          0,
        ),

      getItemCount: (id) => {
        const item = get().items.find((i) => i.data._id === id)
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
