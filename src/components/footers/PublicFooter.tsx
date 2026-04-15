'use client'

import Logo from '@public/logo.svg'
import NewsletterForm from '@src/components/newsletter/NewsletterForm'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const PublicFooter = () => {
  return (
    <footer className="w-full">
      <div className="bg-card overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            <div className="lg:col-span-4 space-y-4">
              <Link
                prefetch={false}
                href="/"
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
                Empowering creativity through professional patterns and
                inclusive workshops.
              </p>
              <div className="flex items-center gap-3">
                {[
                  {
                    icon: <Facebook className="w-4 h-4" />,
                    href: 'https://www.facebook.com/profile.php?id=61569961322745',
                  },
                  {
                    icon: <Instagram className="w-4 h-4" />,
                    href: 'https://www.instagram.com/_intetkon_/',
                  },
                  {
                    icon: <Youtube className="w-4 h-4" />,
                    href: 'https://www.tiktok.com/@intetkon_',
                  },
                  {
                    icon: <Linkedin className="w-4 h-4" />,
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
                  Atelier
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>
                    <Link
                      href="/shop"
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      Unika Pieces
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/workshops"
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      Workshops
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/patterns"
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      Patterns
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider">
                  Support
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-orange-500"
                      prefetch={false}
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-of-service"
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/return-policy"
                      prefetch={false}
                      className="hover:text-orange-500"
                    >
                      Return Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4 bg-muted/30 p-5 rounded-3xl border border-border/50">
              <div className="space-y-1">
                <h4 className="font-bold text-sm tracking-tight">
                  Stay Updated
                </h4>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Get inspired with gender-neutral DIY ideas and workshop news.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-muted-foreground/70 tracking-wide">
              © {new Date().getFullYear()} INTETKØN. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-secondary/60">
              Crafted for Equality
            </p>
          </div>
        </div>

        {/* Green Line */}
        <div className="h-1.5 w-full bg-secondary" />
      </div>
    </footer>
  )
}

export default PublicFooter
