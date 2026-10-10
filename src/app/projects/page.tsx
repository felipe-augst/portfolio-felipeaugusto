import { BackButton } from '@/components/ui/BackButton'
import { PROJECTS } from '@/data/projects'
import { FeaturedProjectsGrid } from '@/components/sections/FeaturedProjectsGrid'
import { PAGES } from '@/data/site'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata(PAGES.projects)

export default function ProjectsPage() {
  return (
    <div className="relative bg-bg min-h-screen flex flex-col items-center justify-start overflow-hidden px-6 md:px-12 py-16">
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mt-15 md:mt-20 ">
        <div className="flex font-serif uppercase items-center text-center gap-5 mb-16 text-[18px] tracking-[0.35em] text-sand-muted">
          <span className="w-8 h-px bg-accent " />
          Meus projetos
          <span className="w-8 h-px bg-accent" />{' '}
        </div>

        <div className="w-full"></div>
        <div className="mb-20 items-start self-start">
          <BackButton />
        </div>
        <FeaturedProjectsGrid projects={PROJECTS} />
        <div className="mt-20 self-start lg:hidden">
          <BackButton />
        </div>
      </div>
    </div>
  )
}
