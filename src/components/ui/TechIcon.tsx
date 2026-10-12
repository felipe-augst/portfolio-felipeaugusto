import { ServerImage } from '@/components/ui/ServerImage'
import type { IconTechnology } from '@/types/technologies'

type TechIconProps = {
  technology: IconTechnology
  // Largura e altura, em px.
  size: number
  // Ao lado do nome visível da tecnologia, o ícone é decorativo e fica com `alt=""`.
  decorative?: boolean
  className?: string
}

// Ícone de uma tecnologia, usado no hero, na gaveta dos cards e em /stack. O texto alternativo é
// o nome da tecnologia.
export function TechIcon({ technology, size, decorative = false, className }: TechIconProps) {
  return (
    <ServerImage
      src={technology.icon}
      alt={decorative ? '' : technology.name}
      width={size}
      height={size}
      className={className}
    />
  )
}
