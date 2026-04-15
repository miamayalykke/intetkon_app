import { auth } from '@clerk/nextjs/server'
import { ExternalLink, Mail, PenTool } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const tiles = [
  {
    href: '/app/email',
    label: 'Draft Emails',
    description: 'Design and send campaigns to subscribers',
    icon: Mail,
    external: false,
  },
  {
    href: '/studio',
    label: 'Sanity Studio',
    description: 'Edit content, products, and media',
    icon: PenTool,
    external: false,
  },
]

export default async function AdminPage() {
  const { userId, sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role

  if (!userId || role !== 'admin') redirect('/')

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto px-6 pt-24">
        <header className="mb-16 relative">
          <div className="bg-orange-500 text-white px-5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg -rotate-2 border-2 border-white mb-8 w-fit">
            Admin
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
            STUDIO <span className="text-secondary italic font-serif">HQ</span>
          </h1>
          <p className="text-muted-foreground font-light italic uppercase tracking-[0.2em] text-[10px]">
            Your tools and controls
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map(({ href, label, description, icon: Icon, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="group relative"
            >
              <div className="absolute -top-3 -right-3 w-full h-full bg-orange-500/5 rounded-[2rem] rotate-1 border-2 border-dashed border-orange-500/10 -z-10 group-hover:rotate-2 transition-transform duration-500" />
              <div className="bg-white border-2 border-border rounded-[2rem] p-8 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all duration-500 h-full">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-black uppercase tracking-tight text-sm flex items-center gap-2">
                    {label}
                    {external && (
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 font-light">
                    {description}
                  </p>
                </div>
                <div className="bg-foreground text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full w-fit group-hover:bg-orange-500 transition-colors duration-300">
                  Open →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
