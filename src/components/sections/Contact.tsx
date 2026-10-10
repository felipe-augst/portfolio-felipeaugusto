import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { RotatingWord } from '@/components/ui/RotatingWord'
import { Section } from '@/components/ui/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { CONTACT } from '@/data/contact'
import { SITE } from '@/data/site'
import { SOCIAL_LINKS } from '@/data/social'

export function Contact() {
  const { prefix, animatedWords, suffix } = CONTACT.hero
  // O leitor de tela ouve a frase com a primeira palavra, e não a animação.
  const phrase = [prefix, ...animatedWords.slice(0, 1), suffix].join(' ')

  return (
    <Section id="contact">
      <SectionEyebrow className="mb-14">Contato</SectionEyebrow>
      <div className="grid xl:grid-cols-[1.1fr_1fr] gap-16 md:gap-18 items-center lg:items-start">
        <h2 className="font-display text-center md:text-start text-5xl md:text-7xl lg:text-[90px] font-light leading-tight tracking-[-0.03em]">
          <span className="sr-only">{phrase}</span>
          {/* Com a lista de palavras vazia, os espaços separam prefixo e sufixo. */}
          <span aria-hidden="true">
            {prefix} <RotatingWord words={animatedWords} className="font-medium text-accent" />{' '}
            {suffix}
          </span>
        </h2>

        <div className="flex flex-col w-full max-w-md md:items-center md:mx-auto">
          <h3 className="font-serif uppercase text-lg md:text-2xl font-light mb-6 mt-2 text-center md:text-left">
            Entre em contato:
          </h3>

          <div className="w-full flex flex-col p-4 border border-border-strong bg-sand/60 backdrop-blur-md mb-8">
            <div className="grid grid-cols-4 gap-2 mb-2">
              {SOCIAL_LINKS.map(({ platform, href, label, icon }) => {
                // Links mailto: abrem na mesma aba.
                const opensNewTab = !href.startsWith('mailto:')
                return (
                  <a
                    key={platform}
                    href={href}
                    aria-label={
                      opensNewTab ? `Acessar ${label} (abre em nova aba)` : `Acessar ${label}`
                    }
                    target={opensNewTab ? '_blank' : undefined}
                    rel={opensNewTab ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-center p-2 rounded-md hover:scale-110 transition-all duration-300 group focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                  >
                    <Image
                      src={icon}
                      alt=""
                      width={50}
                      height={50}
                      className="opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                  </a>
                )
              })}
            </div>

            <div className="h-px w-full bg-border-strong/60 my-3" />

            <div className="flex items-center justify-center gap-3 p-2">
              <Icon icon={MapPin} className="size-5 stroke-[1.5] text-bg" />
              <span className="font-sans text-base md:text-lg text-bg tracking-wide">
                {SITE.location.city} / {SITE.location.region}
              </span>
            </div>
          </div>

          <Button
            href={SITE.cv.path}
            download={SITE.cv.downloadName}
            trailingIcon={ArrowRight}
            variant="primary"
            className="md:w-full justify-center"
          >
            Baixar CV
          </Button>
        </div>
      </div>
    </Section>
  )
}
