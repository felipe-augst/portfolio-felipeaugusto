# Portfolio — Felipe Augusto

Portfolio profissional construído com foco em performance, acessibilidade e práticas modernas de desenvolvimento.

🔗 **Live**: [devfelipeaugusto.com.br](https://devfelipeaugusto.com.br)

![CI](https://github.com/felipe-augst/portfolio-felipeaugusto/actions/workflows/ci.yml/badge.svg)

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Linguagem**: TypeScript (strict + noUncheckedIndexedAccess)
- **Estilização**: Tailwind CSS v4 (CSS-first com `@theme inline`)
- **Carrossel**: Embla Carousel (mobile only)
- **Tooling**: ESLint 9, Prettier, Husky, lint-staged, commitlint
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions

## Decisões técnicas

**Server vs Client Components.** A maior parte do site é Server Component (Hero, About, Footer, Stack page) — renderizam no servidor, sem JavaScript no bundle do cliente. Componentes interativos (Skeleton, Nav, Carousel, hooks) usam `'use client'` apenas onde é necessário. Isso reduz bundle inicial e melhora LCP.

**`useSyncExternalStore` para integração com browser APIs.** O Skeleton lê `sessionStorage` (mostrar uma vez por sessão) e o `useMediaQuery` lê `window.matchMedia`. Ambos usam `useSyncExternalStore` em vez do par tradicional `useState + useEffect`, evitando hydration mismatch e cascading renders no React 19. O Skeleton ainda é carregado via `dynamic` com `ssr: false` para eliminar o flash de hidratação.

**Tipagem rigorosa com `as const satisfies`.** Os arquivos em `src/data/` usam `as const satisfies Type` em vez de anotação de tipo direta. Isso valida a estrutura contra o tipo (erros em tempo de compilação) e preserva os tipos literais (autocomplete específico em vez de union genérico).

**Separação `data/` × `types/` × `components/`.** Dados puros (sem UI) ficam em `src/data/`, tipos compartilhados em `src/types/`, componentes em `src/components/`. Tipos não importam de bibliotecas de UI — isso mantém os dados serializáveis e desacopla a camada de apresentação da camada de dados.

**Carrossel híbrido.** Em mobile, projetos são apresentados em carrossel (Embla). Em desktop, vira grid 2x2 ou 3 colunas. A decisão é tomada via `useMediaQuery` e o componente renderiza um ou outro — não os dois com CSS hidden — economizando bundle e DOM.

## Como rodar

```bash
npm install
npm run dev
```

Servidor em [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Descrição                     |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Desenvolvimento com Turbopack |
| `npm run build`        | Build de produção             |
| `npm run lint`         | ESLint                        |
| `npm run lint:fix`     | ESLint com auto-fix           |
| `npm run typecheck`    | TypeScript sem emitir         |
| `npm run format`       | Prettier (escreve)            |
| `npm run format:check` | Prettier (verifica)           |

## Convenções

- **Commits**: Conventional Commits com scope obrigatório em kebab-case
  - Exemplo: `feat(hero): add cta button`, `fix(menu): correct overflow`
- **Branches**: `<tipo>/<issue>-<slug>` (`feat`, `fix`, `chore`, `refactor`, `test`, `docs`), saindo da `develop`
- **Fluxo**: PRs entram na `develop`; a `main` (produção) recebe só releases versionados (`v1.0.0`, `v2.0.0`…)
- **Agentes de IA**: no Claude Code, `/ticket` executa o workflow (`/ticket`, `/ticket 35`, `/ticket status`, `/ticket release`)
- **Detalhes adicionais**: ver [`AGENTS.md`](./AGENTS.md), [`docs/agents/workflow.md`](./docs/agents/workflow.md) e o progresso em [`docs/project-status.md`](./docs/project-status.md)

## Estrutura

```bash
src/
├── app/ # Rotas (App Router)
├── components/
│ ├── ui/ # Primitivos (Button, ProjectCard, ShimmerText)
│ ├── sections/ # Seções da página (Hero, About, FeaturedProjects, Contact)
│ └── layout/ # Nav, MenuOverlay, Skeleton, Footer
├── data/ # Constantes (projetos, skills, social, hero, contact)
├── types/ # Tipagens compartilhadas
├── lib/ # Utilities (cn)
└── hooks/ # Custom hooks (useMediaQuery)
```

---

Construído por [Felipe Augusto](https://www.linkedin.com/in/felipeaugst/) — Jundiaí, SP
