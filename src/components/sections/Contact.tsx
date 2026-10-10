'use client'
import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { MapPin, ArrowRight } from 'lucide-react'
import { CONTACT } from '@/data/contact'
import { SOCIAL_LINKS, SOCIAL_ICONS } from '@/data/social'
import Image from 'next/image'
import { Section } from '@/components/ui/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

export function Contact() {
  const { prefix, animatedWords, suffix } = CONTACT.hero
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % animatedWords.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [animatedWords.length])

  // Encontra a palavra mais longa para definir a largura do contêiner invisível
  const longestWord = animatedWords.reduce((a, b) => (a.length > b.length ? a : b))

  return (
    <Section id="contact">
      <SectionEyebrow className="mb-14">Contato</SectionEyebrow>
      <div className="grid xl:grid-cols-[1.1fr_1fr] gap-16 md:gap-18 items-center lg:items-start">
        <h2 className="font-display text-center md:text-start text-5xl md:text-7xl lg:text-[90px] font-light leading-tight tracking-[-0.03em]">
          <span>{prefix}</span>
          <span className="relative flex flex-col justify-center overflow-hidden px-1 py-1">
            <span className="invisible pointer-events-none font-medium">{longestWord}</span>
            {animatedWords.map((word, i) => {
              const isPrevious = i === (index - 1 + animatedWords.length) % animatedWords.length
              const isActive = i === index
              let positionClass = 'translate-y-full opacity-0'
              if (isActive) {
                positionClass = 'translate-y-0 opacity-100'
              } else if (isPrevious) {
                positionClass = '-translate-y-full opacity-0'
              }
              return (
                <span
                  key={word}
                  className={`absolute inset-0 flex justify-center md:justify-start items-center md:items-start text-accent font-medium transition-all duration-500 ease-in-out ${positionClass}`}
                >
                  {word}
                </span>
              )
            })}
          </span>
          <span>{suffix}</span>
        </h2>

        <div className="flex flex-col w-full max-w-md md:items-center md:mx-auto">
          <h3 className="font-serif uppercase text-lg md:text-2xl font-light mb-6 mt-2 text-center md:text-left">
            Entre em contato:
          </h3>

          {/* O Card Principal */}
          <div className="w-full flex flex-col p-4 border border-border-strong bg-sand/40 backdrop-blur-md mb-8">
            {/* Grupo 1: Ícones Sociais */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {SOCIAL_LINKS.map(({ platform, href, label }) => (
                <a
                  key={platform}
                  href={href}
                  aria-label={`Acessar ${label}`}
                  target={platform === 'email' ? undefined : '_blank'}
                  rel={platform === 'email' ? undefined : 'noopener noreferrer'}
                  className="flex items-center justify-center p-2 rounded-md hover:scale-110 transition-all duration-300 group"
                >
                  <Image
                    src={SOCIAL_ICONS[platform]}
                    alt={`${platform} icon`}
                    width={50}
                    height={50}
                    className="opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                </a>
              ))}
            </div>

            {/* Divisor Isolado */}
            <div className="h-px w-full bg-border-strong/60 my-3" />

            {/* Grupo 2: Localização */}
            <div className="flex items-center justify-center gap-3 p-2">
              <MapPin className="w-5 h-5 text-black/70" strokeWidth={1.5} />
              <span className="font-sans text-md md:text-lg text-black/70 tracking-wide">
                Jundiaí / SP
              </span>
            </div>
          </div>

          {/* Botão de CV */}
          <Button
            href="/felipe_augusto_fullstack_cv.pdf"
            download="felipe-augusto-fullstack-cv.pdf"
            trailingIcon={ArrowRight}
            variant="primary"
            className="md:w-full justify-center "
          >
            Baixar CV
          </Button>
        </div>
      </div>
    </Section>
  )
}
