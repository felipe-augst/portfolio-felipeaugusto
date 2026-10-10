---
name: ticket
description: Executa um ticket da v2.0.0 de ponta a ponta seguindo o workflow do projeto. Sem argumento pega a frontier; aceita número da issue, "status" ou "release".
argument-hint: '[número | status | release]'
disable-model-invocation: true
---

Argumento recebido: `$ARGUMENTS`

1. Leia inteiros `docs/project-status.md` e `docs/agents/workflow.md`. O workflow é a fonte de verdade de cada passo citado abaixo. Esta skill só escolhe o ramo e define onde parar.

2. Siga o ramo do argumento:

   | Argumento              | Ramo                                                    | Concluído quando                                                |
   | ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------- |
   | vazio                  | passo 1; passo 2 pela frontier; passos 3 a 6            | PR aberto e "Encerrando a sessão" feito                         |
   | número (`35` ou `#35`) | passo 1; passo 2 com esse ticket; passos 3 a 6          | PR aberto e "Encerrando a sessão" feito                         |
   | `status`               | só o passo 1, incluindo o passo 7 para PRs já mergeados | painel e frontier reportados, sem branch nova                   |
   | `release`              | seção "Release v2.0.0"                                  | release publicado, ou a condição de entrada que falta reportada |

3. Se o passo 1 encontrar um ticket em andamento, retome esse ticket antes de pegar outro. Cada terminal trabalha um ticket por vez.

4. Se o ticket pedido tiver bloqueador aberto, ou se a condição de entrada do release não for atendida, pare e reporte o que falta.

5. Termine respondendo ao usuário com:
   - ticket (link da issue), branch e PR (link);
   - cada critério de aceite e como ele foi verificado;
   - o que ficou no handoff e a nova frontier.
