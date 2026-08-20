# Campus Backend · Preparatório para o SENAI

Curso preparatório independente, ministrado pelo Codex para Carlos Pereira, com o objetivo de fortalecer lógica de programação e Backend JavaScript antes e durante seu aprofundamento no SENAI. Não é um produto oficial nem material institucional do SENAI.

O Campus organiza essa formação em uma experiência acadêmica persistente: grade curricular, sala de aula, biblioteca de revisão, exemplos guiados, laboratório, arena e acompanhamento de evolução.

## Migração 6.0 — JavaScript como linguagem principal

Esta versão foi reconstruída pedagogicamente. Não foi feita uma simples troca de palavras de Java para JavaScript.

O histórico conceitual foi preservado, mas os códigos foram reescritos para a linguagem que será usada nas aulas:

- `System.out.println` → `console.log`
- tipos explícitos como `int`, `double`, `String` → valores JavaScript + `let`/`const`
- métodos `public static ...` → funções JavaScript
- `main()` deixou de ser tratado como ponto obrigatório do programa
- igualdade usada nos exercícios → `===` / `!==`
- arquivos `.java` → arquivos `.js`
- Laboratório Monaco configurado para JavaScript
- códigos comentados com `//` para explicar a responsabilidade de cada trecho

## Currículo

A trilha mantém os módulos já estudados como progresso real:

1. Fundamentos JavaScript
2. Estruturas de decisão
3. while
4. for
5. Repetição avançada — contador e acumulador
6. Laços aninhados
7. Funções — domínio comprovado após a missão final atingir 4/4
8. Arrays — quatro aulas visuais, três exercícios e missão final com 6 casos de teste
9. Objetos JavaScript — quatro aulas visuais, três exercícios, desafio integrador e missão final com 6 casos de teste
10. Strings, Math e Date — quatro oficinas visuais, três exercícios, registro de auditoria e missão final com 6 casos de teste
11. Arrays modernos — cinco mapas de execução, quatro exercícios, pipeline de catálogo e missão final com 8 casos de teste
12. JavaScript moderno — cinco aulas comparativas, quatro exercícios, desafio de resposta segura e missão final com 8 casos de teste

A formação será retomada no M13 com módulos ES e seguirá para assincronismo, Node.js, HTTP/REST, Express, arquitetura de API, PostgreSQL, persistência, autenticação, testes, Docker e projeto final.

## Sala de Aula

Todo módulo histórico usa a mesma estrutura pedagógica da aula atual:

- objetivo
- pré-requisitos
- programa inteiro como uma história
- passo a passo do computador
- quatro conceitos centrais
- código JavaScript comentado
- leitura mental
- alertas de confusão
- opção de marcar revisão e reestudar o módulo

## Exercícios

A numeração foi normalizada por módulo. Exemplos:

- `Exercicio01.js`
- `Exercicio02.js`
- `Exercicio03.js`
- `Desafio01.js`
- `DesafioExtra01.js`

Os exercícios antigos foram migrados preservando a lógica estudada, mas usando a sintaxe correta de JavaScript.

## 20 exemplos guiados de Funções

`lib/functionExamples.ts` contém uma sequência progressiva que vai de função simples até um pequeno fluxo de negócio com várias funções. Cada exemplo possui:

- entrada
- processamento
- saída
- objetivo pedagógico
- por que o conceito importa
- analogia visual
- história de execução
- rastreamento das caixinhas
- código comentado com `//`
- erros que confundem
- checkpoint mental

## Laboratório

O Monaco Editor aceita `.js` / `.mjs` e usa sintaxe JavaScript.

A versão atual oferece duas camadas locais:

- análise estrutural de funções, variáveis, estruturas lógicas, saída e sintaxe Java misturada;
- execução dentro de um Web Worker sem acesso ao DOM, com APIs de rede desativadas e interrupção após 1,5 segundo.

A missão final do M07 possui quatro casos de teste funcionais. A missão do M08 possui seis casos para busca, média, array vazio, inclusão e bloqueio de código duplicado. A missão do M09 possui seis casos para totalização de itens, pedido vazio, leitura de propriedades aninhadas, criação de resumo, inclusão e bloqueio de item duplicado. A missão do M10 possui seis casos para normalização de texto, arredondamento monetário, formatação e conversão de datas para UTC. A missão do M11 possui oito casos para confirmar o uso e o comportamento de filter, map, find, every e reduce. A missão do M12 possui oito casos para arrow function, destructuring, spread, rest, parâmetro padrão, optional chaining e nullish coalescing. Os demais arquivos podem ser executados e ter o console capturado, mas ainda não possuem correção semântica específica. Para produção e exercícios de Backend, a evolução continua sendo um runner Node.js isolado fora do processo web, com limites explícitos de CPU e memória.

Uma aprovação registra localmente a tentativa e o domínio do módulo: M07 em 4/4 libera Arrays; M08 em 6/6 libera Objetos; M09 em 6/6 libera Strings, Math e Date; M10 em 6/6 libera Arrays modernos; M11 em 8/8 libera JavaScript moderno; M12 em 8/8 registra a conclusão desta fase e aponta o M13 como próxima retomada. Reprovações ficam no histórico, mas não avançam o módulo.

O acervo físico possui 69 arquivos JavaScript organizados por módulo em `exercicios-migrados`.

## Progresso e revisão

O navegador mantém separadamente os itens revisados, exemplos guiados, desafios da Arena, tentativas no Laboratório, módulos dominados e a última aula aberta. Ao recarregar, a Sala retoma o último conteúdo válido e desbloqueado.

Os dados locais são saneados antes do uso: duplicatas e identificadores inválidos não aumentam contadores, desafios precisam formar uma sequência desde o primeiro e um módulo fora de ordem não pode pular pré-requisitos. O percentual geral considera também módulos parcialmente estudados; o contador de módulos concluídos considera somente domínios fechados.

## Stack do Campus

- Next.js 15
- React 19
- TypeScript
- Monaco Editor
- Framer Motion
- Lucide Icons

A stack do site é independente da linguagem estudada. O Campus usa React/Next/TypeScript para a interface; o conteúdo pedagógico principal é JavaScript para Backend.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Validação atual

O projeto possui dependências instaladas e o build de produção foi validado com `npm run build`. Os exercícios separados também são executados com Node.js durante as revisões da trilha.

## Pasta de exercícios migrados

Além da biblioteca interna do Campus, a pasta `exercicios-migrados/` contém 63 arquivos `.js` separados por módulo para abrir diretamente no VS Code/Node.js. Os arquivos usam a mesma numeração exibida no Campus e preservam os comentários didáticos.
