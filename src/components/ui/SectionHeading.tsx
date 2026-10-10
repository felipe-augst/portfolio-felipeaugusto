import { cn } from '@/lib/cn'

type SectionHeadingProps = {
  title: string
  highlight?: string
  as?: 'h1' | 'h2'
  className?: string
}

// Título de seção com o trecho final em accent ("Projetos em *destaque*").
export function SectionHeading({
  title,
  highlight,
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        'font-serif text-4xl font-light leading-tight tracking-[-0.03em] md:text-6xl',
        className,
      )}
    >
      {title}
      {highlight && (
        <>
          {' '}
          <span className="text-accent">{highlight}</span>
        </>
      )}
    </Tag>
  )
}
