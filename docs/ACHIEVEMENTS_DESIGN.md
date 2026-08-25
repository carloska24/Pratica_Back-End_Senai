# Design · Salão de Maestria

## Status

- Branch: `codex/student-onboarding-learning-path`
- Direção aprovada: Salão de Maestria
- Estado: aprovado para implementação

## Objetivo

Transformar conquistas em provas visuais da evolução acadêmica do aluno. Um troféu precisa responder o que foi aprendido, qual evidência o liberou e qual é o próximo objetivo — nunca apenas recompensar abertura de tela ou clique.

## Princípios

- Conquistas são projeções do `LearningSnapshot`; não são booleanos gravados manualmente.
- Um perfil novo não herda troféus de outro aluno.
- Medalhas representam atividades relevantes; troféus representam domínio de módulos ou etapas.
- Material visual indica profundidade: bronze, prata, ouro e platina azul.
- Estados bloqueado, em progresso e conquistado são comunicados por texto, forma e cor.
- Animação de celebração é curta e respeita `prefers-reduced-motion`.
- A primeira coleção é pequena e auditável; novos troféus só entram quando houver evidência confiável.

## Arquitetura

```text
AchievementDefinition
        ↓
AchievementEvaluator(LearningSnapshot)
        ↓
AchievementProjection: locked | in-progress | earned
        ↓
MasteryHall
```

O catálogo descreve identidade, categoria, nível visual, critérios e progresso. O avaliador é puro e determinístico. A apresentação não decide elegibilidade.

## Coleção inicial

| Conquista | Evidência | Categoria |
|---|---|---|
| Primeiro Sinal | Introdução do M01 concluída | Marco |
| Primeira Construção | Primeira aula praticada | Marco |
| Fundação Erguida | M01 dominado | Domínio |
| Ciclo Completo | Introdução, prática e domínio do M01 | Marco |
| Erro que Virou Aprendizado | `NEEDS_REVIEW` seguido de `COMPLETED` na mesma atividade | Evolução |
| Explorador da Arena | Três desafios dominados | Desafio |
| Campeão da Arena | Seis desafios dominados | Desafio |
| Arquiteto de Funções | M07 dominado | Domínio |
| Base Consolidada | M01–M06 dominados | Domínio |
| Rumo ao Backend | M01–M07 dominados | Marco |
| Especialista em Formação | M01–M12 dominados | Troféu máximo |

`Conhecimento que Permanece` fica fora do catálogo executável até existir evidência de revisão espaçada.

## Experiência

```text
┌──────────────────────────────────────────────────────┐
│ SALÃO DE MAESTRIA                      3 conquistadas │
│ Provas reais da evolução do aluno                    │
├──────────────────────────────────────────────────────┤
│ Troféu em destaque  | Evidências | Próximo objetivo │
├──────────────────────────────────────────────────────┤
│ Marcos da Jornada                                    │
│ Domínio Técnico                                      │
│ Evolução                                             │
│ Desafios                                             │
└──────────────────────────────────────────────────────┘
```

Ao selecionar uma conquista, o palco principal mostra nome, competência, requisito, estado e evidência. Se nenhuma foi conquistada, ele destaca o próximo objetivo possível.

## Acessibilidade e desempenho

- Troféus em SVG inline com título acessível e sem dependência externa.
- Botões com nomes completos; ícones nunca são a única informação.
- Contraste mínimo WCAG AA e foco visível.
- Reflow sem rolagem horizontal em 320, 390 e 1024 CSS px.
- Sem WebGL, canvas ou imagens pesadas.
- Celebração desativada quando o usuário solicitar movimento reduzido.

## Decisões

| Decisão | Alternativas | Motivo |
|---|---|---|
| Salão de Maestria | Constelação; arquivo de credenciais | Maior impacto sem perder seriedade |
| SVG/CSS autoral | Pacote de ícones; imagens geradas | Identidade própria, nitidez e baixo custo |
| Avaliador puro | `earned: true`; estado duplicado | Auditabilidade e isolamento por aluno |
| Evidência antes da decoração | Recompensa por clique | Preservar credibilidade pedagógica |
| Coleção curta | Dezenas de badges | Cada conquista precisa ter significado |
