# Arquitetura do Campus Backend

## Objetivo

O Campus é uma aplicação educacional em Next.js que reúne conteúdo, prática interativa e progresso local. A arquitetura atual prioriza três qualidades: leitura fácil para quem está aprendendo, separação clara de responsabilidades e evolução segura para um Backend futuro.

## Estrutura

```text
Pratica_Back-End_Senai/
├── src/
│   ├── app/                  entrada do Next.js e estilos globais
│   ├── course/               currículo, biblioteca e conteúdo pedagógico
│   ├── features/
│   │   ├── classroom/        sala de aula, detalhes e experiências interativas
│   │   ├── practice/         arena de desafios
│   │   └── shell/            composição da aplicação e navegação local
│   ├── progress/             persistência local e regras de progresso
│   └── runner/               análise, testes e execução em Web Worker
├── course/
│   └── exercicios-javascript/  exercícios executáveis por módulo
├── docs/                     arquitetura, produto, pesquisa e assets
└── arquivos de configuração do Next.js e TypeScript
```

## Limites de responsabilidade

| Área | Responsabilidade | Não deve conter |
|---|---|---|
| `src/app/` | Composição das telas e entrada do framework | Conteúdo pedagógico extenso |
| `src/features/` | Interface e interação do aluno organizadas por capacidade | Regras de persistência ou dados duplicados |
| `src/course/` | Fonte de verdade do currículo e das aulas | Estado visual dos componentes |
| `src/progress/` | Persistência local, saneamento e projeções de progresso | Componentes de interface |
| `src/runner/` | Contratos, análise e execução local de JavaScript | Componentes React ou persistência acadêmica |
| `course/` | Arquivos de prática acessíveis fora do portal | Implementação interna da aplicação |
| `docs/` | Decisões, contexto e imagens de documentação | Código executado pelo produto |

## Dependências permitidas

```text
src/app
  └──> src/features

src/features
  ├──> src/course
  ├──> src/progress
  └──> src/runner

src/course, src/progress e src/runner
  └──> não dependem de componentes React
```

O alias `@/` aponta para `src/`, mantendo imports estáveis mesmo quando um domínio ganha novos arquivos internos.

## Componentes principais

- `src/app/page.tsx`: adaptador mínimo da rota principal.
- `src/features/shell/CampusApp.tsx`: dashboard, currículo, laboratório, arena e desempenho.
- `src/features/classroom/Classroom.tsx`: navegação entre aula atual, biblioteca e exemplos.
- `src/features/classroom/LessonDetail.tsx`: composição pedagógica usada nas aulas e revisões.
- `src/features/practice/PracticeArena.tsx`: desafios de lógica e progresso da arena.
- `src/course/course.ts`: módulos, estado da trilha e foco atual.
- `src/course/courseLibrary.ts`: aulas, exercícios, desafios e códigos de referência.
- `src/course/lessonContent.ts`: explicações pedagógicas detalhadas.
- `src/course/functionExamples.ts`: exemplos guiados de funções.
- `src/progress/storage.ts`: leitura e saneamento do progresso local.
- `src/progress/useCampusProgress.ts`: projeção reativa do progresso acadêmico.
- `src/progress/courseProgress.ts`: evolução visual dos módulos com base no domínio registrado.
- `src/runner/browserRunner.ts`: ciclo de vida do Web Worker e timeout.
- `src/runner/missions.ts`: testes executados para as missões M07–M12.
- `src/runner/missionCatalog.ts`: códigos iniciais e nomes de arquivos das missões.
- `src/runner/analyzer.ts`: análise estática introdutória do código digitado.

## Segurança do laboratório

O código do aluno é executado no navegador, separado da interface por um Web Worker, com limite de 1,5 segundo e bloqueio explícito das principais APIs de rede. Ele não entra no processo do Next.js. Esse mecanismo reduz impacto sobre a interface, mas não constitui uma sandbox de segurança completa.

Uma futura execução Backend deverá permanecer em um worker Node.js isolado, com limites explícitos de CPU, memória, tempo e acesso à rede.

## Evolução planejada

- dividir `src/app/page.tsx` quando cada área receber rotas próprias;
- extrair contratos de progresso antes de adicionar persistência remota;
- adicionar testes unitários para conteúdo e saneamento de progresso;
- adicionar testes E2E para sala de aula, arena e laboratório;
- criar um runner isolado antes de aceitar código no servidor;
- registrar decisões estruturais relevantes em documentos curtos dentro de `docs/`.
