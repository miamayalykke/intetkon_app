'use client'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product } from 'sanity.types'
import ProductThumb from './ProductThumb'

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mt-4">
      <AnimatePresence mode="popLayout">
        {products?.map((product) => (
          <motion.div
            key={product._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex justify-center"
          >
            <ProductThumb product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ProductGrid
