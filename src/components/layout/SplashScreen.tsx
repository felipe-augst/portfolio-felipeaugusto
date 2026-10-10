'use client'

import { useState, useEffect } from 'react'
import type { TransitionEvent } from 'react'
import { cn } from '@/lib/cn'
import { SPLASH_ATTRIBUTE } from '@/lib/head-script'

const GREETINGS = [
  { welcome: 'Bem-vindo ao', highlight: 'meu portfólio' },
  { welcome: 'Welcome to', highlight: 'my portfolio' },
  { welcome: 'Willkommen in', highlight: 'meinem Portfolio' },
]

export function SplashScreen() {
  const [faded, setFaded] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // O script inline do <head> já decidiu se a tela aparece nesta página.
    if (!document.documentElement.hasAttribute(SPLASH_ATTRIBUTE)) return

    // Com movimento reduzido, o texto não alterna; a duração da tela continua a mesma.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const languageInterval = reducedMotion
      ? undefined
      : setInterval(() => {
          setIndex((prev) => (prev + 1) % GREETINGS.length)
        }, 1500)

    const fadeTimer = setTimeout(() => {
      setFaded(true)
      clearInterval(languageInterval)
    }, 3500)

    return () => {
      clearInterval(languageInterval)
      clearTimeout(fadeTimer)
    }
  }, [])

  // Fim do fade: sem o atributo, a tela sai do layout.
  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (faded && event.target === event.currentTarget) {
      document.documentElement.removeAttribute(SPLASH_ATTRIBUTE)
    }
  }

  const currentGreeting = GREETINGS[index]
  if (!currentGreeting) return null

  return (
    <div
      aria-hidden="true"
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        'fixed inset-0 z-100',
        // Oculta no HTML estático; só aparece com o atributo do <html>.
        'bg-bg hidden splash:flex flex-col items-center justify-center gap-8',
        'transition-opacity duration-700',
        faded ? 'opacity-0 pointer-events-none' : 'opacity-100',
      )}
    >
      <div className="font-serif text-sand text-5xl md:text-7xl font-light tracking-[0.03em] flex flex-col items-center text-center">
        <div key={index} className="motion-safe:animate-in motion-safe:fade-in duration-300">
          {currentGreeting.welcome}{' '}
          <em className="text-accent not-italic">{currentGreeting.highlight}</em>
        </div>
      </div>

      <div className="relative h-px w-64 bg-border-strong overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-accent to-transparent motion-safe:animate-scan" />
      </div>
    </div>
  )
}
