'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { markSkeletonShown } from '@/actions/skeleton'

const GREETINGS = [
  { welcome: 'Bem-vindo ao', highlight: 'meu portfólio' },
  { welcome: 'Welcome to', highlight: 'my portfolio' },
  { welcome: 'Willkommen in', highlight: 'meinem Portfolio' },
]

type SplashScreenProps = {
  initialShown: boolean
}

export function SplashScreen({ initialShown }: SplashScreenProps) {
  const [faded, setFaded] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const languageInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length)
    }, 1500)

    const fadeTimer = setTimeout(() => {
      setFaded(true)
      void markSkeletonShown()
      clearInterval(languageInterval)
    }, 3500)

    return () => {
      clearInterval(languageInterval)
      clearTimeout(fadeTimer)
    }
  }, [])

  if (initialShown) return null

  const currentGreeting = GREETINGS[index]
  if (!currentGreeting) return null

  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-100',
        'bg-bg flex flex-col items-center justify-center gap-8',
        'transition-opacity duration-700',
        faded ? 'opacity-0 pointer-events-none' : 'opacity-100',
      )}
    >
      <div className="font-serif text-sand text-5xl md:text-7xl font-light tracking-[0.03em] flex flex-col items-center text-center">
        <div key={index} className="animate-in fade-in duration-300">
          {currentGreeting.welcome}{' '}
          <em className="text-accent not-italic">{currentGreeting.highlight}</em>
        </div>
      </div>

      <div className="relative h-px w-64 bg-border-strong overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-accent to-transparent animate-scan" />
      </div>
    </div>
  )
}
