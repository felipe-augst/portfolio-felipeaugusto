import { cn } from '@/lib/cn'

type SectionEyebrowProps = {
  children: string
  className?: string
}

// Rótulo decorativo (traço + texto) acima do título. Fica fora da árvore de acessibilidade:
// quem navega por leitor de tela ouve o título da seção, que vem logo depois.
export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex items-center gap-5 font-serif text-[18px] uppercase tracking-[0.35em] text-sand-muted',
        className,
      )}
    >
      <span className="h-px w-8 bg-accent" />
      {children}
    </div>
  )
}
