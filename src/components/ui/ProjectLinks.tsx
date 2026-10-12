import { BookOpen, ExternalLink, Link } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { focusRing } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { NEW_TAB_NOTICE, opensInNewTab } from '@/lib/links'
import type { Project } from '@/types/projects'

type ProjectLinksProps = {
  title: string
  links: Project['links']
}

type ProjectLink = {
  key: keyof Project['links']
  label: string
  icon: LucideIcon
  className: string
}

// Ordem, texto visível, ícone e cor de cada link do card.
const PROJECT_LINKS = [
  { key: 'github', label: 'Código', icon: Link, className: 'text-sand-muted hover:text-sand' },
  {
    key: 'live',
    label: 'Deploy',
    icon: ExternalLink,
    className: 'text-accent hover:text-accent-warm',
  },
  {
    key: 'apiDocs',
    label: 'Documentação',
    icon: BookOpen,
    className: 'text-sand-muted hover:text-sand',
  },
] as const satisfies readonly ProjectLink[]

// Links do card de projeto. O leitor de tela ouve de qual projeto é cada link e se ele abre em
// nova aba: o texto visível vem primeiro, e o resto fica em sr-only.
export function ProjectLinks({ title, links }: ProjectLinksProps) {
  return (
    <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-border-strong/50">
      {PROJECT_LINKS.map(({ key, label, icon, className }) => {
        const href = links[key]
        if (!href) return null
        const newTab = opensInNewTab(href)
        return (
          <a
            key={key}
            href={href}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className={cn(
              'flex items-center gap-2 text-sm transition-colors',
              className,
              focusRing,
            )}
          >
            <Icon icon={icon} className="size-5" />
            {label}
            <span className="sr-only">
              {` do projeto ${title}`}
              {newTab && ` ${NEW_TAB_NOTICE}`}
            </span>
          </a>
        )
      })}
    </div>
  )
}
