# Workflow de tickets e releases

Ciclo de vida de um ticket da v2.0.0, do claim ao release. Os comandos `gh` de issue estão em `docs/agents/issue-tracker.md`.

## Modelo de entrega

- Cada ticket é uma issue com label `ready-for-agent` no milestone `v2.0.0`, filha da spec #33. Os bloqueios são dependências nativas do GitHub ("blocked by").
- Um ticket corresponde a uma branch e a um PR para a `develop`, mergeado com **squash**. O título do PR vira a mensagem do commit, então segue Conventional Commits.
- Closing keywords (`Closes #NN`) só fecham a issue sozinhas em PRs para a branch padrão (`main`). Como os PRs vão para a `develop`, o fechamento é manual, no passo 7. É esse fechamento que libera os tickets bloqueados.
- `docs/project-status.md` viaja com os PRs: é editado na branch do ticket e chega à `develop` no merge. Atualizações feitas depois do merge (passo 7) entram no PR do próximo ticket.

## Passos

### 1. Sincronize

1. Rode `git fetch --prune` e liste os tickets do milestone `v2.0.0` atribuídos a você (`gh issue list --milestone v2.0.0 --assignee @me`).
2. Para cada ticket atribuído, ache a branch pelo número (`git branch -a --list "*/<n>-*"`) e veja se há PR (`gh pr list --head <branch> --state all`):
   - PR mergeado: execute o passo 7 para ele.
   - PR aberto, ou trabalho sem PR: esse é o trabalho em andamento. Faça `git switch <branch>` e retome a partir do handoff dele em `docs/project-status.md`.
3. Confira o painel do status contra o GitHub e corrija divergências.

Concluído quando cada ticket atribuído está classificado como entregue, em revisão ou em andamento, e o painel bate com o estado das issues e PRs.

### 2. Escolha o ticket

- Se o usuário indicou um ticket, use esse, depois de confirmar que todos os bloqueadores estão fechados.
- Senão, pegue a frontier: issue aberta do milestone, com todos os bloqueadores fechados e sem assignee. Em caso de empate, a de menor número.
- Faça o claim com `gh issue edit <n> --add-assignee @me`.

Concluído quando a issue está atribuída a você.

### 3. Prepare a branch

1. `git switch develop && git pull`
2. `git switch -c <tipo>/<n>-<slug>`
3. No status, marque o ticket como `em andamento` com o nome da branch e abra uma entrada de handoff para ele.

Para trabalhar em paralelo em outro terminal, use um `git worktree` por ticket. Dois tickets no mesmo diretório trocariam a branch um do outro.

### 4. Implemente em ciclos red → green

1. Leia a issue inteira (corpo + comentários) e a seção da spec #33 da área do ticket.
2. Leia o guia relevante em `node_modules/next/dist/docs/` antes de escrever código.
3. Trabalhe **um critério de aceite por vez**. Cada ciclo é um tracer bullet:
   1. **Red:** escreva o teste E2E desse critério e rode só esse arquivo (`npx playwright test e2e/<arquivo>`). O teste precisa falhar na asserção do comportamento que ainda não existe. Falha de seletor, de sintaxe ou de servidor ainda não é _red_: corrija o teste até a falha ser a certa. Commite o teste como `test(<scope>): ...`.
   2. **Green:** implemente o mínimo que faz esse teste passar, sem antecipar os próximos critérios. Rode a suíte inteira: os testes anteriores também precisam continuar _green_. Commite como `<tipo>(<scope>): ...`.
   3. Passe para o próximo critério.
4. Critério que não é comportamento observável de fora (versão de dependência, `.gitattributes`, documentação) não entra no ciclo: verifique pelo CI ou manualmente e registre como verificou.
5. Com todos os critérios _green_, refatore. Cada passo de refatoração mantém a suíte _green_.
6. Aplique `docs/agents/standards.md`.
7. Se o ticket mudar uma convenção, estrutura ou padrão descrito em `AGENTS.md` ou em `docs/agents/`, atualize o documento no mesmo PR.
8. Registre no status, em "Registro de decisões", toda decisão de implementação que não esteja na spec.

Escopo de outro ticket fica fora do diff. Anote no handoff o que foi deixado para outro ticket e para qual.

### 5. Verifique

Concluído só quando **todos** valem:

- cada critério de aceite da issue está atendido e tem evidência (teste E2E ou verificação registrada);
- todo teste de ticket anterior que foi alterado ou removido no diff está justificado por um critério deste ticket;
- `format:check`, `lint`, `typecheck`, `build` e a suíte E2E passam localmente;
- a saída do `build` lista as rotas que o ticket tocou como `○ (Static)`.

### 6. Abra o PR

1. Commits em Conventional Commits com scope (o hook do commitlint valida).
2. `git push -u origin <branch>` e depois `gh pr create --base develop`, preenchendo o template de PR:
   - `Closes #<n>`;
   - os critérios de aceite marcados, cada um com a evidência;
   - o que foi verificado manualmente.
3. No status, marque `em revisão` com o número do PR e atualize o handoff.
4. Commite e dê push dessa atualização do status na mesma branch.

O usuário revisa e faz o merge. Faça merge de um PR só quando o usuário pedir.

### 7. Feche após o merge

1. `gh issue close <n> --comment "Entregue na develop via #<pr>; vai para produção na v2.0.0."`
2. No status, marque o ticket como `entregue`, remova o handoff dele, recalcule a frontier e adicione uma linha ao log.

Concluído quando a issue está fechada e os tickets que ela bloqueava aparecem como `livre` no painel.

## Encerrando a sessão

Antes de parar, com o trabalho pronto ou não:

1. Atualize o handoff do ticket no status: estado atual, próximo passo concreto, armadilhas encontradas.
2. Commite e dê push na branch do ticket, para que outro terminal retome com `git switch <branch>`.

Concluído quando `git status` está limpo e a branch existe no remoto com o handoff atualizado.

## Conflitos no project-status.md

Ao atualizar uma branch com a `develop`, resolva conflitos no status preservando as duas versões no log e no registro de decisões. No painel e no handoff, reconstrua a partir do estado real das issues e PRs no GitHub.

## Release v2.0.0

Feito só quando todas as issues do milestone `v2.0.0` estiverem fechadas, exceto a spec #33, e o usuário pedir o release.

1. **Verifique a `develop` atualizada:** suíte completa verde e smoke manual no preview da Vercel da `develop`.
2. **Suba a versão:** numa branch `chore/release-v2.0.0`, mude o `version` do `package.json` para `2.0.0`, marque a v2.0.0 como "em release" no status, abra o PR para a `develop` e espere o merge.
3. **Abra o PR de release:** da `develop` para a `main`, com o título `chore(release): v2.0.0`. O corpo lista os tickets entregues (#34–#46) e traz `Closes #33`. O merge é com **merge commit**, para preservar o histórico da `develop`.
4. **Crie a tag e o release:** tag anotada `v2.0.0` no merge commit da `main`, `git push origin v2.0.0` e `gh release create v2.0.0` com as notas.
5. **Feche o ciclo:** feche o milestone `v2.0.0`. Na `develop`, atualize a tabela de versões do status (v2.0.0 em produção) num PR `docs(status): ...`.
