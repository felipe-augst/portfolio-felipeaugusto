import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type IconProps = {
  icon: LucideIcon
  className?: string
}

// Ícone lucide decorativo: fica ao lado de um texto que já diz o que ele mostra.
export function Icon({ icon: IconComponent, className }: IconProps) {
  return (
    <IconComponent className={cn('shrink-0', className)} aria-hidden="true" focusable={false} />
  )
}
