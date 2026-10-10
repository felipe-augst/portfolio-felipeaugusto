import type { PageSeo, SiteConfig } from '@/types/site'

export const SITE = {
  url: 'https://devfelipeaugusto.com.br',
  name: 'Felipe Augusto',
  role: 'Fullstack Developer',
  description:
    'Fullstack Developer construindo produtos digitais com React, Next.js, TypeScript e Node.js. Portfolio de projetos em produção com foco em performance, acessibilidade e qualidade de código.',
  locale: 'pt_BR',
  location: {
    city: 'Jundiaí',
    region: 'SP',
    country: 'BR',
  },
  cv: {
    path: '/felipe_augusto_fullstack_cv.pdf',
    downloadName: 'felipe-augusto-fullstack-cv.pdf',
  },
  availability: {
    available: false,
    label: 'Disponível para novos projetos',
  },
} as const satisfies SiteConfig

export const PAGES = {
  home: {
    path: '/',
  },
  stack: {
    path: '/stack',
  },
  projects: {
    path: '/projects',
  },
} as const satisfies Record<string, PageSeo>
