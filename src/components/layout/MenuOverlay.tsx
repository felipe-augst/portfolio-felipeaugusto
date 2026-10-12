'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button, focusRing } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { NEW_TAB_NOTICE, opensInNewTab } from '@/lib/links'
import { NAV_ITEMS } from '@/data/nav'
import { SOCIAL_LINKS } from '@/data/social'

type MenuOverlayProps = {
  id: string
  open: boolean
  onClose: () => void
}

export function MenuOverlay({ id, open, onClose }: MenuOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // O diálogo modal nativo traz a camada superior, o fundo inerte e o Escape.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Menu"
      onClose={onClose}
      className={cn(
        'fixed inset-0 m-0 size-full max-h-none max-w-none border-0 p-0 backdrop:bg-transparent',
        'bg-bg text-sand open:flex flex-col items-center justify-center gap-5',
        // Fade na abertura e no fechamento: `display` e `overlay` trocam só no fim do fechamento.
        'opacity-0 open:opacity-100 starting:open:opacity-0',
        'transition-[opacity,display,overlay] transition-discrete duration-500',
      )}
    >
      <Button variant="outline" onClick={onClose} className="absolute top-7 right-7 md:right-12">
        Fechar
      </Button>

      <nav className="flex flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
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
    </dialog>
  )
}
