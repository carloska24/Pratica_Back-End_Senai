# Lousa de Execução Pedagógica

## Status

- Design aprovado para implementação.
- Branch de trabalho: `codex/lab-module-ai-tutor`.
- A `main` não deve receber mudanças antes da validação integral.
- Escopo inicial: JavaScript ensinado entre M01 e M07.

## Resumo do entendimento

- A Lousa atual é uma análise estrutural estática e não representa uma execução real.
- A nova Lousa deve ensinar como o computador percorre o código, uma instrução pedagógica por vez.
- O aluno precisa relacionar linha ativa, valores utilizados, resultado, mudança de estado e próximo destino.
- A experiência deve permitir avançar, voltar, reproduzir, pausar e reiniciar sem perder fidelidade.
- A fonte de verdade será um interpretador determinístico local; a IA será somente uma explicação opcional.
- O público principal é um estudante iniciante consolidando lógica, escopo, repetição e funções.
- A experiência será um modo dedicado do Laboratório, não uma seção abaixo do editor atual.

## Critério principal de sucesso

Após qualquer passo, o aluno deve responder sem procurar em outra tela:

1. Qual linha executou?
2. Com quais valores?
3. Qual foi o resultado?
4. O que mudou?
5. O que acontecerá em seguida?

## Premissas não funcionais

- Execução local, sem autenticação e sem dependência obrigatória de rede.
- Preparação abaixo de 200 ms para os exercícios normais do curso.
- Limite inicial de 1.000 snapshots e dois segundos de interpretação.
- Snapshots serializáveis, imutáveis e reproduzíveis.
- Mesma entrada e mesmo contexto sempre produzem a mesma trilha.
- Manutenção pela stack atual de Next.js, React, TypeScript e Monaco.
- WCAG 2.2 nível AA como referência de acessibilidade.
- Código não suportado deve falhar com explicação didática, nunca de forma silenciosa.

## Direção visual

**Nome:** Bancada de Execução Acadêmica.

**Tom:** editorial técnico com densidade controlada.

**Identidade preservada:** navy no chrome, papel na área de estudo, amarelo JavaScript na instrução ativa e azul Campus em controles e relações.

**Âncora memorável:** o mesmo número de snapshot aparece na linha ativa, Professor Digital, memória, pilha e timeline. Ele funciona como referência compartilhada entre causa e consequência.

**DFII:** 15/15.

## Modelo de execução

```text
Código no Monaco
      ↓
@babel/parser gera a AST
      ↓
Interpretador pedagógico local
      ↓
TraceRecorder cria snapshots imutáveis
      ↓
Worker entrega a trilha para a interface
      ↓
Aluno navega sem reexecutar nem desfazer efeitos
```

O interpretador não usará `eval`, `Function`, DOM, rede ou importações dinâmicas.

### Cobertura M01–M07

- `var`, `let` e `const`;
- literais numéricos, textuais, booleanos e `null`;
- operadores aritméticos, relacionais e lógicos;
- atribuição, incremento e decremento;
- blocos, `if`, `else` e `switch`;
- `while`, `do...while` e `for`;
- funções, parâmetros, argumentos e `return`;
- chamadas de funções;
- `console.log`.

## Contrato de snapshot

```ts
type TraceSnapshot = {
  step: number;
  line: number;
  operation:
    | "declare"
    | "assign"
    | "condition"
    | "loop"
    | "call"
    | "return"
    | "console"
    | "complete"
    | "error";
  expression?: {
    source: string;
    substituted: string;
    result: unknown;
  };
  variablesBefore: RuntimeVariable[];
  variablesAfter: RuntimeVariable[];
  callStack: StackFrame[];
  returnValue?: unknown;
  console: ConsoleEntry[];
  explanation: string;
  nextLine?: number;
};
```

O snapshot registra evidências reais. A explicação determinística segue sempre esta ordem:

```text
ação executada
→ valores concretos utilizados
→ resultado
→ alteração de memória ou pilha
→ próxima instrução
```

## Exemplo de trilha

Para `verificarMaioridade(20)`:

1. preparar programa e escopo global;
2. declarar `verificarMaioridade`;
3. chamar a função com argumento `20`;
4. criar o frame da função e associar `idade = 20`;
5. avaliar `idade >= 18` como `20 >= 18 → true`;
6. executar `return true` e remover o frame da função;
7. atribuir `true` a `resultado`;
8. imprimir `true` no console;
9. concluir a execução.

## Wireframe desktop

```text
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ CAMPUS        │ LOUSA DIDÁTICA · M07                     ExercícioAtual.js  │
│ BACKEND       │ Execução local e determinística                ● Pausado    │
│               ├──────────────────────────────────────────────────────────────┤
│ Navegação     │ PASSO 04/09                                                 │
│               │ [↻] [← Voltar] [▶ Play] [Próximo →] [1×]                  │
│               │ 01 ─ 02 ─ 03 ─ [04] ─ 05 ─ 06 ─ 07 ─ 08 ─ 09              │
│               ├──────────────────────────────┬───────────────────────────────┤
│               │ CÓDIGO · SNAPSHOT 04         │ PROFESSOR DIGITAL             │
│               │                              │                               │
│               │ 1 function verificar(idade) {│ CONDIÇÃO AVALIADA             │
│               │▶2   if (idade >= 18) {       │ idade >= 18                   │
│               │ 3     return true;           │ 20 >= 18 → VERDADEIRO        │
│               │ 4   }                        │                               │
│               │                              │ Próxima linha: return true    │
│               ├──────────────────────────────┼───────────────────────────────┤
│               │ EXPRESSÃO ATIVA              │ MEMÓRIA / PILHA               │
│               │ idade >= 18                  │ idade: 20 → 20               │
│               │ 20 >= 18 → true             │ #1 verificar(20) ← topo      │
│               │ caminho: bloco verdadeiro    │ #0 programa global            │
│               ├──────────────────────────────┴───────────────────────────────┤
│               │ RETORNO: pendente · próxima instrução: return true          │
│               ├──────────────────────────────────────────────────────────────┤
│               │ CONSOLE: nenhuma saída neste passo                          │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

O código recebe aproximadamente 58% da bancada. Professor, memória e pilha ficam simultaneamente visíveis no desktop. O console permanece no rodapé por representar saída acumulada.

## Wireframe mobile

```text
┌──────────────────────────────────────┐
│ Campus Backend       M07          CP │
├──────────────────────────────────────┤
│ LOUSA DIDÁTICA · PASSO 04/09         │
│ ━━━━━━━━━━━●━━━━━━━━━━━━━━━━  04/09  │
│ [◀] [▶ Play] [Próximo ▶] [↻]        │
├──────────────────────────────────────┤
│ AGORA                                │
│ if (idade >= 18)                     │
│ 20 >= 18 → VERDADEIRO               │
│ próximo destino: return true         │
├──────────────────────────────────────┤
│ [Código] [Estado] [Pilha] [Saída]    │
├──────────────────────────────────────┤
│ 1 function verificar(idade) {        │
│▶2   if (idade >= 18) {               │
│ 3     return true;                   │
├──────────────────────────────────────┤
│ POR QUE ESTE PASSO?                  │
│ A idade contém 20. Como a condição   │
│ é verdadeira, o bloco será executado.│
└──────────────────────────────────────┘
```

A faixa **Agora** permanece visível ao trocar de aba e preserva linha, expressão, resultado e próximo destino.

## Controles

- **Preparar execução:** interpreta o código e cria a trilha.
- **Próximo:** seleciona o snapshot seguinte.
- **Voltar:** recupera exatamente o snapshot anterior.
- **Play/Pausar:** percorre snapshots já preparados.
- **Reiniciar:** retorna ao snapshot inicial.
- **Timeline:** permite saltar para qualquer snapshot preparado.
- **Velocidade:** `0,5×`, `1×` ou `2×`.

O Play pausa automaticamente em condições, entrada e saída de função, mudança de escopo, retorno, erro e primeira saída no console.

## Estados da experiência

### Aguardando

A ação primária é **Preparar execução passo a passo**. Avançar, voltar e timeline ficam desabilitados.

### Reproduzindo ou pausado

Linha ativa usa fundo amarelo, marcador no gutter e texto. Valores alterados recebem coluna antes/depois, seta e rótulo `alterado`.

### Código alterado

A trilha é marcada como desatualizada e deixa de representar o código atual. O aluno deve preparar uma nova execução.

### Concluído

Estado final, retorno, console e timeline continuam investigáveis. Voltar permanece disponível.

### Erro

O snapshot de falha preserva memória, pilha e console anteriores. A linha e o identificador relacionados são destacados, com ação **Corrigir no editor**.

### Possível loop infinito

A execução é interrompida ao atingir o limite. A interface mostra a condição repetida, os últimos valores e os snapshots finais confiáveis.

## Professor Digital e IA

O Professor Digital determinístico é parte obrigatória de todo snapshot. Ele explica somente fatos produzidos pelo interpretador.

A IA:

- aparece apenas em **Aprofundar esta etapa com IA**;
- recebe o snapshot atual validado;
- pode oferecer analogia, reformulação ou pergunta de fixação;
- não pode alterar linha, valores, condição, retorno, pilha ou diagnóstico;
- não é necessária para utilizar a Lousa.

## Acessibilidade

- ordem do DOM acompanha a ordem pedagógica;
- controles principais com 48 × 48 px no mobile e pelo menos 40 × 40 px no desktop;
- foco permanece no controle acionado após avançar ou voltar;
- estado manual anunciado com `role="status"` e `aria-live="polite"`;
- console exposto como `role="log"`;
- erro que interrompe execução exposto como `role="alert"`;
- cor sempre acompanhada de texto e ícone;
- abas mobile seguem o padrão ARIA de tabs;
- `prefers-reduced-motion` elimina transições e rolagem animada;
- Play pausa quando a aba do navegador perde visibilidade;
- posição de rolagem preservada em cada aba;
- nenhum overflow horizontal em 390 px e 1024 px.

Atalhos opcionais:

```text
Alt + Shift + →       avançar
Alt + Shift + ←       voltar
Alt + Shift + Espaço  reproduzir ou pausar
Alt + Shift + Home    reiniciar
Esc                   sair do modo de interação do Monaco
```

## Componentes previstos

```text
LaboratoryExperience
├── ExecutionToolbar
├── MonacoExecutionEditor
├── CurrentOperation
├── DigitalTeacher
├── RuntimeInspector
│   ├── VariablesBeforeAfter
│   ├── CallStack
│   └── ReturnTransfer
├── ExecutionTimeline
├── ExecutionConsole
└── MobileInspectorTabs
```

```text
src/interpreter/
├── contracts.ts
├── parser.ts
├── interpreter.ts
├── environment.ts
├── expressions.ts
├── statements.ts
├── functions.ts
├── traceRecorder.ts
├── limits.ts
└── interpreter.worker.ts
```

## Estratégia de testes

1. testes unitários para operadores e precedência;
2. variáveis, escopos e tempo de vida;
3. decisões e caminhos não percorridos;
4. laços, contadores e limites;
5. chamadas, parâmetros, argumentos e retornos;
6. snapshots dourados para exercícios representativos de M01–M07;
7. avanço, retorno, salto e reinício da timeline;
8. loops infinitos e sintaxe não suportada;
9. isolamento do Worker e ausência de APIs proibidas;
10. teclado, foco, tabs, regiões live e movimento reduzido;
11. testes visuais em 390, 1024 e 1440 px;
12. medição obrigatória de overflow horizontal;
13. build de produção e console do navegador sem erros.

## Plano de implementação

### Fase 1 — Contratos e trilhas de referência

- definir contratos do runtime e dos snapshots;
- escrever snapshots dourados de M01–M07;
- criar os testes inicialmente falhando.

### Fase 2 — Expressões e memória

- implementar ambientes e escopos;
- avaliar literais, identificadores, operadores e atribuições;
- registrar antes/depois.

### Fase 3 — Controle de fluxo

- implementar blocos, decisões e laços;
- registrar condição substituída, resultado e caminho escolhido;
- aplicar limites de passos e tempo.

### Fase 4 — Funções

- implementar declaração, chamada, parâmetros, frames e retorno;
- produzir call stack e transferência de controle.

### Fase 5 — Isolamento

- mover interpretação para Web Worker;
- implementar cancelamento, timeout e mensagens serializáveis;
- validar ausência de APIs proibidas.

### Fase 6 — Interface dedicada

- substituir o mapa estrutural pela bancada de execução;
- integrar Monaco, timeline, professor, memória, pilha e console;
- implementar estados aguardando, ativo, desatualizado, concluído e erro.

### Fase 7 — Responsividade e acessibilidade

- implementar trilho de navegação em 1024 px;
- implementar faixa Agora e tabs em 390 px;
- validar teclado, foco, leitor de tela, movimento e contraste.

### Fase 8 — Tutor opcional e encerramento

- aterrar a requisição da IA no snapshot selecionado;
- remover React Flow caso não exista outro consumidor;
- executar testes, typecheck, build, auditoria visual e revisão independente.

## Registro de decisões

| Decisão | Alternativas | Motivo |
|---|---|---|
| Interpretador pedagógico próprio | JS-Interpreter; instrumentação nativa | Suporte curricular controlado, linhas originais e explicações confiáveis. |
| Snapshots pré-calculados | Desfazer runtime | Voltar com fidelidade, simplicidade e testabilidade. |
| Código como protagonista | Fluxograma como protagonista | O aluno precisa relacionar execução à instrução real. |
| Modo dedicado | Lousa abaixo do editor | Evita repetição, rolagem e perda de contexto. |
| Professor determinístico primeiro | IA como narrador principal | Valores e caminhos não podem ser inventados. |
| Antes/depois | Mostrar apenas estado atual | Reduz dependência da memória de trabalho. |
| Duas colunas no desktop | Três colunas iguais; abas | Preserva o Monaco e mantém evidências simultaneamente visíveis. |
| Abas somente no mobile | Empilhar tudo | Mantém legibilidade sem perder o resumo Agora. |
| Escopo M01–M07 | JavaScript completo | Entrega verificável e alinhada ao currículo antes de ampliar sintaxe. |

## Fora do escopo inicial

- JavaScript arbitrário ou compatibilidade completa com ECMAScript;
- DOM, eventos do navegador e manipulação de páginas;
- módulos, npm, Node.js ou APIs externas;
- Promises, `async`/`await` e event loop;
- objetos e arrays além do necessário para M01–M07;
- execução remota;
- IA obrigatória;
- sincronização de progresso em servidor.
