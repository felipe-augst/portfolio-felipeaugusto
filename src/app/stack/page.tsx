import { STACKS_PAGE_DATA } from '@/data/stack'
import { BackButton } from '@/components/ui/BackButton'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PAGES } from '@/data/site'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  ...buildPageMetadata(PAGES.stack),
  title: 'Tecnologias',
  description: 'Tecnologias e ferramentas que utilizo no dia a dia como desenvolvedor frontend.',
}

export default function StackPage() {
  return (
    <div className="relative bg-bg min-h-screen flex flex-col items-center justify-start overflow-hidden px-6 md:px-12 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-1 bg-linear-to-t from-bg-2 to-transparent"
      />
      {/* Botão Voltar */}

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mt-15 md:mt-20">
        <div className="flex font-serif uppercase items-center gap-5 mb-16 text-[18px] tracking-[0.35em] text-sand-muted">
          <span className="w-8 h-px bg-accent" />
          Tecnologias
          <span className="w-8 h-px bg-accent" />{' '}
        </div>

        {/* Contêiner das Categorias */}
        <div className="w-full flex flex-col gap-16">
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

        <div className="mt-20 items-start self-start">
          <BackButton />
        </div>
      </div>
    </div>
  )
}
