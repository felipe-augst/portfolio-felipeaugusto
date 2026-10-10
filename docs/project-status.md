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

| Issue | Ticket                                                   | Bloqueado por      | Status    | Branch | PR  |
| ----- | -------------------------------------------------------- | ------------------ | --------- | ------ | --- |
| #34   | Atualizar Next.js e dependências vulneráveis             | —                  | livre     | —      | —   |
| #35   | Infra E2E com Playwright + CI endurecido                 | #34                | bloqueado | —      | —   |
| #36   | Rotas estáticas + tela de boas-vindas uma vez por sessão | #35                | bloqueado | —      | —   |
| #37   | SEO e metadados por rota                                 | #35                | bloqueado | —      | —   |
| #38   | Shell de página, landmarks e página 404                  | #35                | bloqueado | —      | —   |
| #39   | Lista de projetos no HTML inicial + imagens e fontes     | #35                | bloqueado | —      | —   |
| #40   | Remover motion e respeitar movimento reduzido            | #36                | bloqueado | —      | —   |
| #41   | Menu como diálogo modal + navegação interna consistente  | #35                | bloqueado | —      | —   |
| #42   | Seção de contato acessível                               | #35                | bloqueado | —      | —   |
| #43   | Card de projeto acessível + correção dos dados           | #39                | bloqueado | —      | —   |
| #44   | Headers de segurança + CSP report-only                   | #36                | bloqueado | —      | —   |
| #45   | Web Vitals em produção + orçamento de JS inicial         | #39, #40, #42, #43 | bloqueado | —      | —   |
| #46   | Fonte única de dados + limpeza + documentação            | #36–#45            | bloqueado | —      | —   |

**Frontier:** #34.

## Handoff

Uma entrada por ticket `em andamento` ou `em revisão`. A entrada é removida quando o ticket é entregue.

_Nenhum ticket em andamento._

<!--
Modelo de entrada:

### #NN — <tipo>/<NN>-<slug>

- **Estado:** o que já está feito e verificado.
- **Próximo passo:** a próxima ação concreta.
- **Atenção:** armadilhas, pendências, o que ficou para outro ticket.
-->

## Avisos de ambiente

Valem até o ticket indicado ser entregue. Remova o aviso quando isso acontecer.

- **Até o #35:** o CI só roda na `main`, então PRs para a `develop` não têm checagem automática. Rode `format:check`, `lint`, `typecheck` e `build` localmente.
- **Até o #35:** no Windows, o `format:check` local acusa CRLF em ~45 arquivos por falta de `.gitattributes`. No CI ele passa. Considere ruído apenas as falhas de fim de linha.
- **Até o #35:** a `main` não tem branch protection, apesar de a documentação antiga dizer que tinha. Configurar a proteção é decisão do dono do repo.

## Registro de decisões

Decisões que não estão na spec #33. A mais recente fica no topo.

- **2026-10-09:** commits e PRs têm só o dono do repositório como autor, sem co-autoria de IA nem menção a ferramentas de IA. A configuração do projeto em `.claude/settings.json` desliga a atribuição automática.
- **2026-10-09:** os PRs para a `develop` usam `Closes #NN`, mas a issue é fechada manualmente depois do merge. As closing keywords só fecham issues em PRs para a branch padrão, e o fechamento é o que libera os tickets bloqueados.
- **2026-10-09:** os PRs de ticket entram na `develop` com squash. O release `develop` → `main` usa merge commit.
- **2026-10-09:** `v1.0.0` é a `main` em `88fcfe3`. Toda a remediação entra na `develop` e vai para a `main` num único release v2.0.0.

## Log

Uma linha por evento, no formato `data — evento (issue/PR)`. O mais recente fica no topo.

- 2026-10-09 — Documentação de agentes, skill `/ticket` e configuração sem atribuição de IA enviadas para revisão em PR para a `develop`.
- 2026-10-09 — Histórico reescrito para remover os trailers de co-autoria de IA de 2 commits: `a13a22d` → `88fcfe3`, `4bc7dbc` → `a78a331`, `55e7b17` → `4a6ba99`. Os trees são idênticos. Force-push na `main` e na `develop`, e a tag `v1.0.0` foi recriada. A descrição do PR #30 foi limpa.
- 2026-10-09 — Documentação de agentes criada: `AGENTS.md`, `docs/agents/workflow.md`, `docs/agents/standards.md`, `docs/project-status.md` e template de PR.
- 2026-10-09 — Tag `v1.0.0` criada na `main`; milestone `v2.0.0` criado com #33–#46.
- 2026-10-09 — Tickets #34–#46 publicados com dependências nativas.
- 2026-10-09 — Spec #33 publicada.
- 2026-10-09 — Auditoria completa do repositório no commit `a13a22d` (hoje `88fcfe3`, com o mesmo código).
