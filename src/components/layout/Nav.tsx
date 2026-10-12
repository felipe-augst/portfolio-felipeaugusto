'use client'
import { useId, useState } from 'react'
import { MenuOverlay } from './MenuOverlay'

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-7 flex justify-between items-center mix-blend-difference bg-transparent backdrop-blur-sm">
        <a
          href="#"
          className="font-display text-[17px] text-sand uppercase tracking-[0.2em] font-medium"
        >
          Felipe<span className="text-accent">.</span>DEV
        </a>
        <button
          onClick={() => setMenuOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="border border-border-strong text-sand text-xs uppercase tracking-[0.2em] font-medium px-5 py-2.5 hover:bg-sand hover:text-bg transition-colors"
        >
          Menu
        </button>
      </header>

      <MenuOverlay id={menuId} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
