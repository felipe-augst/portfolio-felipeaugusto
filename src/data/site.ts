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

// Título completo de cada rota, como aparece na aba e na prévia de compartilhamento.
export const PAGES = {
  home: {
    path: '/',
    title: `${SITE.name} | ${SITE.role}`,
    description: SITE.description,
  },
  stack: {
    path: '/stack',
    title: `Tecnologias | ${SITE.name}`,
    description:
      'Tecnologias e ferramentas que uso no dia a dia como desenvolvedor fullstack: interfaces, APIs, bancos de dados, testes e CI/CD.',
  },
  projects: {
    path: '/projects',
    title: `Projetos | ${SITE.name}`,
    description: `Projetos em produção de ${SITE.name}: aplicações web, APIs REST e sites com Next.js, TypeScript e Node.js, com o código aberto no GitHub.`,
  },
} as const satisfies Record<string, PageSeo>
