'use client'

import useBasketStore from 'store/store'

const HeaderBasketCount = () => {
  const count = useBasketStore((s) =>
    s.items.reduce((t, i) => t + i.quantity, 0),
  )

  return (
    count > 0 && (
      <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
        {count}
      </span>
    )
  )
}

export default HeaderBasketCount
