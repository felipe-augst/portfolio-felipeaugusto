'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Project } from '@/types/projects'

type ProjectCardProps = {
  project: Project
  isActive?: boolean
  priority?: boolean
  variant?: 'carousel' | 'grid'
}

export function ProjectCard({
  project,
  isActive = false,
  priority = false,
  variant = 'grid',
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Define se o texto é longo o suficiente para precisar do botão
  const isLongDescription = project.description.length > 120

  return (
    <div
      className={cn(
        'group relative flex flex-col w-full overflow-hidden',
        'rounded-md border border-border bg-bg-2 transition-all duration-500',
        variant === 'carousel'
          ? isActive
            ? 'opacity-100 scale-100'
            : 'opacity-50 scale-95 md:opacity-100 md:scale-100'
          : 'opacity-100 scale-100',
      )}
    >
      {/* Imagem + Gaveta */}
      {/* Adicionado shrink-0 aqui para a imagem não amassar quando o texto expandir */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden border-b border-border-strong/50">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gaveta de Techs */}
        <div
          className={cn(
            'absolute bottom-0 left-0 w-full flex items-center justify-center gap-3',
            'bg-bg-3/95 backdrop-blur-md px-4 py-3 border-t border-border-strong',
            'transition-transform duration-500 ease-out',
            variant === 'carousel' && isActive
              ? 'translate-y-0'
              : 'translate-y-full lg:group-hover:translate-y-0',
          )}
        >
          {project.technologies.map((tech, index) => (
            <div key={tech.name} className="relative w-7 h-7" title={tech.name}>
              <Image
                src={tech.icon}
                alt={tech.name}
                priority={index < 2}
                fill
                className="object-contain"
              />
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
