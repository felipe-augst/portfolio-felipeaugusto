import { TechIcon } from '@/components/ui/TechIcon'
import { cn } from '@/lib/cn'
import type { Technology } from '@/types/technologies'

type StackTileProps = {
  technology: Technology
}

// Tile de uma tecnologia em /stack: o ícone, decorativo, e o nome. Sem ícone, o tile mostra só o
// nome. A partir de md, em dispositivos com hover, o nome fica escondido e aparece com o hover; sem
// hover, o tile fica como nas telas estreitas, com o nome sempre à mostra abaixo do ícone.
export function StackTile({ technology: { name, icon } }: StackTileProps) {
  return (
    <div
      className={cn(
        'group relative flex aspect-square flex-col items-center justify-center overflow-hidden',
        'rounded-2xl border border-white/5 bg-sand-muted/20 backdrop-blur-sm',
        'transition-all duration-300 hover:border-white/20 hover:bg-sand/70',
      )}
    >
      {icon && (
        <TechIcon
          technology={{ name, icon }}
          size={48}
          decorative
          className="opacity-80 transition-transform duration-300 group-hover:opacity-100 md:group-hover:-translate-y-3"
        />
      )}

      <span
        className={cn(
          'block px-2 text-center font-sans text-[12px] font-medium uppercase leading-tight sm:text-xs',
          'text-sand-muted transition-all duration-300 ease-out group-hover:text-bg',
          icon && [
            'mt-3 md:absolute md:bottom-4 md:mt-0',
            'md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100',
            'no-hover:static no-hover:mt-3 no-hover:translate-y-0 no-hover:opacity-100',
          ],
        )}
      >
        {name}
      </span>
    </div>
  )
}
