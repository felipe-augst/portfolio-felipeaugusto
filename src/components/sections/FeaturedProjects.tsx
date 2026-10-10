'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading'
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
          <SectionEyebrow className="mb-4">Portfólio</SectionEyebrow>
          <SectionHeading
            title="Projetos em"
            highlight="destaque"
            className="text-center md:text-start"
          />
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
