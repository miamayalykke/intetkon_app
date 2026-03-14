import { ClerkLoaded, SignInButton, UserButton } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import logo from '@public/logo.svg'
import { Button } from '@ui/button'
import { PackageIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { NavigationSheet } from './MobileNavigationSheet'
import { NavMenu } from './NavigationMenu'
import HeaderBasketCount from './ServerBasketCount'

const Header = async () => {
  const { userId } = await auth()
  const user = userId ? await currentUser() : null

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-background/80 backdrop-blur-md z-100">
      <div className="flex h-full items-center justify-between px-4 lg:px-8 max-w-[100vw]">
        <Link
          href="/"
          prefetch={false}
          className="flex items-center shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-28 h-10 sm:w-40 sm:h-12 lg:w-48 lg:h-16">
            <Image
              src={logo}
              alt="Intetkon Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        <div className="hidden lg:block">
          <NavMenu />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/basket" className="relative shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <HeaderBasketCount />
            </Button>
          </Link>

          <ClerkLoaded>
            {user && (
              <Link href="/orders" className="hidden sm:block shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9"
                >
                  <PackageIcon className="w-5 h-5" />
                </Button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 ml-1">
                {/* User info hidden on almost all mobile screens to save space */}
                <div className="hidden xl:block text-right">
                  <p className="text-[10px] text-muted-foreground leading-none">
                    Welcome
                  </p>
                  <p className="text-xs font-bold leading-tight">
                    {user.firstName}
                  </p>
                </div>
                <div className="shrink-0 scale-90 sm:scale-100">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="default"
                  className="rounded-full px-3 h-8 sm:px-6 sm:h-9 text-xs sm:text-sm shrink-0"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </ClerkLoaded>

          <div className="lg:hidden ml-1 shrink-0">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
