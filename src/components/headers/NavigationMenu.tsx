'use client'

import { cn } from '@src/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@ui/navigation-menu'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import type { ComponentProps } from 'react'

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  const t = useTranslations()
  const locale = useLocale()

  const shopLinks = [
    { href: `/${locale}/patterns`, label: t('navigation.patterns') },
    { href: `/${locale}/workshops`, label: t('navigation.workshops') },
    { href: `/${locale}/shop`, label: t('navigation.shopUniques') },
  ]

  const infoLinks = [
    { href: `/${locale}/about`, label: t('navigation.about') },
    { href: `/${locale}/contact`, label: t('navigation.contact') },
    { href: `/${locale}/pattern-testing`, label: t('navigation.becomePatternTester') },
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
                  'lg:bg-transparent lg:rounded-full lg:px-5 lg:mx-0.5',
                  'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
                )}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

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
