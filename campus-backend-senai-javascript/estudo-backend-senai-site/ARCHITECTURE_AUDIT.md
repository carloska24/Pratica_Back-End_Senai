# Auditoria de arquitetura · Campus Backend JavaScript 6.0

## Estado atual

O Campus usa Next.js App Router, React, TypeScript, Monaco Editor, Framer Motion e Lucide. O frontend permanece propositalmente separado da futura execução de código não confiável.

## Organização

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  Classroom.tsx
  LessonDetail.tsx
lib/
  course.ts
  courseLibrary.ts
  lessonContent.ts
  functionExamples.ts
```

### Responsabilidades

- `course.ts`: grade, progresso e trilha planejada.
- `courseLibrary.ts`: aulas, exercícios, desafios e códigos JavaScript.
- `lessonContent.ts`: camada pedagógica detalhada usada tanto pela aula atual quanto pelo histórico.
- `functionExamples.ts`: 20 exemplos guiados de funções JavaScript.
- `LessonDetail.tsx`: um único componente visual para aula atual e conteúdo reestudado.
- `Classroom.tsx`: navegação entre aula, biblioteca e exemplos.
- `page.tsx`: shell da aplicação, dashboard, currículo, laboratório, arena e desempenho.

## Decisões corretas da trilha JavaScript

1. JavaScript virou a linguagem pedagógica principal.
2. A trilha futura foi refeita para Backend com Node.js, HTTP, Express e banco de dados.
3. O histórico lógico não foi zerado; ele foi traduzido para a sintaxe e os conceitos reais do JavaScript.
4. A numeração de exercícios foi normalizada por módulo.
5. O Laboratório deixou de aceitar `.java` e passou a aceitar `.js` / `.mjs`.
6. O antigo arquivo de exemplos de métodos Java foi removido para evitar duas fontes de verdade.
7. `LessonDetail` evita duplicar layouts pedagógicos entre conteúdo atual e histórico.

## Antes de produção

- autenticação e persistência de progresso no servidor;
- banco de dados para histórico de tentativas e XP;
- runner Node.js isolado para código do aluno;
- casos de teste para todos os exercícios avaliativos, além da missão M07 já coberta localmente;
- limites de CPU, memória e tempo;
- testes unitários e E2E do próprio Campus;
- rotas reais para módulos/aulas em vez de toda a navegação depender de estado local;
- telemetria pedagógica opcional e transparente.

## Regra de segurança do Laboratório

No estágio atual, o código é executado somente em um Web Worker do navegador, sem acesso ao DOM, com rede desativada e timeout. Ele não entra no processo do Next.js. A arquitetura futura para conteúdos de Backend deve usar um worker Node.js separado e isolado, com políticas explícitas de CPU, memória, tempo e acesso à rede.
