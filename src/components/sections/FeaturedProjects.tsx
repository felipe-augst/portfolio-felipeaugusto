'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { PROJECTS } from '@/data/projects'
import { useMediaQuery } from '@/hooks/use-media-query'
import { FeaturedProjectsCarousel } from './FeaturedProjectsCarousel'
import { FeaturedProjectsGrid } from './FeaturedProjectsGrid'

export function FeaturedProjects() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const featuredProjects = PROJECTS.filter((p) => p.featured)

  return (
    <Section id="projects">
      <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
        <div>
          <div className="flex font-serif uppercase items-center justify-start gap-5 mb-4 text-[18px] tracking-[0.35em] text-sand-muted">
            <span className="w-8 h-px bg-accent" />
            Portfólio
          </div>
          <h2 className="font-serif text-center md:text-start text-4xl md:text-6xl font-light leading-tight tracking-[-0.03em]">
            Projetos em <span className="text-accent">destaque</span>
          </h2>
        </div>
      </div>

      {/* Decisão de qual renderizar */}
      {isDesktop === null ? (
        <div className="min-h-96" />
      ) : isDesktop ? (
        <FeaturedProjectsGrid projects={featuredProjects} />
      ) : (
        <FeaturedProjectsCarousel projects={featuredProjects} />
      )}

      <div className="mt-16 w-full flex justify-center lg:justify-start">
        <Button href="/projects" variant="ghost" trailingIcon={ArrowRight}>
          Ver todos os projetos
        </Button>
      </div>
    </Section>
  )
}
