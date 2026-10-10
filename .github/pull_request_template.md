<!-- Título: Conventional Commit com scope, ex.: fix(seo): set canonical per route -->

Closes #

<!-- A base é a develop, então o Closes não fecha a issue sozinho: ela é fechada manualmente após o merge (docs/agents/workflow.md, passo 7). -->

## O que muda

## Critérios de aceite

<!-- Copie os critérios da issue e marque cada um com a evidência: o teste E2E que o cobre ou como foi verificado. -->

- [ ]

## Testes alterados ou removidos

<!-- Para cada teste existente que foi alterado ou removido: qual teste e qual critério deste ticket muda o comportamento que ele verificava. Se não houver, escreva "Nenhum". -->

Nenhum

## Verificação

- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`, com as rotas tocadas como `○ (Static)`
- [ ] Suíte E2E
- [ ] `docs/project-status.md` atualizado (painel + handoff)
