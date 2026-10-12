# Portfolio — Felipe Augusto

Portfolio profissional construído com foco em performance, acessibilidade e práticas modernas de desenvolvimento.

🔗 **Live**: [devfelipeaugusto.com.br](https://devfelipeaugusto.com.br)

![CI](https://github.com/felipe-augst/portfolio-felipeaugusto/actions/workflows/ci.yml/badge.svg)

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Linguagem**: TypeScript 5 (strict + noUncheckedIndexedAccess)
- **Estilização**: Tailwind CSS v4 (CSS-first, com os tokens no `@theme inline` do `globals.css`)
- **Fontes**: Fraunces (serif), DM Sans (sans) e Cinzel (display), carregadas pelo `next/font`
- **Ícones**: lucide-react na interface e SVGs próprios para tecnologias e redes sociais
- **Métricas**: Vercel Web Analytics e Speed Insights
- **Tooling**: ESLint 9 (flat config), Prettier, Husky, lint-staged, commitlint
- **Testes**: Playwright (E2E contra o build de produção) + axe-core
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions

## Decisões técnicas

**Rotas estáticas.** `/`, `/stack`, `/projects` e a 404 são geradas no build (`○ (Static)`) e servidas pela CDN. Nenhum layout ou página lê cookies, headers ou search params: o que muda por visitante acontece no navegador.

**Tela de boas-vindas uma vez por sessão, decidida antes da primeira pintura.** Um script inline e bloqueante no `<head>` (`src/lib/head-script.ts`) marca o `<html>` com `data-js` e, quando a flag do `sessionStorage` ainda não existe, grava a flag e marca `data-splash`. A tela aparece pelo CSS (variante `splash:` do Tailwind), sem esperar a hidratação, e o componente só cuida da troca de idioma e da saída. Storage indisponível conta como "não vista". Sem JS, a tela não aparece e o conteúdo fica visível.

**Server Components por padrão, ilhas de cliente nas folhas.** Seções, cards, páginas e o shell das páginas renderizam no servidor. O `'use client'` fica só na menor folha que precisa de estado, efeito ou API do navegador, e o servidor passa os dados a ela por props ou `children`:

| Ilha de cliente                    | Para quê                                                    |
| ---------------------------------- | ----------------------------------------------------------- |
| `MenuOverlay`                      | botão Menu e `<dialog>` modal nativo                        |
| `SplashScreen`                     | troca de idioma e saída da tela de boas-vindas              |
| `RotatingWord`                     | palavra que troca no título do contato e para sozinha       |
| `ExpandableDescription`            | "Ler mais", que só aparece quando a descrição transborda    |
| `ActiveItemList`                   | card ativo da fileira de projetos (`IntersectionObserver`)  |
| `RevealOnScroll`                   | entrada das seções ao rolar                                 |
| `BackButton` + `NavigationTracker` | "Voltar" que só usa o histórico depois de navegação no site |
| `PreloadedImage`                   | imagem de fundo do hero, a única com preload                |

O JS da home fica abaixo de 150 kB comprimidos, e o `e2e/js-budget.spec.ts` trava esse limite.

**Lista de projetos em CSS.** Os destaques da home e `/projects` usam o mesmo `ProjectList`, com o mesmo HTML em todos os tamanhos: abaixo de `md`, uma fileira deslizável com `scroll-snap`; a partir de `md`, um grid. Não há carrossel nem media query em JS. A parte de cliente é o `ActiveItemList`, que marca o card ativo da fileira para destacá-lo e abrir a gaveta de tecnologias.

**Imagens montadas no servidor.** O `ServerImage` usa o `getImageProps` do `next/image` e entrega o `<img>` pronto no HTML, com `srcSet`, `sizes` e carregamento preguiçoso, sem levar o componente `Image`, que é uma ilha de cliente, para o navegador.

**Animações em CSS.** As animações são CSS sob `motion-safe:`, e o JS só as dispara. Com movimento reduzido, a página fica parada; sem JS, o conteúdo aparece sem animação.

**Fonte única de dados, tipada.** O conteúdo fica em `src/data/`, em TypeScript puro: a configuração do site (`SITE` e `PAGES`), os projetos, o catálogo de tecnologias e as categorias (lidos pela seção Sobre e por `/stack`) e as redes sociais. Os arquivos usam `as const satisfies Tipo`, que valida a estrutura contra o tipo e preserva os literais.

**`cn()` sem tailwind-merge.** O `cn()` só junta classes, com `clsx`. O `tailwind-merge` custava cerca de 8 kB no cliente. Para mudar o estilo de um componente, ele expõe uma prop, como o `variant` do `Button`, em vez de sobrescrever classes.

**SEO e compartilhamento.** Cada rota declara título, descrição, canonical e `og:url`. A imagem de prévia é gerada por arquivo (`opengraph-image.tsx`), e sitemap, robots e JSON-LD saem da mesma configuração do site.

**Segurança.** Headers de segurança e uma CSP em report-only valem para todas as rotas (`next.config.ts`), sem o `X-Powered-By`.

**Acessibilidade.** WCAG 2.1 AA: um `<main>` e um `<h1>` por rota, menu como diálogo modal nativo, foco visível, nomes acessíveis em pt-BR e contraste conferido. A suíte E2E roda o axe em todas as rotas.

## Como rodar

Requer Node 24 (versão em `.nvmrc`).

```bash
npm install
npm run dev
```

Servidor em [http://localhost:3000](http://localhost:3000).

## Testes E2E

A suíte usa Playwright e roda sempre contra o build de produção. O `npm run test:e2e` faz `next build`, sobe o `next start` na porta 3100 e derruba o servidor no fim. A porta 3100 precisa estar livre: a suíte nunca reaproveita um servidor que já esteja rodando, nem o dev server.

```bash
npx playwright install --no-shell chromium  # uma vez, e de novo quando o Playwright mudar de versão
npm run test:e2e                           # suíte completa
npx playwright test e2e/menu.spec.ts       # um arquivo
npx playwright test --project=http         # só os testes de request, sem navegador
npx playwright show-report                 # relatório HTML da última execução
```

Os testes ficam em `e2e/`, em três projetos:

| Projeto            | O que roda                                                                |
| ------------------ | ------------------------------------------------------------------------- |
| `http`             | arquivos `*.http.spec.ts`: requests sem navegador (status, headers, HTML) |
| `desktop-chromium` | demais arquivos `*.spec.ts`, no Chromium desktop                          |
| `mobile-chromium`  | os mesmos arquivos, no Chromium com emulação de Pixel 7                   |

Os testes verificam só o que é visível de fora (status, headers, HTML servido, árvore de acessibilidade, foco e rede) e localizam os elementos por papel e nome acessível em pt-BR. O axe roda pela fixture `makeAxeBuilder`, de `e2e/fixtures.ts`.

No CI, a suíte roda em todo push e PR para `develop` e `main`. Quando ela falha, o relatório do Playwright fica disponível como artefato `playwright-report` na execução do workflow.

## Scripts

| Script                 | Descrição                                         |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Desenvolvimento com Turbopack                     |
| `npm run build`        | Build de produção                                 |
| `npm run lint`         | ESLint                                            |
| `npm run lint:fix`     | ESLint com auto-fix                               |
| `npm run typecheck`    | TypeScript sem emitir                             |
| `npm run format`       | Prettier (escreve)                                |
| `npm run format:check` | Prettier (verifica)                               |
| `npm run test:e2e`     | Suíte E2E (Playwright) contra o build de produção |

## Convenções

- **Commits**: Conventional Commits com scope obrigatório em kebab-case
  - Exemplo: `feat(hero): add cta button`, `fix(menu): correct overflow`
- **Branches**: `<tipo>/<issue>-<slug>` (`feat`, `fix`, `chore`, `refactor`, `test`, `docs`), saindo da `develop`
- **Fluxo**: PRs entram na `develop`; a `main` (produção) recebe só releases versionados (`v1.0.0`, `v2.0.0`…)
- **Agentes de IA**: no Claude Code, `/ticket` executa o workflow (`/ticket`, `/ticket 35`, `/ticket status`, `/ticket release`)
- **Detalhes adicionais**: ver [`AGENTS.md`](./AGENTS.md), [`docs/agents/standards.md`](./docs/agents/standards.md), [`docs/agents/workflow.md`](./docs/agents/workflow.md) e o progresso em [`docs/project-status.md`](./docs/project-status.md)

## Estrutura

```bash
src/
├── app/            # Rotas, layout raiz, 404 e arquivos de metadados (OG, robots, sitemap)
├── components/
│   ├── layout/     # Nav, MenuOverlay, Footer, SplashScreen, PageShell, NavigationTracker
│   ├── sections/   # Seções da home: Hero, About, FeaturedProjects, Contact
│   └── ui/         # Primitivos e ilhas: Button, ProjectList, ProjectCard, StackTile, TechIcon, ServerImage…
├── data/           # Fonte única: site, projetos, tecnologias, redes sociais e textos
├── types/          # Tipagens compartilhadas
├── lib/            # Utilities puras: cn, script do <head>, metadados, JSON-LD, links
└── hooks/          # Custom hooks (registro da navegação client-side)
e2e/                # Suíte E2E (Playwright) contra o build de produção
public/             # CV e imagens: fundo do hero, projetos, tecnologias e redes sociais
docs/               # Status do projeto e documentação para agentes
```

---

Construído por [Felipe Augusto](https://www.linkedin.com/in/felipeaugst/) — Jundiaí, SP
