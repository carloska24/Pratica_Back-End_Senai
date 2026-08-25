# Design · Perfis de aluno, onboarding e portas dos módulos

## Status

- Branch: `codex/student-onboarding-learning-path`
- Direção aprovada: evolução progressiva local → Supabase
- Primeira audiência: Carlos, um amigo e convidados
- Estado: pronto para planejamento de implementação

## Objetivo

Transformar o Campus Backend de uma experiência pessoal fixa em uma plataforma capaz de receber novos alunos com identidade própria, progresso zerado, orientação inicial e uma introdução pedagógica antes de cada módulo.

O primeiro incremento valida a experiência com perfis locais. A persistência será acessada por contratos assíncronos para que uma implementação Supabase possa substituí-la posteriormente sem reescrever os componentes.

## Entendimento confirmado

- Um novo aluno nunca herda nome, avatar, conquistas ou progresso de Carlos.
- O caminho recomendado começa no M01 com progresso acadêmico zero.
- O diagnóstico inicial é opcional, sem nota e não bloqueia conteúdos.
- Sala de Aula ensina; Laboratório executa, investiga e valida; Arena pratica transferência.
- Cada módulo possui uma Porta do Módulo antes da primeira aula.
- A Porta orienta e produz uma pequena vitória; ela não duplica a aula.
- O laboratório continua executando código localmente em Web Worker.
- A primeira versão é um piloto para convidados, não uma abertura pública.

## Não objetivos da primeira fase

- Autenticação real por senha, Google ou magic link.
- Sincronização entre dispositivos.
- Certificados ou provas invioláveis de conclusão.
- Turmas, professores, convites administrativos ou organizações.
- Nivelamento adaptativo completo.
- Introduções completas de M02–M22.
- Execução de código do aluno no servidor.

## Abordagens consideradas

### 1. Evolução progressiva local → Supabase — escolhida

Cria primeiro os contratos de identidade e progresso, um adapter local, onboarding e Porta do M01. Depois substitui o adapter pelo Supabase Auth + PostgreSQL.

Vantagens: valida a aprendizagem cedo, reduz dependência externa durante o piloto e força limites arquiteturais corretos.

### 2. Supabase desde o primeiro incremento

Entrega contas e sincronização imediatamente, mas combina risco pedagógico, visual, de dados e de segurança na mesma entrega.

### 3. Clerk + PostgreSQL

Entrega autenticação pronta e customizável, porém separa identidade e progresso entre fornecedores e adiciona sincronização por webhook.

## Jornada do aluno

```text
Portal de Entrada
      ↓
Criar ou escolher perfil local
      ↓
Escolher ponto de partida
      ├── Começar do zero — recomendado
      ├── Já estudei um pouco — futuro
      └── Diagnóstico opcional — futuro
      ↓
Conheça o Campus
      ↓
Porta do M01
      ↓
Primeira execução
      ↓
Aula 01
      ↓
Dashboard de retomada
```

Estados de entrada:

- `BOOTSTRAPPING`
- `NO_PROFILE`
- `LEGACY_DATA_FOUND`
- `ONBOARDING_REQUIRED`
- `MODULE_INTRODUCTION_REQUIRED`
- `ACTIVE_STUDENT`
- `STORAGE_ERROR`

## Limites de domínio

```text
Identity
├── perfil do aluno
├── perfil ativo
└── preferências de onboarding

Curriculum
├── curso e versão
├── módulos e pré-requisitos
├── introduções
├── aulas
└── desafios

Learning
├── posição atual
├── progresso de introduções e aulas
├── desafios e evidências
├── domínio dos módulos
└── resumos de tentativas

Execution
├── execução local
├── testes de missão
└── resultado estruturado

Infrastructure
├── LocalStudentRepository
├── LocalProgressRepository
├── SupabaseStudentRepository — futuro
└── SupabaseProgressRepository — futuro
```

Currículo não contém progresso pessoal. Componentes não conhecem chaves de armazenamento. Execução não grava progresso diretamente. Serviços de aplicação interpretam resultados e enviam comandos acadêmicos ao repositório.

## Contratos essenciais

Todos os métodos são assíncronos desde a fase local.

```ts
type StudentId = string & { readonly __brand: "StudentId" };
type CourseId = string & { readonly __brand: "CourseId" };
type OperationId = string & { readonly __brand: "OperationId" };

type StudentProfile = {
  id: StudentId;
  displayName: string;
  initials: string;
  mode: "LOCAL" | "ACCOUNT";
  onboardingStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

interface StudentRepository {
  getActiveProfile(): Promise<StudentProfile | null>;
  listProfiles(): Promise<StudentProfile[]>;
  createProfile(input: { displayName: string }): Promise<StudentProfile>;
  activateProfile(studentId: StudentId): Promise<void>;
  updateProfile(studentId: StudentId, input: { displayName?: string }): Promise<StudentProfile>;
}

type LearningScope = {
  studentId: StudentId;
  courseId: CourseId;
  courseVersion: string;
};

interface ProgressRepository {
  load(scope: LearningScope): Promise<LearningSnapshot>;
  apply(
    scope: LearningScope,
    command: ProgressCommand,
    expectedRevision: number,
  ): Promise<LearningSnapshot>;
}
```

Cada mutação possui `operationId`; cada snapshot possui `schemaVersion`, `courseVersion` e `revision`. Percentuais são projeções das evidências, nunca a fonte de verdade.

## Estados de aprendizagem

```text
NOT_STARTED
    ↓ abre a Porta
INTRODUCTION_STARTED
    ↓ executa o primeiro programa
INTRODUCTION_COMPLETED
    ↓ abre a Aula 01
IN_PROGRESS
    ↓ realiza prática guiada
PRACTICED
    ↓ comprova o checkpoint
MASTERED
```

Abrir ou rolar uma tela não comprova aprendizagem. Errar uma previsão introdutória não altera progresso. Conteúdo dominado continua disponível para revisão.

## Persistência local v2

```text
campus:v2:active-student
campus:v2:student:{studentId}:profile
campus:v2:student:{studentId}:course:{courseId}:{courseVersion}:progress
campus:v2:student:{studentId}:migration:{migrationId}
```

- IDs locais são opacos e gerados com `crypto.randomUUID()`.
- Documentos são validados com Zod nas fronteiras.
- Erros de armazenamento são visíveis e recuperáveis.
- Componentes acessam serviços/hooks, nunca `localStorage` diretamente.

## Dados legados

As chaves atuais são dados sem proprietário. Nunca serão importadas automaticamente para um novo perfil.

```text
Dados antigos detectados
       ↓
“Encontramos estudos anteriores neste navegador”
       ↓
Importar para meu perfil | Começar do zero | Decidir depois
       ↓
Validar e converter
       ↓
Gravar snapshot v2 e recibo idempotente
```

Na primeira implementação, as chaves antigas permanecem intactas. O perfil de Carlos poderá recebê-las por uma ação explícita posterior.

## Portal de Entrada

O portal combina apresentação da jornada e criação/seleção do perfil. Não deve parecer um formulário SaaS genérico.

```text
┌─────────────────────────────────────────────────────────────┐
│ JS CAMPUS BACKEND                              Ajuda         │
├────────────────────────────┬────────────────────────────────┤
│ PORTAL DE ENTRADA          │ PREPARE SEU CAMPUS             │
│                            │                                │
│ Comece do zero.            │ Como devemos chamar você?     │
│ Entenda a lógica.          │ [ Nome de exibição          ] │
│ Chegue ao Backend.         │                                │
│                            │ [ Criar meu perfil local     ] │
│ M01 → Aula → Lab → Backend │                                │
│                            │ Perfil salvo neste navegador. │
└────────────────────────────┴────────────────────────────────┘
```

A interface deve dizer claramente que perfil local não é uma conta e ainda não sincroniza entre dispositivos.

## Porta do M01

### Pergunta central

> Como fazemos o computador guardar uma informação, trabalhar com ela e mostrar uma resposta?

### Promessa

> Neste módulo, você escreverá seus primeiros programas e aprenderá a acompanhar o que acontece com os valores.

### Pré-requisito

Nenhum conhecimento de programação. Apenas uso básico de teclado, mouse e navegador.

### Resultados observáveis

- Guardar informações em variáveis.
- Fazer cálculos simples com esses valores.
- Observar resultados no console.

### Rota

```text
Conhecer valores → Criar variáveis → Fazer cálculos → Observar → Resolver missão
```

### Previsão sem nota

```js
console.log("Olá, Campus!");
```

Pergunta: “O que você acha que aparecerá?”

- `Olá, Campus!`
- `console.log`
- Nada aparecerá

O erro recebe feedback neutro e convida o aluno a executar. Não gera nota, XP, bloqueio ou registro de falha.

### Primeira vitória

O aluno executa o exemplo, troca o texto pelo próprio nome e executa novamente. Meta: concluir sem ajuda em até dez minutos.

Mensagem:

> Seu primeiro programa respondeu. Agora vamos descobrir como guardar informações para reutilizá-las.

A definição formal de `console.log`, variáveis, tipos e operadores permanece na Aula 01; a Porta não duplica `lessonContent.ts`.

## Acessibilidade

- WCAG 2.2 AA como alvo.
- Link “Pular para o conteúdo”.
- `:focus-visible` consistente e contrastante.
- Labels persistentes; não depender apenas de placeholder.
- Feedback dinâmico em `aria-live`.
- Estados comunicados por texto e ícone, não apenas cor.
- Alvos principais preferencialmente com 44 × 44 px.
- Operação por teclado e reflow em 320 CSS px.
- Suporte a `prefers-reduced-motion`.
- Foco movido ao título principal após mudanças de etapa.

## Segurança e futura autenticação

Na fase local, o perfil organiza dados no navegador; ele não oferece segurança, autenticação ou sincronização.

Na fase Supabase:

- sessões SSR em cookies, nunca tokens de autenticação no `localStorage`;
- `userId` derivado da sessão e nunca aceito no body;
- autorização centralizada numa Data Access Layer;
- RLS e grants mínimos em todas as tabelas expostas;
- políticas separadas para `SELECT`, `INSERT`, `UPDATE` e `DELETE`;
- índice em colunas `user_id` usadas pelas políticas;
- validação Zod nas fronteiras;
- nenhuma `service_role` no navegador;
- código do aluno não é armazenado como progresso;
- exclusão e exportação de dados antes de abertura pública.

O adapter Supabase permanecerá isolado porque `@supabase/ssr` ainda possui API marcada como beta.

## Estratégia de testes

### Contrato dos repositórios

- aluno A nunca lê dados do aluno B;
- operação repetida não duplica resultado;
- revisão antiga produz conflito;
- dados inválidos são rejeitados;
- reset de um módulo não afeta outro;
- snapshot preserva IDs e versão do curso;
- falha de armazenamento não é silenciosa.

### Jornada

- perfil novo começa com progresso zero;
- identidade fixa de Carlos não aparece;
- onboarding retoma após recarregar;
- Porta do M01 exige primeira execução para conclusão;
- previsão incorreta não bloqueia;
- Aula 01 é o próximo passo explícito;
- dois perfis locais não compartilham dados.

### UX e acessibilidade

- teclado, foco, regiões vivas e nomes acessíveis;
- 390 px e 1024 px sem overflow horizontal;
- 320 CSS px e zoom de 200% antes da entrega;
- revisão visual por agente independente;
- teste exploratório com o primeiro aluno sem orientação verbal.

## Plano de implementação

1. Separar catálogo acadêmico de progresso pessoal.
2. Definir IDs estáveis, schemas, comandos e `courseVersion`.
3. Criar `StudentRepository` e `ProgressRepository` assíncronos.
4. Implementar e testar adapters locais v2.
5. Introduzir serviços/hooks e retirar acesso direto ao armazenamento dos componentes tocados.
6. Criar Portal de Entrada e perfil local.
7. Criar onboarding curto e estado inicial no M01.
8. Criar Porta do M01 e primeira execução.
9. Integrar retomada e identidade real no shell.
10. Executar suíte, build, auditoria funcional, acessível e visual.
11. Testar com o primeiro aluno.
12. Somente depois implementar Supabase atrás dos mesmos contratos.

## Decisão log

| Decisão | Alternativas | Motivo |
|---|---|---|
| Evolução local → Supabase | Supabase imediato; Clerk + Postgres | Validar aprendizagem cedo sem acoplar UI ao fornecedor |
| Perfil e progresso separados | Um único repositório | Ciclos de vida e riscos diferentes |
| Contratos assíncronos desde o início | API síncrona local | Evitar reescrita quando a rede chegar |
| M01 como começo recomendado | M07 atual; nivelamento obrigatório | Novo aluno precisa de estado real zerado |
| Diagnóstico sem nota | Prova inicial; nenhum diagnóstico | Orienta sem gerar ansiedade ou bloqueio |
| Primeira vitória executável | Introdução textual; vídeo | Ação e feedback em até dez minutos |
| Migração legada explícita | Importação automática | Dados atuais não possuem proprietário verificável |
| Percentual como projeção | Percentual persistido | Evidências são fonte de verdade |
| Código permanece local | Salvar código junto do progresso | Privacidade e redução de superfície de risco |

## Referências

- Next.js Authentication: https://nextjs.org/docs/app/guides/authentication
- Supabase Auth SSR: https://supabase.com/docs/guides/auth/server-side
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Worked examples para programação introdutória: https://doi.org/10.22369/issn.2153-4136/6/1/1
