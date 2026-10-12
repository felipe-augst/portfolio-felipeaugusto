import type { Project } from '@/types/projects'
import { TECHNOLOGIES } from '@/data/technologies'

export const PROJECTS: Project[] = [
  {
    id: 'devstore',
    title: 'DevStore',
    description:
      'DevStore é um e-commerce completo que demonstra na prática o uso de diferentes estratégias de renderização do Next.js (SSG, SSR, ISR), design system próprio, gerenciamento de estado global com Zustand, testes automatizados e pipeline CI/CD.',
    image: '/images/projects/devstore.webp',
    category: 'frontend',
    technologies: [
      TECHNOLOGIES.next,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.tailwind,
      TECHNOLOGIES.zustand,
      TECHNOLOGIES.vitest,
      TECHNOLOGIES.eslint,
      TECHNOLOGIES.testinglibrary,
      TECHNOLOGIES.githubactions,
      TECHNOLOGIES.vercel,
    ],
    links: {
      github: 'https://github.com/felipe-augst/dev-store',
      live: 'https://dev-store-zeta.vercel.app/',
    },
    featured: true,
  },
  {
    id: 'devstore-api',
    title: 'DevStore API',
    description:
      'API REST para e-commerce de periféricos tech. Node.js, Fastify, TypeScript, PostgreSQL e Prisma. Autenticação JWT, validação com Zod e deploy no Render com banco Neon.',
    image: '/images/projects/devstore-api.webp',
    category: 'backend',
    technologies: [
      TECHNOLOGIES.node,
      TECHNOLOGIES.fastify,
      TECHNOLOGIES.postgres,
      TECHNOLOGIES.prisma,
      TECHNOLOGIES.zod,
      TECHNOLOGIES.jwt,
    ],
    links: {
      github: 'https://github.com/felipe-augst/devstore-api',
    },
    featured: true,
  },
  {
    id: 'kinogarten',
    title: 'KinoGarten',
    description:
      'Plataforma de eventos e ingressos de cinema, desenvolvida como desafio técnico Elite Dev da Verzel. Integração com API (TMDb), mapa de assentos interativo, checkout com pagamento simulado, ingresso com QR code HMAC não forjável e validação de portaria em tempo real (câmera e código manual). Autenticação JWT própria com 3 papéis, proteção contra concorrência via constraint de banco, testes automatizados (Vitest + Playwright E2E) com CI isolado em banco de teste. Lighthouse 97/100/100/100.',
    image: '/images/projects/kinogarten.webp',
    category: 'fullstack',
    technologies: [
      TECHNOLOGIES.next,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.tailwind,
      TECHNOLOGIES.postgres,
      TECHNOLOGIES.prisma,
      TECHNOLOGIES.jwt,
      TECHNOLOGIES.zod,
      TECHNOLOGIES.docker,
      TECHNOLOGIES.vitest,
      TECHNOLOGIES.playwright,
      TECHNOLOGIES.githubactions,
      TECHNOLOGIES.vercel,
    ],
    links: {
      github: 'https://github.com/felipe-augst/kinogarten',
      live: 'https://verzel-elitedev-eventos.vercel.app/',
    },
    featured: true,
  },
  {
    id: 'portfolio',
    title: 'Portfólio',
    description:
      'Meu portfólio pessoal, desenvolvido com Next.js 16, TypeScript e Tailwind CSS. Inclui seções de projetos, tecnologias utilizadas e informações de contato.',
    image: '/images/projects/portfolio.webp',
    category: 'frontend',
    technologies: [
      TECHNOLOGIES.next,
      TECHNOLOGIES.react,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.tailwind,
      TECHNOLOGIES.eslint,
      TECHNOLOGIES.githubactions,
      TECHNOLOGIES.vercel,
    ],
    links: {
      github: 'https://github.com/felipe-augst/portfolio-felipeaugusto',
      live: 'https://devfelipeaugusto.com.br',
    },
    featured: false,
  },
  {
    id: 'brunelli-irezumi',
    title: 'Brunelli Irezumi',
    description:
      'Site institucional para estúdio de tatuagem japonesa em Jundiaí-SP. Next.js 15 App Router, TypeScript, TailwindCSS. SEO completo com Metadata, Open Graph, JSON-LD Schema (TattooParlor), next/font e next/image otimizados. Lighthouse 97/100/100/100. Deploy na Vercel com domínio personalizado.',
    image: '/images/projects/brunelli-irezumi.webp',
    category: 'frontend',
    technologies: [
      TECHNOLOGIES.next,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.tailwind,
      TECHNOLOGIES.vitest,
      TECHNOLOGIES.eslint,
      TECHNOLOGIES.githubactions,
      TECHNOLOGIES.vercel,
    ],
    links: {
      github: 'https://github.com/felipe-augst/brunelli-irezumi',
      live: 'https://brunelli-irezumi.com.br/',
    },
    featured: false,
  },
  {
    id: 'cidadeviva-api',
    title: 'Cidade Viva-API',
    description:
      'API REST de blog sobre cultura urbana, ciclismo e lifestyle de Jundiaí. Node.js, Express, TypeScript, MongoDB e Mongoose. Autenticação JWT, validação com Zod e deploy no Render. Frontend em desenvolvimento para integração Fullstack completa.',
    image: '/images/projects/cidadeviva-api.webp',
    category: 'backend',
    technologies: [
      TECHNOLOGIES.node,
      TECHNOLOGIES.express,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.mongodb,
      TECHNOLOGIES.zod,
      TECHNOLOGIES.jwt,
      TECHNOLOGIES.eslint,
      TECHNOLOGIES.githubactions,
    ],
    links: {
      github: 'https://github.com/felipe-augst/cidadeviva-api',
    },
    featured: false,
  },
  {
    id: 'lacrei-saude',
    title: 'Lacrei Saúde',
    description:
      'Aplicação desenvolvida como desafio técnico para o voluntariado de Frontend da Lacrei Saúde, plataforma de saúde inclusiva para a comunidade LGBTQIAPN+. Construída com Next.js (App Router), TypeScript e Styled-Components com design tokens baseados no Marsha Design System. Inclui testes unitários com Jest e Testing Library, CI/CD com GitHub Actions, acessibilidade testada com leitor de tela NVDA e SEO técnico com Open Graph e JSON-LD Schema.org. Lighthouse: Performance 98 · Accessibility 100 · Best Practices 100 · SEO 100.',
    image: '/images/projects/lacrei-saude.webp',
    category: 'frontend',
    technologies: [
      TECHNOLOGIES.next,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.styledcomponents,
      TECHNOLOGIES.jest,
      TECHNOLOGIES.testinglibrary,
      TECHNOLOGIES.githubactions,
      TECHNOLOGIES.vercel,
    ],
    links: {
      github: 'https://github.com/felipe-augst/lacrei-saude',
      live: 'https://lacrei-saude-teste-tecnico-felipe-augusto.vercel.app/',
    },
    featured: false,
  },
  {
    id: 'selma-bolos',
    title: 'Selma Bolos',
    description:
      'Landing page para uma confeitaria artesanal real, desenvolvida com Next.js 15 e Tailwind CSS. O projeto inclui cardápio completo, calculadora de preços interativa e integração com WhatsApp para pedidos.',
    image: '/images/projects/selmabolos.webp',
    category: 'frontend',
    technologies: [
      TECHNOLOGIES.next,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.tailwind,
      TECHNOLOGIES.vitest,
      TECHNOLOGIES.testinglibrary,
      TECHNOLOGIES.githubactions,
      TECHNOLOGIES.vercel,
    ],
    links: {
      github: 'https://github.com/felipe-augst/selmabolos',
      live: 'https://selmabolos.com.br/',
    },
    featured: false,
  },
]
