# Laboratório por módulo e Lousa Didática

> **Evolução aprovada:** a Lousa estrutural descrita neste documento foi validada como uma primeira exploração, mas não atende ao objetivo de ensinar a execução real. O desenho vigente está em [LAB_EXECUTION_TUTOR_DESIGN.md](./LAB_EXECUTION_TUTOR_DESIGN.md). O seletor de módulos, o isolamento do runner e o tutor opcional continuam válidos.

## Objetivo

Corrigir o acoplamento entre nome de arquivo e missão do Laboratório e transformar a área em um ambiente de estudo orientado por módulo. O aluno deve poder selecionar qualquer módulo já estudado, carregar um arquivo com qualquer nome e receber explicações coerentes com o contexto escolhido.

Toda a implementação será desenvolvida e validada na branch `codex/lab-module-ai-tutor`. A `main` não será alterada durante os testes.

## Decisões aprovadas

- Escopo do seletor: M01 a M12.
- M01 a M06 são contextos de revisão e não possuem missão certificadora.
- M07 a M12 mantêm missões finais e testes automatizados.
- O módulo selecionado é a fonte de verdade; o nome do arquivo é apenas identificação visual.
- A Lousa possui uma camada determinística local e uma camada opcional de IA.
- A aplicação continua funcional sem internet ou chave de API.
- A chave de IA existe somente no servidor e nunca é enviada ao navegador.

## Estado do Laboratório

O estado será separado em quatro conceitos:

1. `selectedModuleId`: contexto pedagógico escolhido pelo aluno.
2. `sourceFile`: nome e conteúdo atualmente carregados no editor.
3. `selectedMissionId`: missão carregada explicitamente, quando aplicável.
4. `analysis`: diagnóstico local e explicação estruturada do código atual.

Carregar um arquivo não muda automaticamente o módulo. Carregar uma missão atualiza explicitamente módulo, arquivo e missão. Editar o código após carregar uma missão preserva a associação com a missão até o aluno trocar o módulo ou carregar outro arquivo.

## Catálogo centralizado

Um catálogo único descreve M01 a M12:

- identificador, título, resumo e conceitos;
- tipo `review` ou `mission`;
- disponibilidade conforme progresso;
- código inicial e arquivo da missão, quando existirem;
- quantidade esperada de testes;
- mensagem de conclusão e próximo módulo.

O seletor e o runner consumirão esse catálogo, eliminando condicionais duplicadas no componente React.

## Análise local

O código será interpretado estruturalmente com `@babel/parser`. A AST produzirá um contrato serializável contendo:

- declarações de variáveis e tipo de declaração;
- funções, parâmetros, chamadas e retornos;
- decisões e repetições;
- operações relevantes ao módulo;
- mensagens de sintaxe com linha e coluna;
- etapas de execução inferidas sem executar código não confiável.

A análise estrutural não substituirá o runner. O runner continuará responsável por executar o código no Web Worker isolado e pelas suítes das missões M07 a M12.

## Lousa Didática

A lousa aparecerá abaixo da área atual do laboratório e será composta por blocos progressivos:

1. resumo em linguagem simples;
2. conceitos encontrados e conceitos esperados no módulo;
3. mapa do fluxo do programa;
4. funções, parâmetros, argumentos e retornos;
5. variáveis e responsabilidades;
6. decisões, repetições e possíveis caminhos;
7. erros ou pontos de atenção com linha relacionada;
8. pergunta de fixação.

O mapa visual usará React Flow carregado sob demanda. Em códigos pequenos ou quando o grafo não acrescentar valor, a lousa mostrará uma sequência linear mais leve.

## Tutor com IA

Uma Route Handler do Next.js receberá somente dados validados:

- módulo selecionado;
- código limitado em tamanho;
- resumo da AST;
- resultado de execução e testes, quando disponível;
- tipo de explicação solicitada.

A resposta será um objeto validado por Zod, sem HTML arbitrário. A interface renderizará componentes React próprios. O modelo inicial será configurado por `OPENAI_TUTOR_MODEL`, com `gpt-5.6-luna` como opção econômica e possibilidade de usar `gpt-5.6-terra` para maior profundidade.

Ausência de `OPENAI_API_KEY`, limite excedido, timeout ou falha do provedor retornam um estado controlado; a lousa local permanece disponível.

## Segurança e limites

- chave somente em variável de ambiente do servidor;
- nenhuma resposta de modelo renderizada com `dangerouslySetInnerHTML`;
- schema estrito para entrada e saída;
- limite de caracteres do código e de itens da AST;
- limite de saída e timeout da chamada;
- código do aluno tratado como dado, nunca como instrução do sistema;
- mensagens do modelo deixam claro que a execução e os testes locais são a fonte objetiva;
- runner continua sem rede e com interrupção automática de loops infinitos.

## Estratégia de testes

1. catálogo e regras de disponibilidade;
2. seleção explícita de módulo independente do nome do arquivo;
3. carregamento de missão e troca de módulo;
4. análise AST de variáveis, funções, decisões, loops e erros de sintaxe;
5. geração determinística dos blocos da lousa;
6. validação dos contratos da API e fallback sem chave;
7. regressão das missões M07 a M12;
8. build de produção;
9. fluxo real no navegador em desktop, tablet e celular;
10. verificação de overflow horizontal em 390 px e 1024 px.

## Fora do escopo inicial

- autenticação ou progresso sincronizado em servidor;
- execução de Node.js no backend;
- modelo WebLLM baixado no navegador;
- missões certificadoras para M01 a M06;
- liberação do M13.
