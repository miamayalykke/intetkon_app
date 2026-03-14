'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@ui/sheet'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Logo from 'public/logo.svg'
import { useState } from 'react'
import { NavMenu } from './NavigationMenu'

export const NavigationSheet = () => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger asChild>
        <Button className="rounded-full" size="icon" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-6 py-3">
        <Image src={Logo} alt="Intetkon Logo" width={100} height={100} />
        <NavMenu
          className="mt-6 [&>div]:h-full"
          orientation="vertical"
          onLinkClick={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
