'use client'

import { cn } from '@src/lib/utils' // Assuming you have a cn utility
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@ui/navigation-menu'
import Link from 'next/link'
import type { ComponentProps } from 'react'

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  const shopLinks = [
    { href: '/patterns', label: 'Patterns' },
    { href: '/workshops', label: 'Workshops' },
    { href: '/shop', label: 'Shop All' },
  ]

  const infoLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
  ]

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="flex gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:w-full">
        {/* Commercial Section */}
        {shopLinks.map((link) => (
          <NavigationMenuItem
            key={link.href}
            className="data-[orientation=vertical]:w-full"
          >
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  'font-bold text-foreground transition-all',
                  'hover:bg-primary/10 hover:text-primary',
                  'lg:bg-transparent border border-primary lg:rounded-full lg:px-5 lg:mx-0.5',
                  'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
                )}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        {/* Separator Dot (Only visible on desktop) */}
        <div className="hidden lg:flex items-center px-2 opacity-20">•</div>

        {/* Info Section */}
        {infoLinks.map((link) => (
          <NavigationMenuItem
            key={link.href}
            className="data-[orientation=vertical]:w-full"
          >
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  'text-muted-foreground font-medium bg-transparent hover:text-foreground',
                  'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
                )}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
