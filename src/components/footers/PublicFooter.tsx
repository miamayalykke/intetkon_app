'use client'

import Logo from '@public/logo.svg'
import NewsletterForm from '@src/components/newsletter/NewsletterForm'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa'

const PublicFooter = () => {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <footer className="w-full">
      <div className="bg-card overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            <div className="lg:col-span-4 space-y-4">
              <Link
                prefetch={false}
                href={`/${locale}`}
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <Image
                  src={Logo}
                  alt="Intetkøn"
                  width={140}
                  height={40}
                  className="object-contain"
                />
              </Link>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-64">
                {t('footer.tagline')}
              </p>
              <div className="flex items-center gap-3">
                {[
                  {
                    icon: <FaFacebook className="w-4 h-4" />,
                    href: 'https://www.facebook.com/profile.php?id=61569961322745',
                  },
                  {
                    icon: <FaInstagram className="w-4 h-4" />,
                    href: 'https://www.instagram.com/_intetkon_/',
                  },
                  {
                    icon: <FaTiktok className="w-4 h-4" />,
                    href: 'https://www.tiktok.com/@intetkon_',
                  },
                  {
                    icon: <FaLinkedin className="w-4 h-4" />,
                    href: 'https://www.linkedin.com/company/intetk%C3%B8n/',
                  },
                ].map((social, i) => (
                  <Link
                    key={i}
                    href={social.href}
                    className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider">
                  {t('footer.sections.atelier')}
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>
                    <Link
                      href={`/${locale}/shop`}
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      {t('footer.sections.unikaPieces')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/workshops`}
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      {t('footer.sections.workshops')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/patterns`}
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      {t('footer.sections.patterns')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/contact`}
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      {t('footer.sections.contact')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/careers`}
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      {t('footer.sections.careers')}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider">
                  {t('footer.support.title')}
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>
                    <Link
                      href={`/${locale}/privacy-policy`}
                      className="hover:text-orange-500"
                      prefetch={false}
                    >
                      {t('footer.support.privacyPolicy')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/terms-of-service`}
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      {t('footer.support.termsOfService')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/return-policy`}
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      {t('footer.support.returnPolicy')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4 bg-muted/30 p-5 rounded-3xl border border-border/50">
              <div className="space-y-1">
                <h4 className="font-bold text-sm tracking-tight">
                  {t('footer.newsletter.title')}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {t('footer.newsletter.description')}
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-muted-foreground/70 tracking-wide">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-secondary/60">
              {t('footer.tagline2')}
            </p>
          </div>
        </div>

        <div className="h-1.5 w-full bg-secondary" />
      </div>
    </footer>
  )
}

export default PublicFooter
