import { ServerImage } from '@/components/ui/ServerImage'
import { ExpandableDescription } from '@/components/ui/ExpandableDescription'
import { ProjectLinks } from '@/components/ui/ProjectLinks'
import { TechIcon } from '@/components/ui/TechIcon'
import { cn } from '@/lib/cn'
import type { Project } from '@/types/projects'

type ProjectCardProps = {
  project: Project
  // Nível do título do card: um abaixo do título da seção ou da página que contém a lista.
  headingLevel: 'h2' | 'h3'
}

// Card de projeto, renderizado no servidor. A descrição expansível é a única ilha de cliente.
export function ProjectCard({ project, headingLevel: Heading }: ProjectCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col w-full overflow-hidden',
        'rounded-md border border-border bg-bg-2',
      )}
    >
      {/* Imagem + Gaveta */}
      {/* Adicionado shrink-0 aqui para a imagem não amassar quando o texto expandir */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden border-b border-border-strong/50">
        <ServerImage
          src={project.image}
          alt={project.title}
          fill
          // Largura do card na lista: ~1/3 da tela em xl, 1/2 a partir de md e 80% na fileira.
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 80vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gaveta de Techs: sempre aberta sem hover; com hover, abre com hover ou foco dentro do
            card, e também no card ativo da lista deslizável (`data-active` do item). */}
        <div
          className={cn(
            'absolute bottom-0 left-0 w-full flex items-center justify-center gap-3',
            'bg-bg-3/95 backdrop-blur-md px-4 py-3 border-t border-border-strong',
            'motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out',
            'translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0',
            'no-hover:translate-y-0 max-md:in-data-[active=true]:translate-y-0',
          )}
        >
          {project.technologies.map((tech) => (
            <span key={tech.name} className="flex" title={tech.name}>
              <TechIcon technology={tech} size={28} className="size-7 object-contain" />
            </span>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-6">
        <span className="w-fit text-[10px] uppercase tracking-[0.2em] font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
          {project.category}
        </span>

        <Heading className="font-display text-2xl font-semibold text-sand mb-3 leading-none">
          {project.title}
        </Heading>

        <ExpandableDescription text={project.description} className="mb-6" />

        <ProjectLinks title={project.title} links={project.links} />
      </div>
    </div>
  )
}
