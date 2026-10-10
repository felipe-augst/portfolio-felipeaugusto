# Status do projeto

Diário de bordo compartilhado entre sessões e terminais. O GitHub é a fonte de verdade do estado das issues e PRs. Este arquivo guarda o que o GitHub não guarda (handoff, branches, decisões) e um painel resumido. A rotina de atualização está em `docs/agents/workflow.md`.

## Versões

| Versão | Estado             | Onde                                                          |
| ------ | ------------------ | ------------------------------------------------------------- |
| v1.0.0 | Em produção        | tag `v1.0.0` na `main` (`88fcfe3`), site anterior à auditoria |
| v2.0.0 | Em desenvolvimento | `develop`, milestone `v2.0.0`, spec #33, tickets #34–#46      |

## Painel da v2.0.0

Status:

- `livre` — todos os bloqueadores fechados, pode começar;
- `bloqueado` — há bloqueador aberto;
- `em andamento` — branch criada, trabalho sem PR;
- `em revisão` — PR aberto para a `develop`;
- `entregue` — mergeado na `develop` e issue fechada.

| Issue | Ticket                                                   | Bloqueado por      | Status     | Branch                      | PR  |
| ----- | -------------------------------------------------------- | ------------------ | ---------- | --------------------------- | --- |
| #34   | Atualizar Next.js e dependências vulneráveis             | —                  | entregue   | `chore/34-update-next-deps` | #49 |
| #35   | Infra E2E com Playwright + CI endurecido                 | #34                | entregue   | `chore/35-e2e-infra-ci`     | #50 |
| #36   | Rotas estáticas + tela de boas-vindas uma vez por sessão | #35                | livre      | —                           | —   |
| #37   | SEO e metadados por rota                                 | #35                | em revisão | `fix/37-seo-metadata`       | #51 |
| #38   | Shell de página, landmarks e página 404                  | #35                | livre      | —                           | —   |
| #39   | Lista de projetos no HTML inicial + imagens e fontes     | #35                | livre      | —                           | —   |
| #40   | Remover motion e respeitar movimento reduzido            | #36                | bloqueado  | —                           | —   |
| #41   | Menu como diálogo modal + navegação interna consistente  | #35                | livre      | —                           | —   |
| #42   | Seção de contato acessível                               | #35                | livre      | —                           | —   |
| #43   | Card de projeto acessível + correção dos dados           | #39                | bloqueado  | —                           | —   |
| #44   | Headers de segurança + CSP report-only                   | #36                | bloqueado  | —                           | —   |
| #45   | Web Vitals em produção + orçamento de JS inicial         | #39, #40, #42, #43 | bloqueado  | —                           | —   |
| #46   | Fonte única de dados + limpeza + documentação            | #36–#45            | bloqueado  | —                           | —   |

**Frontier:** #36, #38, #39, #41 e #42.

## Handoff

Uma entrada por ticket `em andamento` ou `em revisão`. A entrada é removida quando o ticket é entregue.

### #37 — fix/37-seo-metadata

- **Estado:** PR #51 aberto para a `develop`. Os 14 critérios estão atendidos e verificados. Cinco ciclos red → green em `e2e/seo.http.spec.ts` (16 testes de request), com o helper `e2e/html.ts`. Localmente passam `format:check`, `lint`, `typecheck`, `build` e a suíte E2E (25 testes). Conferi a imagem OG de `/stack` renderizada.
- **Próximo passo:** o dono revisa e faz o merge do #51 com squash. Depois, execute o passo 7: fechar o #37 e remover este handoff. Fechar o #37 não libera nenhum ticket sozinho: o #46 ainda espera #36, #38–#45.
- **Atenção:** `SITE.cv` e `SITE.availability` ainda não têm consumidor. Hero e Contato passam a usá-los no #46, junto com o "Jundiaí / SP" escrito à mão no Contato. No build, `/`, `/stack` e `/projects` continuam `ƒ (Dynamic)` por causa do cookie lido no layout, que é escopo do #36. As rotas de metadados deste ticket (`opengraph-image`, `twitter-image`, `robots.txt`, `sitemap.xml`) saem `○ (Static)`. O `<main>`/`<h1>` das subpáginas e a 404 ficam para o #38. Uma 404 sem metadados próprios herda os padrões do layout, sem canonical. Duas suítes rodando ao mesmo tempo em worktrees diferentes disputam a porta 3100: o Playwright para com "already used". Basta rodar de novo quando a outra terminar.

<!--
Modelo de entrada:

### #NN — <tipo>/<NN>-<slug>

- **Estado:** o que já está feito e verificado.
- **Próximo passo:** a próxima ação concreta.
- **Atenção:** armadilhas, pendências, o que ficou para outro ticket.
-->

## Avisos de ambiente

Valem até o ticket indicado ser entregue. Remova o aviso quando isso acontecer.

- **Até o dono configurar:** a `main` não tem branch protection (conferido em 2026-10-10, depois da entrega do #35), apesar de a documentação antiga dizer que tinha. Configurar a proteção é decisão do dono do repo.
- **Até o release v2.0.0:** o CI avisa que `actions/checkout`, `actions/setup-node` e `actions/cache` v4 rodam em Node 20, que está deprecated. A troca de major dessas actions fica para o Dependabot, que só começa a valer quando o `dependabot.yml` chegar à `main`, ou para um ticket próprio.
- **Até o #46:** o `AGENTS.md` abre com o bloco gerenciado do Next (`<!-- BEGIN:nextjs-agent-rules -->` … `<!-- END:nextjs-agent-rules -->`), que veio do create-next-app. Desde o Next 16.3, o `next dev` reescreve o conteúdo entre esses marcadores com o texto da versão instalada quando detecta um agente de IA (opção `agentRules`, ligada por padrão), e isso gera diff no `AGENTS.md`. Não commite essa mudança junto com um ticket. Manter o bloco ou desligar com `agentRules: false` é decisão de documentação do #46. No Next 16.4, o `next build` também pode parar com um lembrete de upgrade (`experimental.agentUpgrade`) quando houver advisory para a versão instalada. Repetir o comando continua o build.

## Registro de decisões

Decisões que não estão na spec #33. A mais recente fica no topo.

- **2026-10-10:** a configuração central é `SITE` em `src/data/site.ts`, ao lado de `PAGES`, que guarda caminho, título completo e descrição de cada rota pública e alimenta o sitemap. As páginas exportam `buildPageMetadata(PAGES.<rota>)` (`src/lib/metadata.ts`), que declara título absoluto, descrição, canonical e `openGraph` com os padrões do site repetidos, porque o merge de metadados do Next é raso. O layout fica com os padrões e um `twitter` só com `card`: o Next preenche título, descrição e imagem do Twitter a partir do `openGraph` da página.
- **2026-10-10:** o merge raso faz o `openGraph` da página descartar a imagem gerada na raiz. Por isso `/stack` e `/projects` têm um `opengraph-image.ts` que reexporta `src/app/opengraph-image.tsx`. A home não precisa: o arquivo da raiz vale para o próprio segmento. O `twitter-image.ts` existe só na raiz e as subrotas o herdam, porque nenhuma página declara `twitter`.
- **2026-10-10:** no JSON-LD, `image` aponta para a rota `/opengraph-image`, o `sameAs` usa só os perfis (GitHub e LinkedIn) dos links sociais, sem e-mail nem WhatsApp, e o `knowsAbout` vem dos nomes do `CORE_STACK`. Antes eram 4 tecnologias e "Fullstack Development" escritos à mão.
- **2026-10-10:** os testes de SEO comparam canonical, `og:url` e imagens com a URL de produção (`https://devfelipeaugusto.com.br`), escrita no próprio teste como valor esperado. Para pedir uma imagem ao servidor de teste, o teste usa só o caminho e a query da URL absoluta.

- **2026-10-10:** os perfis de navegador da suíte E2E usam o Chromium completo no headless novo (`channel: 'chromium'`), no lugar do headless shell padrão do Playwright. O Smart App Control do Windows bloqueia o executável do headless shell, e o Chromium completo é o mesmo navegador do Chrome. O CI instala com `--no-shell`.
- **2026-10-10:** testes de nível de request ficam em arquivos `*.http.spec.ts` e rodam só no projeto `http` do Playwright. Os demais `*.spec.ts` rodam em `desktop-chromium` e `mobile-chromium` (Pixel 7).
- **2026-10-10:** o `webServer` do Playwright sempre roda `next build` + `next start` na porta 3100, com `reuseExistingServer: false`, para a suíte nunca pegar um dev server que esteja aberto. O custo é um segundo build no CI.
- **2026-10-10:** o Dependabot abre os PRs contra a `develop` (`target-branch`), com prefixos `chore(deps)` para npm e `ci(deps)` para actions. O GitHub só lê o `dependabot.yml` da branch padrão, então o Dependabot começa a funcionar no release v2.0.0.
- **2026-10-10:** as 5 vulnerabilidades altas que restam no `npm audit` completo depois do #34 foram aceitas. Elas formam uma única cadeia de dev: `eslint-config-next@16.4.0` → `@next/eslint-plugin-next` → `fast-glob@3.3.1` → `micromatch@4.0.8` → `braces@3.0.3`, com a advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) (DoS por padrões aninhados) e sem versão corrigida publicada. A única correção que o `npm audit` oferece rebaixa o `eslint-config-next` para a 14, o que a spec proíbe. O código só roda no lint e não chega ao bundle nem ao servidor. O critério de segurança vale para as dependências de produção, então o passo de audit do CI (#35) usa `npm audit --omit=dev --audit-level=high`, senão falha. Reavaliar quando sair um `braces` corrigido ou o Dependabot (#35) propuser a atualização.
- **2026-10-09:** a implementação segue TDD, com um critério de aceite por ciclo red → green (commit do teste e depois o da implementação). Os testes são permanentes: um teste só é alterado ou removido quando o ticket muda o comportamento que ele verifica, e o PR declara isso.
- **2026-10-09:** commits e PRs têm só o dono do repositório como autor, sem co-autoria de IA nem menção a ferramentas de IA. A configuração do projeto em `.claude/settings.json` desliga a atribuição automática.
- **2026-10-09:** os PRs para a `develop` usam `Closes #NN`, mas a issue é fechada manualmente depois do merge. As closing keywords só fecham issues em PRs para a branch padrão, e o fechamento é o que libera os tickets bloqueados.
- **2026-10-09:** os PRs de ticket entram na `develop` com squash. O release `develop` → `main` usa merge commit.
- **2026-10-09:** `v1.0.0` é a `main` em `88fcfe3`. Toda a remediação entra na `develop` e vai para a `main` num único release v2.0.0.

## Log

Uma linha por evento, no formato `data — evento (issue/PR)`. O mais recente fica no topo.

- 2026-10-10 — #37 em revisão no PR #51: configuração central do site, metadados e imagens de prévia por rota, robots, sitemap e JSON-LD.
- 2026-10-10 — Suíte E2E com Playwright, CI endurecido (permissões de leitura, audit de produção, job E2E com artefato e cache dos navegadores), Dependabot, `.gitattributes` e Node 24 mergeados na `develop` (#50), e o #35 foi fechado. Ficam livres #36, #37, #38, #39, #41 e #42.
- 2026-10-10 — Next.js e `eslint-config-next` 16.4.0 + `npm audit fix` mergeados na `develop` (#49), e o #34 foi fechado. O audit de produção dá 0 vulnerabilidades, e o #35 está livre.
- 2026-10-09 — CI passa a rodar em push e PR para a `develop` (#48). A parte do gatilho do #35 foi antecipada; o resto do ticket continua aberto.
- 2026-10-09 — Documentação de agentes, skill `/ticket` e configuração sem atribuição de IA mergeadas na `develop` (#47).
- 2026-10-09 — Histórico reescrito para remover os trailers de co-autoria de IA de 2 commits: `a13a22d` → `88fcfe3`, `4bc7dbc` → `a78a331`, `55e7b17` → `4a6ba99`. Os trees são idênticos. Force-push na `main` e na `develop`, e a tag `v1.0.0` foi recriada. A descrição do PR #30 foi limpa.
- 2026-10-09 — Documentação de agentes criada: `AGENTS.md`, `docs/agents/workflow.md`, `docs/agents/standards.md`, `docs/project-status.md` e template de PR.
- 2026-10-09 — Tag `v1.0.0` criada na `main`; milestone `v2.0.0` criado com #33–#46.
- 2026-10-09 — Tickets #34–#46 publicados com dependências nativas.
- 2026-10-09 — Spec #33 publicada.
- 2026-10-09 — Auditoria completa do repositório no commit `a13a22d` (hoje `88fcfe3`, com o mesmo código).
