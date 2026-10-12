'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { focusRing } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type ExpandableDescriptionProps = {
  text: string
  className?: string
}

// Descrição cortada em três linhas, com "Ler mais" só quando o texto passa do corte, medido no
// navegador. O corte só vale com JS (variante `js:`): sem JS, a descrição aparece inteira. A linha
// do botão tem altura fixa, para o botão aparecer depois da hidratação sem deslocar o card.
export function ExpandableDescription({ text, className }: ExpandableDescriptionProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const textId = useId()

  // Mede com o texto recortado. Expandido, o texto não transborda, e o botão continua lá.
  useEffect(() => {
    const element = textRef.current
    if (!element || expanded) return

    const measure = () => setOverflowing(element.scrollHeight - element.clientHeight > 1)
    // A largura do card muda o corte. A troca de fonte também, sem mudar o tamanho do parágrafo.
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    let active = true
    void document.fonts.ready.then(() => active && measure())

    return () => {
      active = false
      observer.disconnect()
    }
  }, [expanded])

  return (
    <div className={cn('flex flex-col items-start', className)}>
      <p
        ref={textRef}
        id={textId}
        className={cn(
          'font-sans text-sm text-sand-muted leading-relaxed',
          !expanded && 'js:line-clamp-3',
        )}
      >
        {text}
      </p>

      <div className="mt-2 h-5">
        {overflowing && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={textId}
            onClick={() => setExpanded((current) => !current)}
            className={cn(
              'flex h-full items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium',
              'text-accent hover:text-accent-warm transition-colors',
              focusRing,
            )}
          >
            Ler mais
            <Icon
              icon={ChevronDown}
              className={cn('size-3.5 motion-safe:transition-transform', expanded && 'rotate-180')}
            />
          </button>
        )}
      </div>
    </div>
  )
}
