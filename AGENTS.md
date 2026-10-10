<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Convenções do projeto

Fonte de verdade das convenções, para humanos e agentes de IA.

## Antes de agir

- **Sessão:** ao começar ou retomar qualquer sessão, leia `docs/project-status.md`. Lá estão a versão em desenvolvimento, os tickets em andamento e o handoff da última sessão.
- **Ticket, PR ou release:** para pegar, entregar ou fechar um ticket, abrir PR ou preparar um release, siga `docs/agents/workflow.md`.
- **Código:** ao escrever ou revisar UI, rotas, metadados, imagens, animações, dados ou testes, aplique `docs/agents/standards.md`.

## Versões e branches

- `main` é produção, publicada pela Vercel. A tag `v1.0.0` marca o site anterior à remediação da auditoria.
- `develop` integra a v2.0.0 (spec #33, milestone `v2.0.0`). Todo trabalho entra na `develop` por PR. A `main` recebe só o PR de release.
- Branches de trabalho saem da `develop` com o nome `<tipo>/<issue>-<slug>`, onde `<tipo>` é `feat`, `fix`, `chore`, `refactor`, `test` ou `docs`.
- Commits e títulos de PR seguem Conventional Commits, com scope obrigatório em kebab-case: `feat(hero): add cta button`.
- Commits e PRs têm só o dono do repositório como autor. Ficam sem trailer de co-autoria de IA e sem menção a ferramentas de IA na descrição.

## Stack

- Next.js 16 (App Router) + React 19
- Node 24 LTS, versão única em `.nvmrc` e `engines`
- TypeScript 5 (strict + noUncheckedIndexedAccess)
- Tailwind v4 CSS-first: design tokens em `globals.css`, classes geradas via `@theme inline`
- ESLint 9 (flat config) + Prettier; Husky + lint-staged + commitlint
- Playwright + `@axe-core/playwright` para a suíte E2E

## Estrutura de pastas

- `src/app/` — rotas e arquivos de metadados (App Router)
- `src/components/ui/` — primitivos reutilizáveis
- `src/components/sections/` — seções da home
- `src/components/layout/` — Nav, MenuOverlay, Footer, tela de boas-vindas
- `src/data/` — fonte única de dados (constantes em UPPER_SNAKE_CASE)
- `src/types/` — tipagens compartilhadas
- `src/lib/` — utilities puras
- `src/hooks/` — custom hooks
- `e2e/` — suíte E2E (Playwright) contra o build de produção
- `docs/agents/` — documentação operacional para agentes

## Nomenclatura

- Componentes em PascalCase (`Button.tsx`, `Hero.tsx`); demais arquivos em kebab-case (`use-scroll.ts`)
- Identificadores em inglês
- Tudo o que o usuário lê fica em pt-BR, inclusive `alt`, `aria-label` e metadados
- Constantes de config em UPPER_SNAKE_CASE

## TypeScript

- `import type { X }` para imports só de tipo
- Dados estáticos usam `as const satisfies Tipo`, sem anotação de tipo na constante (a anotação anula o `as const`)
- `src/data/` e `src/types/` dependem só de TypeScript puro, sem bibliotecas de UI
- Tipo incerto: `unknown` + narrowing
- Imports internos pelo alias `@/`

## Design tokens (globals.css)

- Cores com prefixo `--color-*` (bg, sand, accent…); componentes usam os tokens no lugar de cores literais
- Fontes: `--font-serif` (Fraunces), `--font-sans` (DM Sans), `--font-display` (Cinzel)
