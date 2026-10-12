import type { IconTechnology, TechCategory, Technology } from '@/types/technologies'

// Catálogo único de tecnologias. As categorias, o hero e os projetos usam as entradas daqui.
export const TECHNOLOGIES = {
  // Linguagens & Core
  html: { name: 'HTML5', icon: '/images/stacks/html5.svg' },
  css: { name: 'CSS3', icon: '/images/stacks/css3.svg' },
  js: { name: 'JavaScript', icon: '/images/stacks/javascript.svg' },
  ts: { name: 'TypeScript', icon: '/images/stacks/typescript.svg' },

  // Ecossistema Frontend
  react: { name: 'React', icon: '/images/stacks/react.svg' },
  next: { name: 'Next.js', icon: '/images/stacks/nextjs.svg' },
  tailwind: { name: 'Tailwind CSS', icon: '/images/stacks/tailwindcss.svg' },
  sass: { name: 'SASS', icon: '/images/stacks/sass.svg' },
  cssmodules: { name: 'CSS Modules' },
  styledcomponents: { name: 'Styled Components', icon: '/images/stacks/styledcomponents.svg' },
  bootstrap: { name: 'Bootstrap', icon: '/images/stacks/bootstrap.svg' },
  zustand: { name: 'Zustand', icon: '/images/stacks/zustand.svg' },

  // Ecossistema Backend
  node: { name: 'Node.js', icon: '/images/stacks/nodejs3.svg' },
  fastify: { name: 'Fastify', icon: '/images/stacks/fastify.svg' },
  postgres: { name: 'PostgreSQL', icon: '/images/stacks/postgresql.svg' },
  mongodb: { name: 'MongoDB', icon: '/images/stacks/mongodb.svg' },
  prisma: { name: 'Prisma', icon: '/images/stacks/prisma.svg' },
  express: { name: 'Express', icon: '/images/stacks/express.svg' },
  jwt: { name: 'JWT', icon: '/images/stacks/jwt.svg' },
  zod: { name: 'Zod', icon: '/images/stacks/zod.svg' },
  restapi: { name: 'REST API' },

  // Qualidade, Ferramentas & Métodos
  vitest: { name: 'Vitest', icon: '/images/stacks/vitest.svg' },
  testinglibrary: { name: 'Testing Library', icon: '/images/stacks/testinglibrary.svg' },
  jest: { name: 'Jest', icon: '/images/stacks/jest.svg' },
  playwright: { name: 'Playwright', icon: '/images/stacks/playwright.svg' },
  e2etesting: { name: 'E2E Testing' },
  eslint: { name: 'ESLint', icon: '/images/stacks/eslint.svg' },
  prettier: { name: 'Prettier' },
  husky: { name: 'Husky' },
  git: { name: 'Git', icon: '/images/stacks/git.svg' },
  github: { name: 'GitHub', icon: '/images/stacks/github.svg' },
  githubactions: { name: 'GitHub Actions', icon: '/images/stacks/githubactions.svg' },
  vite: { name: 'Vite', icon: '/images/stacks/vitejs.svg' },
  npm: { name: 'NPM', icon: '/images/stacks/npm.svg' },
  docker: { name: 'Docker', icon: '/images/stacks/docker.svg' },
  vercel: { name: 'Vercel', icon: '/images/stacks/vercel.svg' },
  railway: { name: 'Railway' },
  render: { name: 'Render' },
  neon: { name: 'Neon' },
  figma: { name: 'Figma', icon: '/images/stacks/figma.svg' },
  vscode: { name: 'VS Code', icon: '/images/stacks/vs-code.svg' },
} as const satisfies Record<string, Technology>

// Tecnologias principais: os ícones do hero e o `knowsAbout` do JSON-LD.
export const CORE_STACK = [
  TECHNOLOGIES.react,
  TECHNOLOGIES.next,
  TECHNOLOGIES.ts,
  TECHNOLOGIES.sass,
  TECHNOLOGIES.tailwind,
  TECHNOLOGIES.node,
  TECHNOLOGIES.postgres,
  TECHNOLOGIES.mongodb,
] as const satisfies readonly IconTechnology[]

// Categorias de tecnologias: a seção Sobre lista os nomes, e /stack, os tiles.
export const TECH_CATEGORIES = [
  {
    title: 'Frontend',
    technologies: [
      TECHNOLOGIES.react,
      TECHNOLOGIES.next,
      TECHNOLOGIES.ts,
      TECHNOLOGIES.tailwind,
      TECHNOLOGIES.sass,
      TECHNOLOGIES.html,
      TECHNOLOGIES.js,
      TECHNOLOGIES.css,
      TECHNOLOGIES.cssmodules,
      TECHNOLOGIES.styledcomponents,
      TECHNOLOGIES.zustand,
      TECHNOLOGIES.bootstrap,
    ],
  },
  {
    title: 'Qualidade, Ferramentas & Métodos',
    technologies: [
      TECHNOLOGIES.vitest,
      TECHNOLOGIES.testinglibrary,
      TECHNOLOGIES.jest,
      TECHNOLOGIES.playwright,
      TECHNOLOGIES.e2etesting,
      TECHNOLOGIES.eslint,
      TECHNOLOGIES.prettier,
      TECHNOLOGIES.husky,
      TECHNOLOGIES.git,
      TECHNOLOGIES.github,
      TECHNOLOGIES.githubactions,
      TECHNOLOGIES.vite,
      TECHNOLOGIES.npm,
      TECHNOLOGIES.docker,
      TECHNOLOGIES.vercel,
      TECHNOLOGIES.railway,
      TECHNOLOGIES.render,
      TECHNOLOGIES.neon,
      TECHNOLOGIES.figma,
      TECHNOLOGIES.vscode,
    ],
  },
  {
    title: 'Backend & API',
    technologies: [
      TECHNOLOGIES.node,
      TECHNOLOGIES.postgres,
      TECHNOLOGIES.mongodb,
      TECHNOLOGIES.fastify,
      TECHNOLOGIES.prisma,
      TECHNOLOGIES.express,
      TECHNOLOGIES.jwt,
      TECHNOLOGIES.zod,
      TECHNOLOGIES.restapi,
    ],
  },
] as const satisfies readonly TechCategory[]
