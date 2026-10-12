import { PageShell } from '@/components/layout/PageShell'
import { StackTile } from '@/components/ui/StackTile'
import { TECH_CATEGORIES } from '@/data/technologies'
import { PAGES } from '@/data/site'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata(PAGES.stack)

export default function StackPage() {
  return (
    <PageShell eyebrow="Tecnologias" title="Stack" titleHighlight="completa">
      <div className="flex flex-col gap-16">
        {TECH_CATEGORIES.map((category) => (
          <div key={category.title} className="flex flex-col w-full">
            <h2 className="font-sans text-[14px] uppercase tracking-[0.3em] text-accent font-medium mb-8 text-center md:text-left">
              {category.title}
            </h2>

            <ul
              role="list"
              aria-label={category.title}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8"
            >
              {category.technologies.map((technology) => (
                <li key={technology.name}>
                  <StackTile technology={technology} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
