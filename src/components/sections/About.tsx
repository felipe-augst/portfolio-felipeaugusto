import { ABOUT } from '@/data/about'
import { SKILL_CATEGORIES } from '@/data/skills'
import { Button } from '../ui/Button'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/ui/Section'

export function About() {
  return (
    <Section id="about">
      <div className="flex font-serif uppercase items-center gap-5 mb-14 text-[18px] tracking-[0.35em] text-sand-muted">
        <span className="w-8 h-px bg-accent" />
        Sobre
      </div>

      <div className="grid md:grid-cols-[1.1fr_1fr] gap-16 md:gap-16 lg:gap-24 items-start">
        <div>
          <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight tracking-[-0.03em] mb-10">
            {ABOUT.title} <span className="text-accent not-italic">{ABOUT.titleHighlight}</span>
          </h2>
          {ABOUT.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sand-muted mb-5 leading-relaxed max-w-xl">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-11 pt-2">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.title}>
              <h3 className="font-display text-[16px] uppercase tracking-[0.3em] text-accent font-medium mb-5">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="font-sans text-sm py-1.5 px-4 border border-border-strong text-sand hover:border-accent hover:text-accent transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <Button href="/stack" variant="ghost" trailingIcon={ArrowRight}>
          Ver stack completa
        </Button>
      </div>
    </Section>
  )
}
