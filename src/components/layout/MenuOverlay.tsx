'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/cn'
import { NAV_ITEMS } from '@/data/nav'
import { SOCIAL_LINKS } from '@/data/social'

type MenuOverlayProps = {
  open: boolean
  onClose: () => void
}

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'bg-bg flex flex-col items-center justify-center gap-5',
        'transition-opacity duration-500',
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <button
        onClick={onClose}
        className="absolute top-7 right-7 md:right-12 border border-border-strong text-sand text-xs uppercase tracking-[0.2em] font-medium px-5 py-2.5 hover:bg-sand hover:text-bg transition-colors"
      >
        Fechar
      </button>

      <nav className="flex flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="font-display text-[clamp(52px,9vw,104px)] font-normal tracking-[-0.04em] leading-none text-sand hover:text-accent transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex gap-8 mt-10">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.platform}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sand-muted text-xs uppercase tracking-[0.2em] hover:text-accent transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
