'use client'
import { subscribe } from '@src/lib/newsletter-actions'
import { Button } from '@ui/button'
import { Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

const initialState = { status: 'idle' as const }

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribe, initialState)
  const t = useTranslations('footer.newsletter')

  if (state.status === 'success') {
    return (
      <p className="text-xs text-secondary font-medium py-3">{t('success')}</p>
    )
  }

  if (state.status === 'conflict') {
    return <p className="text-xs text-muted-foreground py-3">{t('conflict')}</p>
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="newsletter" value="on" />
      <div className="relative flex items-center">
        <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
        <input
          type="email"
          name="email"
          required
          placeholder={t('placeholder')}
          className="w-full bg-background border border-border rounded-full py-3 pl-10 pr-24 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs transition-all"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="absolute right-1 rounded-full bg-secondary hover:bg-secondary/90 text-white h-8.5 px-4 font-bold text-[10px] uppercase"
        >
          {isPending ? '…' : t('button')}
        </Button>
      </div>
      {state.status === 'invalid_email' && (
        <p className="text-[11px] text-red-500 pl-1">{t('invalidEmail')}</p>
      )}
      {state.status === 'error' && (
        <p className="text-[11px] text-red-500 pl-1">{t('error')}</p>
      )}
    </form>
  )
}
