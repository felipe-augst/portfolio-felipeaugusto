import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProjectList } from '@/components/ui/ProjectList'
import { Section } from '@/components/ui/Section'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PROJECTS } from '@/data/projects'

export function FeaturedProjects() {
  const featuredProjects = PROJECTS.filter((project) => project.featured)

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

      <ProjectList projects={featuredProjects} label="Projetos em destaque" cardHeadingLevel="h3" />

      <div className="mt-16 w-full flex justify-center lg:justify-start">
        <Button href="/projects" variant="ghost" trailingIcon={ArrowRight}>
          Ver todos os projetos
        </Button>
      </div>
    </Section>
  )
}
