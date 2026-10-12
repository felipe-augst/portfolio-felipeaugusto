import { ProjectCard } from '@/components/ui/ProjectCard'
import type { Project } from '@/types/projects'

type ProjectListProps = {
  projects: readonly Project[]
  // Nome acessível da lista: o mesmo texto do título da seção ou da página.
  label: string
}

// Lista de projetos dos destaques da home e de /projects, com o mesmo markup em todos os tamanhos.
export function ProjectList({ projects, label }: ProjectListProps) {
  return (
    // `role="list"` explícito: o Safari tira a semântica de lista de um <ul> sem marcadores.
    <ul
      role="list"
      aria-label={label}
      className="mx-auto grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 md:gap-10 xl:grid-cols-3"
    >
      {projects.map((project) => (
        <li key={project.id} className="flex md:w-full">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}
