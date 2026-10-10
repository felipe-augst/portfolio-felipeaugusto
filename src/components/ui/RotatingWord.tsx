'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

// As trocas se distribuem nesse tempo, e a transição da última (500 ms) termina antes dos 5 s
// do WCAG 2.2.2.
const CYCLE_MS = 3_000

type RotatingWordProps = {
  words: readonly string[]
  className?: string
}

// Palavra que passa uma única vez por todas as palavras e para na última. A rotação começa quando
// a palavra entra na tela e não acontece com movimento reduzido. É só visual: quem usa deixa o
// trecho com aria-hidden e oferece a frase completa em sr-only.
export function RotatingWord({ words, className }: RotatingWordProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element || words.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const stepMs = CYCLE_MS / (words.length - 1)
    const timers: number[] = []
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      for (let i = 1; i < words.length; i++) {
        timers.push(window.setTimeout(() => setIndex(i), i * stepMs))
      }
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [words.length])

  if (words.length === 0) return null

  // A palavra mais longa, invisível, reserva o espaço do trecho.
  const longestWord = words.reduce((longest, word) =>
    word.length > longest.length ? word : longest,
  )

  return (
    <span ref={ref} className={cn('relative block overflow-hidden px-1 py-1', className)}>
      <span className="invisible">{longestWord}</span>
      {words.map((word, i) => (
        <span
          key={word}
          // Fora da vez, a palavra fica recortada pelo overflow, com opacidade total: no meio de
          // um fade, o texto ficaria sem contraste.
          className={cn(
            'absolute inset-0 py-1 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-in-out',
            i === index && 'translate-y-0',
            i < index && '-translate-y-full',
            i > index && 'translate-y-full',
          )}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
