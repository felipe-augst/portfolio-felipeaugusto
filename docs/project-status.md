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

| Issue | Ticket                                                   | Bloqueado por      | Status       | Branch                         | PR  |
| ----- | -------------------------------------------------------- | ------------------ | ------------ | ------------------------------ | --- |
| #34   | Atualizar Next.js e dependências vulneráveis             | —                  | entregue     | `chore/34-update-next-deps`    | #49 |
| #35   | Infra E2E com Playwright + CI endurecido                 | #34                | entregue     | `chore/35-e2e-infra-ci`        | #50 |
| #36   | Rotas estáticas + tela de boas-vindas uma vez por sessão | #35                | em andamento | `feat/36-static-routes-splash` | —   |
| #37   | SEO e metadados por rota                                 | #35                | em andamento | `fix/37-seo-metadata`          | —   |
| #38   | Shell de página, landmarks e página 404                  | #35                | livre        | —                              | —   |
| #39   | Lista de projetos no HTML inicial + imagens e fontes     | #35                | livre        | —                              | —   |
| #40   | Remover motion e respeitar movimento reduzido            | #36                | bloqueado    | —                              | —   |
| #41   | Menu como diálogo modal + navegação interna consistente  | #35                | livre        | —                              | —   |
| #42   | Seção de contato acessível                               | #35                | livre        | —                              | —   |
| #43   | Card de projeto acessível + correção dos dados           | #39                | bloqueado    | —                              | —   |
| #44   | Headers de segurança + CSP report-only                   | #36                | bloqueado    | —                              | —   |
| #45   | Web Vitals em produção + orçamento de JS inicial         | #39, #40, #42, #43 | bloqueado    | —                              | —   |
| #46   | Fonte única de dados + limpeza + documentação            | #36–#45            | bloqueado    | —                              | —   |

**Frontier:** #38. Também estão livres #39, #41 e #42. O #36 e o #37 estão em andamento em paralelo, cada um no seu worktree.

## Handoff

Uma entrada por ticket `em andamento` ou `em revisão`. A entrada é removida quando o ticket é entregue.

### #36 — feat/36-static-routes-splash

- **Estado:** branch criada a partir da `develop` (`5c0fd67`) no worktree `../portfolio-felipeaugusto-36`. Leva também o passo 7 do #35 (este status) e o `--autostash` no passo 3 do workflow. Nenhum critério de aceite implementado.
- **Próximo passo:** passo 4 do workflow: ler a issue, a seção da spec #33 e o guia do Next em `node_modules/next/dist/docs/` sobre renderização estática e scripts no `<head>`; depois, red → green pelo primeiro critério.
- **Atenção:** o #37 roda em paralelo no worktree `.claude/worktrees/crystalline-imagining-cray` (`fix/37-seo-metadata`), e a entrada de handoff dele fica na branch dele. O Playwright sobe o servidor na porta fixa 3100 com `reuseExistingServer: false`, então duas suítes E2E ao mesmo tempo colidem: rode uma de cada vez. Os dois tickets devem mexer no layout raiz, então quem fizer o merge depois atualiza a branch com a `develop` antes.

<!--
Modelo de entrada:

### #NN — <tipo>/<NN>-<slug>

- **Estado:** o que já está feito e verificado.
- **Próximo passo:** a próxima ação concreta.
- **Atenção:** armadilhas, pendências, o que ficou para outro ticket.
-->

## Avisos de ambiente

Valem até o ticket indicado ser entregue. Remova o aviso quando isso acontecer.

- **Enquanto houver tickets em paralelo:** a suíte E2E sobe o servidor na porta fixa 3100 com `reuseExistingServer: false`. Duas suítes ao mesmo tempo, em worktrees diferentes, falham com `http://localhost:3100 is already used`. Rode uma de cada vez, ou use uma config local, fora do repo, que importe a `playwright.config.ts` e troque só a porta (`baseURL`, `webServer.command`, `webServer.url`) e os caminhos (`testDir`, `outputDir`, `webServer.cwd`).
- **Até o #46:** depois de um `next dev`, o `typecheck` e o `next build` falham com `TS6133` em `.next/dev/types/validator.ts`, um arquivo gerado pelo dev que o `tsconfig` inclui (`.next/dev/types/**/*.ts`). Apague `.next/dev` antes de verificar. Tirar esse include do `tsconfig` é decisão de limpeza do #46.
- **Até o dono decidir:** a `main` não tem branch protection, apesar de a documentação antiga dizer que tinha. Configurar a proteção é decisão do dono do repo.
- **Até o #46:** o `AGENTS.md` abre com o bloco gerenciado do Next (`<!-- BEGIN:nextjs-agent-rules -->` … `<!-- END:nextjs-agent-rules -->`), que veio do create-next-app. Desde o Next 16.3, o `next dev` reescreve o conteúdo entre esses marcadores com o texto da versão instalada quando detecta um agente de IA (opção `agentRules`, ligada por padrão), e isso gera diff no `AGENTS.md`. Não commite essa mudança junto com um ticket. Manter o bloco ou desligar com `agentRules: false` é decisão de documentação do #46. No Next 16.4, o `next build` também pode parar com um lembrete de upgrade (`experimental.agentUpgrade`) quando houver advisory para a versão instalada. Repetir o comando continua o build.

## Registro de decisões

Decisões que não estão na spec #33. A mais recente fica no topo.

- **2026-10-10:** o script inline do `<head>` é `HEAD_SCRIPT`, em `src/lib/head-script.ts`, e não no componente da tela: exports de um módulo `'use client'` chegam ao Server Component como referência de cliente, não como string. Ele marca o `<html>` com `data-js` (sempre) e `data-splash` (primeira página da sessão, flag `splash-seen` no `sessionStorage`). A tela usa a variante `splash:` do Tailwind (`@custom-variant` no `globals.css`) e remove o `data-splash` no `transitionend` do fade. O `<html>` tem `suppressHydrationWarning`. O conteúdo do script é fixo, e o #44 coloca o hash dele na CSP.
- **2026-10-10:** a tela de boas-vindas é decorativa (`aria-hidden`), sem papel nem nome acessível. Por isso os testes dela localizam pelas saudações (`getByText`), exceção à regra de `getByRole`. Os testes de timer esperam em tempo real: com `page.clock`, o tempo pode avançar antes de a hidratação registrar os timers. Para afirmar "nunca visível", o teste confere na hora com `isVisible()`, porque `toBeHidden({ timeout: 0 })` espera sem limite.
- **2026-10-10:** em `next dev`, os atributos do `<html>` sobrevivem à hidratação (amostrado a cada 0,5 s), e a tela aparece e some como em produção. Não foi preciso reaplicar os atributos no remount do Strict Mode, como o guia `preventing-flash-before-hydration` sugere.
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

- 2026-10-10 — Suíte E2E com Playwright, CI endurecido, Dependabot, `.gitattributes`, Node 24 e regra de `import type` mergeados na `develop` (#50), e o #35 foi fechado. Ficam livres #36, #37, #38, #39, #41 e #42.
- 2026-10-10 — Next.js e `eslint-config-next` 16.4.0 + `npm audit fix` mergeados na `develop` (#49), e o #34 foi fechado. O audit de produção dá 0 vulnerabilidades, e o #35 está livre.
- 2026-10-09 — CI passa a rodar em push e PR para a `develop` (#48). A parte do gatilho do #35 foi antecipada; o resto do ticket continua aberto.
- 2026-10-09 — Documentação de agentes, skill `/ticket` e configuração sem atribuição de IA mergeadas na `develop` (#47).
- 2026-10-09 — Histórico reescrito para remover os trailers de co-autoria de IA de 2 commits: `a13a22d` → `88fcfe3`, `4bc7dbc` → `a78a331`, `55e7b17` → `4a6ba99`. Os trees são idênticos. Force-push na `main` e na `develop`, e a tag `v1.0.0` foi recriada. A descrição do PR #30 foi limpa.
- 2026-10-09 — Documentação de agentes criada: `AGENTS.md`, `docs/agents/workflow.md`, `docs/agents/standards.md`, `docs/project-status.md` e template de PR.
- 2026-10-09 — Tag `v1.0.0` criada na `main`; milestone `v2.0.0` criado com #33–#46.
- 2026-10-09 — Tickets #34–#46 publicados com dependências nativas.
- 2026-10-09 — Spec #33 publicada.
- 2026-10-09 — Auditoria completa do repositório no commit `a13a22d` (hoje `88fcfe3`, com o mesmo código).
