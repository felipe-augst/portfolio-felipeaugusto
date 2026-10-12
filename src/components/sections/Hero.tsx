'use client'

import Image from 'next/image'
import { Button } from '../ui/Button'
import { HERO } from '@/data/hero'
import { Download } from 'lucide-react'
import { ShimmerText } from '../ui/ShimmerText'
import { CORE_STACK } from '@/data/stack'
import { motion } from 'motion/react'

export function Hero() {
  return (
    <section className="relative min-h-200 md:min-h-225 lg:min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 md:px-12 pb-15">
      {/* Background Image (decorativa) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero_background2.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
      </div>

      {/* Overlay gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-1 bg-linear-to-t from-bg to-transparent"
      />

      {/* Content */}
      <div className="relative z-2 max-w-350 w-full flex flex-col items-center justify-center pt-2  md:pt-60">
        {HERO.availability && (
          <div className="inline-flex items-center gap-3 mb-6 text-[11px] uppercase tracking-[0.25em] text-sand-muted">
            <span className="relative w-2 h-2 bg-green rounded-full">
              <span className="absolute inset-1.25 rounded-full bg-green/80 animate-pulse" />
            </span>
            Disponível para novos projetos
          </div>
        )}
        <h1 className="font-display text-center font-light text-[clamp(80px,13vw,120px)] leading-[0.88] tracking-[-0.045em] text-sand mb-8 ">
          <ShimmerText variant="night">
            {HERO.firstName} {HERO.lastName}
          </ShimmerText>
        </h1>
        <p className="font-serif  text-center font-light text-xl md:text-2xl text-white/70 md:max-w-3xl lg:max-w-5xl leading-relaxed mb-8">
          {HERO.tagline}
        </p>
        <Button
          href="/felipe_augusto_fullstack_cv.pdf"
          download="felipe-augusto-fullstack-cv.pdf"
          trailingIcon={Download}
          variant="primary"
        >
          Baixar CV
        </Button>

        {/* Stack Icons */}

        <motion.div
          className="flex gap-6 mt-16 md:mt-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: 0.1,
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {CORE_STACK.map((stack) => (
            <motion.div
              key={stack.name}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.8 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Image
                src={stack.icon}
                alt={`${stack.name} icon`}
                width={32}
                height={32}
                className="filter grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-opacity"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
