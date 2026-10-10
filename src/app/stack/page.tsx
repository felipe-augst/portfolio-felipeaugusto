import Image from 'next/image'
import { PageShell } from '@/components/layout/PageShell'
import { STACKS_PAGE_DATA } from '@/data/stack'
import { PAGES } from '@/data/site'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata(PAGES.stack)

export default function StackPage() {
  return (
    <PageShell eyebrow="Tecnologias" title="Stack" titleHighlight="completa">
      <div className="flex flex-col gap-16">
        {STACKS_PAGE_DATA.map((category) => (
          <div key={category.title} className="flex flex-col w-full">
            <h2 className="font-sans text-[14px] uppercase tracking-[0.3em] text-accent font-medium mb-8 text-center md:text-left">
              {category.title}
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
              {category.stacks.map((stack) => (
                <div
                  key={stack.name}
                  className="group relative flex flex-col items-center justify-center aspect-square bg-sand-muted/20 backdrop-blur-sm border border-white/5 rounded-2xl hover:border-white/20 hover:bg-sand/70 transition-all duration-300 overflow-hidden"
                  title={stack.name}
                >
                  <Image
                    src={stack.icon}
                    alt={`${stack.name} icon`}
                    width={48}
                    height={48}
                    quality={75}
                    className="filter opacity-80 group-hover:opacity-100 transition-transform duration-300 md:group-hover:-translate-y-3"
                  />

                  <span className="text-[12px] sm:text-xs uppercase font-sans text-center font-medium leading-tight px-2 mt-3 opacity-100 block translate-y-0 md:mt-0 md:absolute md:bottom-4 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out text-sand-muted group-hover:text-bg">
                    {stack.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
