'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

// O conteúdo entra quando passa 80 px da borda de baixo da tela.
const ROOT_MARGIN = '0px 0px -80px 0px'

type RevealOnScrollProps = {
  children: ReactNode
  delayMs?: number
  className?: string
}

// Entrada do conteúdo ao rolar até ele. O IntersectionObserver só tira o estado inicial oculto, e a
// transição é CSS. O estado oculto só vale com JS (variante `js:`): sem JS, o conteúdo fica visível.
export function RevealOnScroll({ children, delayMs = 0, className }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        setRevealed(true)
      },
      { rootMargin: ROOT_MARGIN },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        'transition-[opacity,translate] duration-600 ease-out',
        !revealed && 'js:translate-y-7.5 js:opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
