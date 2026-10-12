'use client'

import { useEffect, useRef } from 'react'
import { NAV_ITEMS } from '@/data/nav'
import { SOCIAL_LINKS } from '@/data/social'

type MenuOverlayProps = {
  open: boolean
  onClose: () => void
}

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
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
      aria-label="Menu"
      onClose={onClose}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none border-0 p-0 bg-bg text-sand open:flex flex-col items-center justify-center gap-5"
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
    </dialog>
  )
}
