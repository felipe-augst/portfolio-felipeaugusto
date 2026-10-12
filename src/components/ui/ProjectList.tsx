import type { ComponentProps } from 'react'
import { ActiveItemList } from '@/components/ui/ActiveItemList'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { cn } from '@/lib/cn'
import type { Project } from '@/types/projects'

type ProjectListProps = {
  projects: readonly Project[]
  // Nome acessível da lista: o mesmo texto do título da seção ou da página.
  label: string
  // Nível do título de cada card, um abaixo do título da seção ou da página.
  cardHeadingLevel: ComponentProps<typeof ProjectCard>['headingLevel']
}

// Lista de projetos dos destaques da home e de /projects, com o mesmo markup em todos os tamanhos:
// uma fileira deslizável com snap em telas estreitas (sangrando até a borda da tela) e grid a
// partir de md. Na fileira, o card ativo fica em destaque e os demais encolhem um pouco.
export function ProjectList({ projects, label, cardHeadingLevel }: ProjectListProps) {
  return (
    <ActiveItemList
      label={label}
      className={cn(
        '-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-6',
        'md:mx-0 md:grid md:grid-cols-2 md:gap-10 md:overflow-visible md:px-0 xl:grid-cols-3',
      )}
    >
      {projects.map((project) => (
        <li
          key={project.id}
          className={cn(
            'flex w-[80vw] shrink-0 snap-center sm:w-80 md:w-full',
            'max-md:data-[active=false]:scale-95 motion-safe:transition-transform motion-safe:duration-500',
          )}
        >
          <ProjectCard project={project} headingLevel={cardHeadingLevel} />
        </li>
      ))}
    </ActiveItemList>
  )
}
