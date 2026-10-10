# Padrões de engenharia

Regras que mantêm o site no padrão que ele promete. Cada regra corrige um problema real da auditoria de 2026-10-09 (spec #33).

- Ao escrever código, aplique as seções da área que você está tocando.
- Ao revisar, aplique todas.

Algumas regras dependem de peças que os tickets da v2.0.0 ainda vão criar (suíte E2E, configuração central do site, marcador de JS). Enquanto uma peça não existe, o ticket que a cria é dono dela, e os demais tickets seguem o código atual. O painel em `docs/project-status.md` mostra o que já foi entregue.

## Metas

| Métrica            | Meta                                                    |
| ------------------ | ------------------------------------------------------- |
| Lighthouse         | Performance ≥ 98, A11y 100, Best Practices 100, SEO 100 |
| JS inicial da home | < 150 KB gzip                                           |
| LCP                | < 1,5 s                                                 |
| CLS                | 0                                                       |
| Acessibilidade     | WCAG 2.1 AA                                             |
| Contraste de texto | ≥ 4,5:1 (normal) · ≥ 3:1 (grande)                       |

## Renderização

- **Rotas estáticas.** Toda rota é estática: layouts e páginas renderizam sem cookies, headers ou search params. Personalização por visitante acontece no navegador. O que precisa existir antes da primeira pintura vai num script inline no `<head>`.
- **Conferência no build.** Ao tocar em layout ou página, confira que o `next build` lista a rota como `○ (Static)`.
- **Ilhas de cliente.** Server Component é o padrão. `'use client'` vai só nas **ilhas de cliente**: a menor folha que precisa de estado, efeito ou API do navegador. A seção ou o card que contém a ilha continua no servidor e passa dados por props ou children.
- **Conteúdo no HTML.** Conteúdo indexável (projetos, textos, links) sai no HTML do servidor.
- **Responsivo em CSS.** Layout responsivo é feito em CSS; o que aparece na página é o mesmo em todos os tamanhos.
- **Mutações.** Server Actions e Route Handlers existem só para mutações reais. Hoje o site não tem nenhuma.

## Rotas e metadados

- Cada rota declara `title`, `description`, `alternates.canonical` e `openGraph.url` próprios. O layout raiz fornece apenas os padrões do site.
- A página exporta `metadata = buildPageMetadata(PAGES.<rota>)` (`src/lib/metadata.ts`). Caminho, título completo e descrição da rota ficam em `PAGES`, em `src/data/site.ts`.
- Imagens de prévia (OG/Twitter) vêm do gerador por arquivo do App Router, `src/app/opengraph-image.tsx`. Toda URL de imagem em metadados ou no JSON-LD responde 200.
- O `openGraph` de uma página substitui o do layout e, com ele, a imagem gerada na raiz. Toda subrota com metadados próprios tem um `opengraph-image.ts` que reexporta o gerador da raiz. A imagem do Twitter vem da raiz enquanto a página não declarar `twitter`.
- URL do site, nome, cargo, localização e CV vêm da configuração central do site, `SITE`, em `src/data/site.ts`.
- O cargo é "Fullstack Developer" em todo lugar.
- Toda rota pública nova entra em `PAGES`, que alimenta o sitemap. O robots.txt libera o site inteiro.
- O JSON-LD é serializado com `<` escapado.

## Imagens e fontes

- `next/image` com `fill`, ou responsiva, declara `sizes` coerente com a largura exibida em cada breakpoint.
- Só a imagem LCP da rota recebe a prop `preload` (o `priority` está deprecated no Next 16). Preload de imagem acontece só por essa prop.
- Imagem decorativa usa `alt=""`.
- Imagem informativa tem `alt` em pt-BR que descreve o conteúdo.
- Ícone ao lado de um nome visível, ou dentro de link com `aria-label`, usa `alt=""`.
- Fontes vêm do `next/font`, carregando só os pesos e estilos que existem na fonte e que o site usa.
- Todo asset em `public/` tem referência no código. O que perdeu a referência sai no mesmo PR.

## Movimento

- **CSS.** Animação é CSS (transições ou keyframes nos tokens) sob `motion-safe:`. JS serve só para disparar a animação, por exemplo com `IntersectionObserver`.
- **Sem JS.** O conteúdo fica visível sem JS: o estado inicial oculto só vale com o marcador de "JS disponível" no elemento raiz.
- **Movimento reduzido.** Com movimento reduzido, a página fica estática: nenhuma animação infinita, nenhum deslocamento, nenhuma troca automática de texto. O reset global cobre o CSS. Ilhas de cliente com timers consultam `prefers-reduced-motion`.
- **5 segundos.** Conteúdo que muda sozinho para em menos de 5 s (WCAG 2.2.2).

## Acessibilidade

- Cada rota tem um `<main>` e um único `<h1>`, e a hierarquia de títulos segue em ordem.
- Overlays modais usam `<dialog>` com `showModal()`. O gatilho expõe `aria-expanded` e `aria-controls`.
- Todo controle que expande ou recolhe conteúdo expõe `aria-expanded` e `aria-controls`.
- Informação revelada por hover também aparece com foco dentro (`focus-within`) e em dispositivos sem hover.
- Link externo tem nome acessível que identifica o destino, com contexto (por exemplo, o título do projeto), e avisa em `sr-only` que abre em nova aba. Links `mailto:` abrem na mesma aba.
- Texto animado deixa a parte visual com `aria-hidden` e oferece a frase completa em `sr-only`.
- Todo elemento interativo tem foco visível, com o estilo compartilhado do `Button`.
- Toda combinação nova de texto e fundo tem o contraste conferido contra as metas.

## Navegação

- Navegação interna usa `next/link`. Âncoras da home usam caminho absoluto (`/#contact`).
- O botão "Voltar" usa o histórico só quando houve navegação interna na sessão. Nos outros casos, vai para a home.

## Dados e componentes

- **Fonte única.** Cada informação tem uma única fonte em `src/data/`, e os componentes derivam dela. Por exemplo, a seção Sobre e `/stack` leem o mesmo catálogo de tecnologias.
- **Onde fica o texto.** Conteúdo sobre o Felipe (textos, projetos, contato, links) mora em `src/data/`. Rótulos de interface ("Ler mais", "Fechar") ficam no componente.
- **Reuso.** Antes de escrever markup, procure o componente compartilhado em `src/components/ui/` e `src/components/layout/`. Um padrão que aparece pela segunda vez vira componente.
- **Classes condicionais** usam `cn()`.
- **Ícones lucide** passam pelo wrapper `Icon`.

## Segurança e dependências

- As dependências de produção ficam sem vulnerabilidade `high` ou `critical` (`npm audit --omit=dev`).
- Correções de audit usam `npm audit fix` sem `--force`. Upgrade major acontece num ticket próprio.
- Os headers de segurança ficam na config do Next e valem para todas as rotas.
- Todo script inline novo entra no hash da CSP.
- Segredos ficam em `.env*`, que já está no `.gitignore`.

## Testes

- **Seam único.** Os testes usam um único seam: Playwright contra o build de produção (`next build` + `next start`). Toda a verificação acontece nesse nível.
- **Comportamento externo.** Os testes verificam o que é visível de fora: status HTTP, headers, HTML servido, árvore de acessibilidade, foco, visibilidade e rede.
- **Locators** são por papel e nome acessível em pt-BR (`getByRole`), para sobreviverem a refactors.
- **Arquivos.** Os testes ficam em `e2e/` e importam `test` e `expect` de `e2e/fixtures.ts`. Teste de nível de request, sem navegador, usa o sufixo `.http.spec.ts` e roda só no projeto `http`. Os demais `*.spec.ts` rodam nos projetos `desktop-chromium` e `mobile-chromium`.
- **Critérios de aceite.** Cada critério de aceite tem pelo menos um teste, e o teste nasce _red_ antes da correção (ciclo no passo 4 de `docs/agents/workflow.md`).
- **Testes permanentes.** Um teste de critério de aceite é a trava contra regressão daquele comportamento nos tickets seguintes, e fica na suíte enquanto o comportamento existir.
- **Mudança de comportamento.** Um teste existente só é alterado ou removido quando o ticket muda ou elimina o comportamento que ele verifica. O PR declara isso na seção "Testes alterados ou removidos", citando o critério que justifica.
- **Teste existente falhando.** É regressão: o código é corrigido e o teste fica como está.
- **Axe.** O axe (tags WCAG 2.0/2.1 A e AA) roda nas rotas tocadas, nos perfis desktop e mobile, pela fixture `makeAxeBuilder`.
