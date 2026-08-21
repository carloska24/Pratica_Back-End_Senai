# Arquitetura do Campus Backend

## Objetivo

O Campus é uma aplicação educacional em Next.js que reúne conteúdo, prática interativa e progresso local. A arquitetura atual prioriza três qualidades: leitura fácil para quem está aprendendo, separação clara de responsabilidades e evolução segura para um Backend futuro.

## Estrutura

```text
campus-backend-senai-javascript/
├── src/
│   ├── app/                  entrada do Next.js e estilos globais
│   ├── components/
│   │   ├── classroom/        sala de aula, detalhes e visualização de código
│   │   ├── labs/             experiências interativas das lições
│   │   └── practice/         arena de desafios
│   ├── content/              currículo, biblioteca e conteúdo pedagógico
│   └── lib/                  persistência local e utilitários
├── course/
│   └── exercicios-javascript/  exercícios executáveis por módulo
├── docs/                     arquitetura, produto, pesquisa e assets
└── arquivos de configuração do Next.js e TypeScript
```

## Limites de responsabilidade

| Área | Responsabilidade | Não deve conter |
|---|---|---|
| `src/app/` | Composição das telas e entrada do framework | Conteúdo pedagógico extenso |
| `src/components/` | Interface e interação do aluno | Regras de persistência ou dados duplicados |
| `src/content/` | Fonte de verdade do currículo e das aulas | Estado visual dos componentes |
| `src/lib/` | Serviços e utilitários independentes da interface | Componentes React |
| `course/` | Arquivos de prática acessíveis fora do portal | Implementação interna da aplicação |
| `docs/` | Decisões, contexto e imagens de documentação | Código executado pelo produto |

## Dependências permitidas

```text
src/app
  ├──> src/components
  ├──> src/content
  └──> src/lib

src/components
  ├──> src/content
  └──> src/lib

src/content e src/lib
  └──> não dependem de componentes React
```

O alias `@/` aponta para `src/`, mantendo imports estáveis mesmo quando um domínio ganha novos arquivos internos.

## Componentes principais

- `src/app/page.tsx`: dashboard, currículo, laboratório, arena e desempenho.
- `src/components/classroom/Classroom.tsx`: navegação entre aula atual, biblioteca e exemplos.
- `src/components/classroom/LessonDetail.tsx`: composição pedagógica usada nas aulas e revisões.
- `src/components/practice/PracticeArena.tsx`: desafios de lógica e progresso da arena.
- `src/content/course.ts`: módulos, estado da trilha e foco atual.
- `src/content/courseLibrary.ts`: aulas, exercícios, desafios e códigos de referência.
- `src/content/lessonContent.ts`: explicações pedagógicas detalhadas.
- `src/content/functionExamples.ts`: exemplos guiados de funções.
- `src/lib/progress.ts`: leitura e saneamento do progresso local.

## Segurança do laboratório

O código do aluno é executado somente em um Web Worker do navegador, com rede desativada e limite de tempo. Ele não entra no processo do Next.js.

Uma futura execução Backend deverá permanecer em um worker Node.js isolado, com limites explícitos de CPU, memória, tempo e acesso à rede.

## Evolução planejada

- dividir `src/app/page.tsx` quando cada área receber rotas próprias;
- extrair contratos de progresso antes de adicionar persistência remota;
- adicionar testes unitários para conteúdo e saneamento de progresso;
- adicionar testes E2E para sala de aula, arena e laboratório;
- criar um runner isolado antes de aceitar código no servidor;
- registrar decisões estruturais relevantes em documentos curtos dentro de `docs/`.
