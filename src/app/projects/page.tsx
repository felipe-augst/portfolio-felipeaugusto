import { PageShell } from '@/components/layout/PageShell'
import { FeaturedProjectsGrid } from '@/components/sections/FeaturedProjectsGrid'
import { PROJECTS } from '@/data/projects'
import { PAGES } from '@/data/site'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata(PAGES.projects)

export default function ProjectsPage() {
  return (
    <PageShell eyebrow="Meus projetos" title="Todos os" titleHighlight="projetos">
      <FeaturedProjectsGrid projects={PROJECTS} />
    </PageShell>
  )
}
