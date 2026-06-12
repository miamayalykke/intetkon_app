'use client'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@ui/button'
import { useTranslations } from 'next-intl'

export const UserMenu = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const t = useTranslations('user')

  if (!isLoaded)
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="default" className="rounded-full px-6 h-9 text-sm">
          {t('signIn')}
        </Button>
      </SignInButton>
    )
  }

  const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin'

  return (
    <div className="flex items-center gap-2">
      <div className="hidden xl:block text-right">
        <p className="text-[10px] text-muted-foreground leading-none">
          {t('welcome')}
        </p>
        <p className="text-xs font-bold leading-tight">{user?.firstName}</p>
      </div>
      <UserButton afterSignOutUrl="/">
        <UserButton.MenuItems>
          <UserButton.Link
            label={t('myOrders')}
            labelIcon={<span>📦</span>}
            href="/app/orders"
          />
          {isAdmin && (
            <UserButton.Link
              label={t('admin')}
              labelIcon={<span>⚙️</span>}
              href="/app"
            />
          )}
        </UserButton.MenuItems>
      </UserButton>
    </div>
  )
}
