import type { CTA } from '@/types/cta'

// Itens do menu: seções da home por caminho absoluto, para funcionarem em qualquer página.
export const NAV_ITEMS = [
  {
    label: 'Sobre',
    href: '/#about',
  },
  {
    label: 'Projetos',
    href: '/#projects',
  },
  {
    label: 'Contato',
    href: '/#contact',
  },
] as const satisfies readonly CTA[]
