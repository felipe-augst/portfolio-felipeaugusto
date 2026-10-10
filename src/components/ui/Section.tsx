import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionProps = {
  id?: string
  className?: string
  children: ReactNode
}

// Espaçamento e largura padrão das seções da home, iguais em todos os breakpoints.
export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'mx-auto w-full max-w-350 px-6 py-10 md:px-12 md:py-20 lg:py-32 xl:py-40',
        className,
      )}
    >
      {children}
    </section>
  )
}
