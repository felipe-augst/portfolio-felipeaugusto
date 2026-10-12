import Link from 'next/link'
import { focusRing } from '@/components/ui/Button'
import { NAV_ITEMS } from '@/data/nav'
import { SOCIAL_LINKS } from '@/data/social'
import { cn } from '@/lib/cn'
import { NEW_TAB_NOTICE, opensInNewTab } from '@/lib/links'
import { MenuOverlay } from '@/components/layout/MenuOverlay'

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-7 flex justify-between items-center mix-blend-difference bg-transparent backdrop-blur-sm">
      <Link
        href="/"
        className={cn(
          'font-display text-[17px] text-sand uppercase tracking-[0.2em] font-medium',
          focusRing,
        )}
      >
        Felipe<span className="text-accent">.</span>DEV
      </Link>

      <MenuOverlay>
        <nav className="flex flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'font-display text-[clamp(52px,9vw,104px)] font-normal tracking-[-0.04em] leading-none text-sand hover:text-accent transition-colors',
                focusRing,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-8 mt-10">
          {SOCIAL_LINKS.map(({ platform, href, label }) => {
            const newTab = opensInNewTab(href)
            return (
              <a
                key={platform}
                href={href}
                target={newTab ? '_blank' : undefined}
                rel={newTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'text-sand-muted text-xs uppercase tracking-[0.2em] hover:text-accent transition-colors',
                  focusRing,
                )}
              >
                {label}
                {newTab && <span className="sr-only"> {NEW_TAB_NOTICE}</span>}
              </a>
            )
          })}
        </div>
      </MenuOverlay>
    </header>
  )
}
