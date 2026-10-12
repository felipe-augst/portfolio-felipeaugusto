'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Project } from '@/types/projects'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Define se o texto é longo o suficiente para precisar do botão
  const isLongDescription = project.description.length > 120

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
        <Image
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
            <div key={tech.name} className="relative w-7 h-7" title={tech.name}>
              <Image src={tech.icon} alt={tech.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-6">
        <span className="w-fit text-[10px] uppercase tracking-[0.2em] font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
          {project.category}
        </span>

        <h3 className="font-display text-2xl font-semibold text-sand mb-3 leading-none">
          {project.title}
        </h3>

        {/* Descrição + Botão Ler Mais */}
        <div className="mb-6 flex flex-col items-start">
          <p
            className={`font-sans text-sm text-sand-muted leading-relaxed transition-all duration-300 ${
              isExpanded ? 'line-clamp-none' : 'line-clamp-3'
            }`}
          >
            {project.description}
          </p>

          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium text-accent hover:text-accent-warm transition-colors"
            >
              {isExpanded ? (
                <>
                  Menos detalhes <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Ler mais <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Links */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-strong/50">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-sand-muted hover:text-sand transition-colors"
            >
              <Link className="w-5 h-5" /> Código
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:text-accent-warm transition-colors"
            >
              <ExternalLink className="w-5 h-5" /> Deploy
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
