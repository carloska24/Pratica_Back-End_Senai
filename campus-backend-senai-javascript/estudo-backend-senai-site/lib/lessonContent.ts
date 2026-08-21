import type { CourseItem, CourseLibraryModule } from "./courseLibrary";

export type LessonStep = { title: string; body: string };
export type ConceptCard = { title: string; body: string };
export type LessonContent = {
  objective: string;
  prereq: string;
  story: string[];
  steps: LessonStep[];
  cards: ConceptCard[];
  mental: string;
  warning: string;
  codeLabel: string;
  code: string;
};

const conceptHelp: Record<string, string> = {
  let: "let cria uma variável cujo valor pode ser reatribuído depois. Pense em uma caixinha cujo conteúdo pode mudar durante a execução.",
  const: "const cria uma referência que não pode ser reatribuída. Para valores que não precisam receber outro conteúdo, ela deixa a intenção do código mais clara.",
  string: "string representa texto. Em JavaScript usamos aspas simples, duplas ou crases para criar textos.",
  number: "JavaScript usa o tipo number tanto para números inteiros quanto para números com casas decimais.",
  boolean: "boolean guarda apenas true ou false e aparece naturalmente como resultado de comparações e regras de validação.",
  typeof: "typeof permite perguntar ao JavaScript qual é o tipo de um valor em tempo de execução.",
  "console.log": "console.log() envia uma informação para o console. Ele mostra algo para você; não é a mesma coisa que return.",
  if: "if faz uma pergunta lógica. Se a condição resultar em true, o bloco entre chaves é executado.",
  else: "else representa o caminho alternativo quando a condição do if foi false.",
  "else if": "else if permite testar uma nova condição quando as anteriores não foram atendidas.",
  "===": "=== compara valor e tipo sem conversão automática. É a comparação de igualdade que vamos preferir durante o curso.",
  "!==": "!== significa estritamente diferente e evita depender de conversões automáticas do JavaScript.",
  ">=": ">= pergunta se o valor da esquerda é maior ou igual ao valor da direita e produz true ou false.",
  "&&": "&& significa E lógico: as condições ligadas por ele precisam ser verdadeiras para o resultado final ser true.",
  "||": "|| significa OU lógico: basta uma das condições ser verdadeira para o resultado da expressão ser true.",
  switch: "switch escolhe um caminho a partir de um valor e compara esse valor com cada case.",
  case: "case representa uma possibilidade conhecida dentro de um switch.",
  break: "break encerra o case atual para que a execução não continue automaticamente no case seguinte.",
  default: "default é o caminho utilizado quando nenhum case corresponde ao valor analisado.",
  while: "while repete um bloco enquanto sua condição continuar verdadeira. A condição é verificada antes de cada nova volta.",
  contador: "contador normalmente representa em qual ponto da repetição estamos. Ele percorre os valores e precisa avançar para a repetição chegar ao fim.",
  "contador++": "contador++ aumenta exatamente uma unidade. Em laços ele costuma aproximar o contador da condição de parada.",
  "quantidade++": "quantidade++ registra mais UMA ocorrência. Ele conta quantas vezes algo foi encontrado, não soma o valor encontrado.",
  "soma acumulada": "um acumulador guarda o total anterior e adiciona o novo valor, por exemplo soma += contador.",
  "%": "% devolve o resto da divisão e é muito útil para reconhecer pares, ímpares e múltiplos.",
  for: "for reúne inicialização, condição e atualização em uma única estrutura. O bloco entre chaves continua sendo a ação executada a cada volta.",
  incremento: "incrementar significa aumentar o valor de controle; ++ é a forma curta para aumentar uma unidade.",
  decremento: "decrementar significa diminuir o valor; -- é usado em contagens regressivas.",
  "for aninhado": "em um for aninhado, o laço de dentro termina todas as próprias repetições antes de o laço de fora continuar para a próxima volta.",
  linha: "linha normalmente representa o contador do laço externo em exemplos visuais de repetição aninhada.",
  coluna: "coluna normalmente representa o contador do laço interno e volta ao valor inicial a cada nova execução do laço interno.",
  function: "function declara uma função. Ela cria uma unidade de comportamento que pode ser chamada novamente sem copiar todo o código.",
  chamada: "chamar uma função significa pedir que ela execute naquele momento. Quando termina, o fluxo continua de onde a chamada foi feita.",
  parâmetro: "parâmetro é uma variável de entrada declarada na função. Ela recebe um valor quando a função é chamada.",
  argumento: "argumento é o valor real enviado na chamada da função para ocupar a posição de um parâmetro.",
  return: "return devolve um valor para quem chamou a função e encerra aquela execução da função naquele ponto.",
  escopo: "escopo determina onde uma variável existe e pode ser acessada. let e const têm escopo de bloco no JavaScript.",
  "pilha de chamadas": "a pilha de chamadas ajuda a visualizar quem chamou quem. A função mais recente termina e devolve o controle para seu chamador imediato.",
  delegação: "delegação é quando uma função chama outra para resolver uma parte específica do trabalho.",
  array: "array é uma estrutura ordenada que guarda vários valores. Em vez de criar uma variável para cada item, usamos uma lista com posições numeradas.",
  índice: "índice é o endereço de um elemento no array. O primeiro índice é 0; por isso, o segundo elemento fica no índice 1.",
  length: "length informa quantos elementos existem no array. O último índice válido é length - 1.",
  acesso: "acessamos um elemento colocando o índice entre colchetes, como etapas[0]. Um índice inexistente devolve undefined.",
  push: "push adiciona um ou mais elementos no final do array e devolve o novo tamanho da lista.",
  pop: "pop remove o último elemento do array e devolve o valor removido.",
  mutação: "mutação significa alterar o conteúdo do próprio array. const impede reatribuir a variável, mas push e pop ainda podem mudar a lista.",
  "percurso de array": "percorrer um array é visitar seus elementos em ordem. No for clássico, o índice começa em 0 e continua enquanto for menor que length.",
  busca: "uma busca compara cada elemento com um valor procurado. Quando encontra, a função pode usar return para encerrar imediatamente.",
  objeto: "objeto reúne informações relacionadas em pares chave e valor. Ele representa uma entidade com características nomeadas, como um produto ou cliente.",
  chave: "chave é o nome que identifica uma informação dentro do objeto. Em produto.nome, nome é a chave usada para localizar o valor.",
  valor: "valor é a informação guardada por uma chave. Pode ser string, number, boolean, array, outro objeto ou até uma função.",
  propriedade: "propriedade é o par completo chave: valor que pertence a um objeto.",
  "acesso por ponto": "a notação de ponto lê uma propriedade conhecida diretamente, como produto.preco. É a forma mais simples quando o nome da chave está escrito no código.",
  "acesso por colchetes": "colchetes acessam uma propriedade por texto, como produto[\"preco\"], e permitem usar uma variável que contém o nome da chave.",
  atualização: "atribuir um novo valor a uma propriedade existente atualiza apenas aquela informação do objeto.",
  "chave dinâmica": "uma chave dinâmica está guardada em uma variável. Nesse caso usamos colchetes: objeto[nomeDaChave].",
  método: "método é uma função guardada como propriedade de um objeto. A chamada começa pelo objeto, como item.calcularSubtotal().",
  this: "dentro de um método tradicional, this representa o objeto que recebeu a chamada e permite acessar suas outras propriedades.",
  responsabilidade: "responsabilidade descreve o trabalho específico de uma função ou método. Um nome claro deve indicar o resultado que esse comportamento entrega.",
  cálculo: "um cálculo combina valores para produzir outro valor; dentro de um método, esses valores podem vir das propriedades do próprio objeto.",
  "objeto aninhado": "um objeto aninhado é um objeto guardado dentro de outro. Cada ponto do acesso avança um nível, como pedido.cliente.nome.",
  "array de objetos": "um array de objetos reúne várias entidades com a mesma estrutura, como os itens de um pedido.",
  JSON: "JSON é um formato textual de troca de dados inspirado na estrutura dos objetos JavaScript. APIs usam JSON para transportar informações, sem métodos ou funções.",
  trim: "trim() devolve uma nova string sem os espaços do começo e do fim. Ele não altera o texto original.",
  toLowerCase: "toLowerCase() devolve o texto em letras minúsculas e ajuda a normalizar valores como e-mails antes de comparar.",
  toUpperCase: "toUpperCase() devolve o texto em letras maiúsculas. É útil quando uma regra exige um padrão visual ou um identificador uniforme.",
  imutabilidade: "strings são imutáveis: seus métodos produzem outro valor. Para guardar a versão tratada, atribuímos o resultado a uma variável.",
  "template literal": "template literal usa crases e permite inserir expressões com ${...}, mantendo texto e valores legíveis na mesma estrutura.",
  interpolação: "interpolação é a substituição de ${expressão} pelo resultado real dessa expressão dentro de uma template literal.",
  toFixed: "toFixed(n) formata um número com n casas decimais e devolve uma string. Ele serve para exibição, não para continuar cálculos.",
  formatação: "formatação prepara um valor para leitura ou transporte sem mudar necessariamente seu significado de negócio.",
  "Math.round": "Math.round() arredonda para o inteiro mais próximo. Para centavos, deslocamos duas casas, arredondamos e voltamos.",
  "Math.floor": "Math.floor() sempre desce para o inteiro anterior ou igual. Pode representar grupos completos que cabem em uma capacidade.",
  "Math.ceil": "Math.ceil() sempre sobe para o próximo inteiro quando há parte decimal. É a regra certa quando qualquer sobra exige mais uma unidade.",
  precisão: "números decimais binários podem produzir pequenas sobras internas. Regras monetárias precisam explicitar quando e como arredondar.",
  divisão: "divisão pode produzir parte decimal. A regra do problema decide se essa parte será mantida, descartada ou arredondada para cima.",
  "regra de negócio": "regra de negócio transforma uma necessidade real em comportamento verificável do programa.",
  Date: "Date representa um instante no tempo. Criá-lo a partir de uma string ISO explícita reduz ambiguidades de interpretação.",
  "ISO 8601": "ISO 8601 organiza data e hora em uma string previsível, como 2026-08-20T15:30:00.000Z. O Z indica UTC.",
  UTC: "UTC é uma referência de tempo comum. Métodos como getUTCFullYear evitam que o fuso do computador altere o resultado esperado.",
  timestamp: "timestamp registra quando um evento aconteceu. Em Backend ele aparece em criação, atualização, logs e auditoria.",
  callback: "callback é uma função entregue como argumento para outra função. O método do array decide quando chamá-la e quais valores enviar.",
  forEach: "forEach visita cada elemento para executar uma ação. Ele não monta um novo array e seu resultado final é undefined.",
  elemento: "elemento é o valor atual que o método entregou ao callback naquela volta do percurso.",
  map: "map transforma cada elemento e guarda o return de cada callback em um novo array com o mesmo tamanho do original.",
  transformação: "transformação recebe um valor e produz outra representação, como converter um produto em uma etiqueta de texto.",
  "novo array": "map e filter devolvem outro array. A variável de origem continua apontando para a coleção original.",
  filter: "filter mantém apenas os elementos cujo callback devolve true. O resultado pode ter de zero até todos os elementos.",
  predicado: "predicado é uma função que responde true ou false para uma pergunta sobre um elemento.",
  seleção: "seleção escolhe um subconjunto sem transformar os elementos escolhidos.",
  find: "find devolve o primeiro elemento que atende ao predicado e encerra a busca. Se não encontrar, devolve undefined.",
  some: "some pergunta se pelo menos um elemento atende ao predicado e devolve boolean.",
  every: "every pergunta se todos os elementos atendem ao predicado e devolve boolean.",
  "curto-circuito": "find, some e every podem parar antes do fim quando a resposta já está determinada.",
  reduce: "reduce combina todos os elementos em um único resultado, carregando um acumulador entre as chamadas do callback.",
  acumulador: "acumulador é o resultado parcial recebido pelo callback do reduce e devolvido para a próxima volta.",
  "valor inicial": "o segundo argumento do reduce define como o acumulador começa e torna o comportamento com array vazio previsível.",
  pipeline: "pipeline encadeia etapas com responsabilidades claras: selecionar, transformar e resumir dados.",
  "arrow function": "arrow function é uma forma moderna de escrever função com =>. Ela é muito usada em callbacks, mas não cria o próprio this.",
  "retorno implícito": "uma arrow sem chaves devolve automaticamente sua única expressão. Quando usamos chaves, return volta a ser obrigatório.",
  destructuring: "destructuring extrai propriedades de objeto ou posições de array e cria variáveis locais com esses valores.",
  renomeação: "na desestruturação de objeto, dois-pontos permitem criar uma variável com outro nome: const { nome: nomeCliente } = cliente.",
  spread: "spread usa ... para espalhar propriedades ou elementos dentro de uma nova estrutura.",
  "cópia rasa": "spread copia somente o primeiro nível. Objetos e arrays aninhados ainda podem compartilhar a mesma referência.",
  sobrescrita: "quando duas propriedades têm a mesma chave, o valor escrito por último prevalece. Em { ...original, ...alteracoes }, as alterações vencem.",
  "parâmetro padrão": "um parâmetro padrão recebe seu valor quando o argumento é undefined ou não foi enviado.",
  rest: "rest usa ... no parâmetro para reunir os argumentos restantes em um array.",
  join: "join une os elementos de um array em uma string usando o separador informado.",
  "optional chaining": "optional chaining usa ?. para interromper um caminho se o valor anterior for null ou undefined, devolvendo undefined em vez de lançar erro.",
  "nullish coalescing": "?? fornece uma alternativa somente quando o valor da esquerda é null ou undefined. Diferente de ||, preserva 0, false e string vazia.",
  undefined: "undefined representa ausência de valor atribuído ou resultado inexistente em várias operações JavaScript.",
  "acesso seguro": "acesso seguro reconhece que partes de um payload podem faltar e define como o programa continuará sem esconder outras falhas.",
};

const modulePrereq: Record<string, string> = {
  M01: "Nenhum. Este é o ponto de entrada da trilha JavaScript.",
  M02: "Variáveis, valores, operadores e console.log do módulo de Fundamentos JavaScript.",
  M03: "Condições com if e entendimento das chaves como bloco de ações.",
  M04: "A lógica do while e a função de uma variável de controle durante uma repetição.",
  M05: "for + if. Agora o foco é separar variável de controle, contador de ocorrências e acumulador.",
  M06: "for simples. O passo novo é enxergar uma repetição completa acontecendo dentro de outra.",
  M07: "Variáveis, condições e repetição. Funções organizam essas ações em responsabilidades reutilizáveis.",
  M08: "Funções, for, contador e acumulador. Arrays reúnem vários valores para que esses conhecimentos trabalhem sobre uma coleção.",
  M09: "Arrays e funções. Objetos dão nomes às características de uma entidade e podem reunir listas e outros objetos em uma estrutura maior.",
  M10: "Objetos, funções e tipos primitivos. Agora vamos preparar texto, número e data para regras reais de Backend.",
  M11: "Arrays, objetos, funções e return. Os métodos modernos organizam padrões de percurso que você já sabe construir com for.",
  M12: "Funções, callbacks, objetos e arrays modernos. Agora vamos reduzir repetição sintática preservando o mesmo raciocínio.",
};

function objectiveFor(item: CourseItem) {
  if (item.kind === "aula") return `Compreender ${item.title.replace(/^Aula\d+ · /, "").toLowerCase()} através do fluxo do programa, das caixinhas envolvidas e da sintaxe real de JavaScript.`;
  if (item.kind === "exercicio") return `Reestudar ${item.title.replace(/^Exercicio\d+ · /, "")} entendendo primeiro a lógica e só depois comparando com o arquivo JavaScript resolvido.`;
  if (item.kind === "desafio") return `Reconstruir o raciocínio do ${item.title.toLowerCase()}, reconhecendo quais dados entram, quais decisões ou repetições acontecem e qual resultado é produzido.`;
  return `Usar ${item.title.toLowerCase()} como revisão de fixação, identificando o padrão que pode ser reaproveitado em outros problemas JavaScript.`;
}

function storyFor(module: CourseLibraryModule, item: CourseItem): string[] {
  if (module.id === "M01") return [
    "O arquivo .js começa a ser executado de cima para baixo.",
    "let ou const cria uma caixinha com um nome e recebe um valor.",
    "Uma expressão pode ler essas caixinhas e produzir um novo valor.",
    "console.log() mostra no console aquilo que queremos observar durante a execução."
  ];
  if (module.id === "M02") {
    if (item.concepts.includes("switch")) return [
      "O programa já possui um valor de escolha.",
      "switch compara essa escolha com os cases disponíveis.",
      "O case correspondente executa seu bloco; break encerra aquele caminho.",
      "Se nenhum case combinar, default representa o caminho de segurança."
    ];
    return [
      "O programa chega a uma expressão lógica.",
      "A expressão é avaliada e produz true ou false.",
      "if executa somente o bloco do caminho escolhido; else representa a alternativa.",
      "Depois da decisão, a execução continua normalmente abaixo da estrutura."
    ];
  }
  if (module.id === "M03") return [
    "Uma variável de controle nasce antes do while.",
    "while pergunta se a condição ainda é true antes de cada repetição.",
    "Dentro das chaves acontecem as ações daquela volta e, quando necessário, um if filtra quais valores interessam.",
    "A variável de controle é atualizada; quando a condição fica false, o laço termina."
  ];
  if (module.id === "M04") return [
    "for cria a variável de controle e verifica a condição.",
    "Se a condição for true, o bloco entre chaves executa usando o valor atual.",
    "Ao terminar o bloco, o incremento ou decremento é aplicado.",
    "A condição é testada novamente até o for não ter mais voltas para executar."
  ];
  if (module.id === "M05") return [
    "O for percorre o intervalo usando uma variável de controle.",
    "O if decide quais valores realmente interessam para o problema.",
    "Uma caixinha pode contar ocorrências com ++ enquanto outra pode acumular os próprios valores com +=.",
    "Quando o laço termina, as caixinhas criadas fora dele ainda guardam os resultados finais."
  ];
  if (module.id === "M06") return [
    "O for externo escolhe o valor atual da linha.",
    "Dentro dele nasce o for interno e todas as colunas são percorridas.",
    "Somente quando o for interno termina o programa volta ao for externo.",
    "A próxima linha começa e um novo percurso das colunas acontece."
  ];
  if (module.id === "M08") return [
    "O programa cria um array: uma lista ordenada guardada em uma variável.",
    "Cada elemento recebe um índice; o primeiro mora na posição 0.",
    "length informa a quantidade de elementos e ajuda a definir o limite do percurso.",
    "Um for visita cada índice, lê o elemento atual e aplica a ação necessária."
  ];
  if (module.id === "M09") return [
    "O programa cria um objeto entre chaves para representar uma entidade.",
    "Cada propriedade associa uma chave conhecida a um valor relacionado.",
    "A notação de ponto ou os colchetes localizam a propriedade desejada.",
    "O valor lido pode ser usado, atualizado, enviado para uma função ou exibido no console."
  ];
  if (module.id === "M10") return [
    "O programa recebe um valor bruto vindo de uma pessoa, arquivo ou API.",
    "Um método de String, Math ou Date aplica uma transformação com uma regra explícita.",
    "A operação devolve um novo valor; o dado original continua disponível quando a estrutura é imutável.",
    "O resultado tratado pode ser comparado, exibido, enviado em JSON ou persistido no banco de dados."
  ];
  if (module.id === "M11") return [
    "O método recebe um array e uma função callback como argumento.",
    "A cada volta, o método chama o callback e entrega o elemento atual, além do índice quando necessário.",
    "O return do callback tem um papel definido pelo método: transformar, selecionar, responder ou acumular.",
    "O método devolve seu resultado final sem exigir que você controle manualmente início, limite e incremento."
  ];
  if (module.id === "M12") return [
    "O programa recebe dados ou uma função escrita na forma que você já conhece.",
    "A sintaxe moderna seleciona somente as partes necessárias ou cria uma nova estrutura de maneira explícita.",
    "Defaults e acessos seguros tratam ausências conhecidas sem transformar todos os valores falsos em erro.",
    "O resultado mantém o mesmo contrato lógico, mas reduz repetição e deixa a intenção mais visível."
  ];
  return [
    "A execução encontra uma chamada de função.",
    "Os argumentos entram nos parâmetros na ordem em que foram enviados.",
    "A função executa sua responsabilidade: pode calcular, decidir, repetir ou chamar outra função.",
    "Se houver return, o valor volta para quem chamou; depois o fluxo continua exatamente da linha seguinte à chamada."
  ];
}

function stepsFor(module: CourseLibraryModule, item: CourseItem): LessonStep[] {
  const story = storyFor(module, item);
  const titles = ["O ponto de partida", "As caixinhas entram em cena", "A estrutura faz o trabalho", "O fluxo continua"];
  const steps = story.map((body, index) => ({ title: titles[index], body }));
  steps.push({
    title: "Tradução para português",
    body: `Antes de decorar a sintaxe, tente dizer em voz alta o que “${item.title}” faz. Você deve conseguir citar a entrada, a ação principal e o resultado usando os conceitos: ${item.concepts.join(", ")}.`
  });
  steps.push({
    title: "Conferência no JavaScript",
    body: "Só depois compare sua explicação mental com o código. Os comentários // foram colocados para mostrar por que cada linha existe e qual responsabilidade ela possui."
  });
  return steps;
}

function mentalFor(module: CourseLibraryModule) {
  if (module.id === "M01") return "“Crio a caixinha → coloco um valor → uso esse valor → observo o resultado no console.”";
  if (module.id === "M02") return "“A condição pergunta → JavaScript produz true/false → um caminho executa → o fluxo continua.”";
  if (module.id === "M03") return "“Enquanto for true eu repito → faço o trabalho → atualizo o controle → volto a perguntar.”";
  if (module.id === "M04") return "“Crio o contador → verifico → executo as chaves → atualizo → verifico novamente.”";
  if (module.id === "M05") return "“O contador percorre → o if filtra → quantidade conta → soma acumula → depois uso os totais.”";
  if (module.id === "M06") return "“Estou numa linha → termino todas as colunas → só então avanço para a próxima linha.”";
  if (module.id === "M08") return "“Tenho uma lista → começo no índice 0 → leio um item por vez → paro antes de chegar em length.”";
  if (module.id === "M09") return "“Tenho uma entidade → procuro a chave → leio ou altero o valor → continuo trabalhando com o mesmo objeto.”";
  if (module.id === "M10") return "“Recebo um valor bruto → escolho a regra de transformação → guardo o resultado → entrego um valor previsível.”";
  if (module.id === "M11") return "“Escolho a intenção → entrego um callback → o método percorre → cada return ajuda a construir a resposta certa.”";
  if (module.id === "M12") return "“Reconheço a forma longa → identifico o que pode ser extraído ou copiado → aplico a sintaxe curta → confiro se o contrato permaneceu.”";
  return "“A chamada envia valores → parâmetros recebem → a função trabalha → return devolve → quem chamou continua.”";
}

function warningFor(module: CourseLibraryModule) {
  if (module.id === "M01") return "JavaScript não usa int, double, char ou String como declaração de variável. number representa inteiros e decimais; let e const controlam a variável, não o tipo do valor.";
  if (module.id === "M02") return "Prefira === e !== durante o curso. == e != podem fazer conversões automáticas de tipo e esconder comportamentos importantes do JavaScript.";
  if (module.id === "M03") return "Se a variável usada na condição nunca mudar, o while pode virar um loop infinito. A atualização precisa acontecer em um caminho que realmente será executado.";
  if (module.id === "M04") return "O terceiro trecho do for atualiza a variável de controle. Contar ocorrências, acumular valores ou imprimir continuam sendo ações do bloco entre chaves.";
  if (module.id === "M05") return "quantidade++ registra quantas ocorrências foram encontradas; soma += contador guarda o total dos valores encontrados. Não troque uma responsabilidade pela outra.";
  if (module.id === "M06") return "Código dentro do for interno repete muito mais vezes que código apenas dentro do externo. Pergunte sempre: em qual bloco esta linha está?";
  if (module.id === "M08") return "length é a quantidade de elementos, não o último índice. Em um array com 4 itens, length vale 4 e o último índice válido é 3. Acessar o índice 4 devolve undefined.";
  if (module.id === "M09") return "Objeto usa chaves nomeadas; array usa índices numéricos. JSON transporta dados parecidos com objetos, mas não carrega métodos nem funções.";
  if (module.id === "M10") return "Formatar não é o mesmo que calcular: toFixed devolve string. Datas sem fuso explícito podem mudar de dia conforme o computador; nos exemplos de integração, prefira ISO com Z e métodos UTC.";
  if (module.id === "M11") return "O return do callback muda de significado conforme o método. Em map ele vira elemento novo; em filter vira decisão; em reduce vira o próximo acumulador. forEach ignora esse return e devolve undefined.";
  if (module.id === "M12") return "Spread faz cópia rasa, não clonagem profunda. Arrow function não possui this próprio. ?? trata somente null/undefined, enquanto || também troca 0, false e string vazia.";
  return "JavaScript não exige tipos nos parâmetros e não usa void para funções comuns. Uma função sem return explícito devolve undefined; quando precisamos de um resultado útil, usamos return conscientemente.";
}

function exampleCode(module: CourseLibraryModule, item: CourseItem) {
  if (item.code) return item.code;
  if (item.id === "M01-A01") return `// Aula01.js
// JavaScript possui tipagem dinâmica: a variável não declara int/String/etc.

const nome = "Carlos";   // string
let idade = 41;          // number
const ativo = true;      // boolean

idade = 42;              // permitido porque idade foi criada com let

console.log(nome);
console.log(idade);
console.log(typeof ativo); // "boolean"`;
  if (item.id === "M02-A01") return `// Aula01.js
// A condição produz true ou false.

const idade = 20;

if (idade >= 18) {
    console.log("Maior de idade");
} else {
    console.log("Menor de idade");
}`;
  if (item.id === "M02-A02") return `// Aula02.js
// switch é útil quando comparamos uma escolha com casos conhecidos.

const opcao = 2;

switch (opcao) {
    case 1:
        console.log("Consulta");
        break;
    case 2:
        console.log("Saque");
        break;
    default:
        console.log("Opção inválida");
}`;
  if (item.id === "M03-A01") return `// Aula01.js
// O contador precisa mudar para o while chegar ao fim.

let contador = 1;

while (contador <= 5) {
    console.log(contador);
    contador++;
}`;
  if (item.id === "M04-A01") return `// Aula01.js
// inicialização ; condição ; atualização

for (let contador = 1; contador <= 5; contador++) {
    console.log(contador);
}`;
  if (item.id === "M05-A01") return `// Aula01.js
// Duas caixinhas, duas responsabilidades.

let quantidade = 0;
let soma = 0;

for (let contador = 1; contador <= 10; contador++) {
    if (contador % 2 === 0) {
        quantidade++;      // conta ocorrências
        soma += contador;  // acumula valores
    }
}

console.log("Quantidade:", quantidade);
console.log("Soma:", soma);`;
  if (item.id === "M06-A01") return `// Aula01.js
// O for interno termina antes de linha avançar.

for (let linha = 1; linha <= 3; linha++) {
    console.log("Linha", linha);

    for (let coluna = 1; coluna <= 3; coluna++) {
        console.log("Coluna", coluna);
    }
}`;
  if (item.id === "M06-A02") return `// Aula02.js
// O limite do laço interno pode depender do externo.

for (let linha = 1; linha <= 3; linha++) {
    let estrelas = "";

    for (let coluna = 1; coluna <= linha; coluna++) {
        estrelas += "*";
    }

    console.log(estrelas);
}`;
  if (item.id === "M07-A01") return `// Aula01.js
// Definição: aqui explicamos qual ação a função sabe executar.
function mostrarMensagem() {
    console.log("Sistema iniciado!");
}

// Chamada: aqui pedimos que a função execute.
mostrarMensagem();`;
  if (item.id === "M07-A02") return `// Aula02.js
function cumprimentar() {
    console.log("Olá!");
}

cumprimentar(); // entra na função, executa e volta
console.log("Fim"); // continua daqui depois que a função termina`;
  if (item.id === "M07-A03") return `// Aula03.js
function mostrarPessoa(nome, idade) {
    // nome e idade são PARÂMETROS.
    console.log(nome);
    console.log(idade);
}

// "Carlos" e 41 são ARGUMENTOS.
mostrarPessoa("Carlos", 41);`;
  if (item.id === "M07-A04") return `// Aula04.js
function somar(numero1, numero2) {
    // return devolve o resultado para quem chamou.
    return numero1 + numero2;
}

const resultado = somar(10, 20);
console.log(resultado);`;
  if (item.id === "M07-A05") return `// Aula05.js
function calcularDesconto(preco) {
    return preco * 0.10;
}

function calcularPrecoFinal(preco) {
    // Esta função pausa aqui enquanto calcularDesconto trabalha.
    const desconto = calcularDesconto(preco);
    return preco - desconto;
}

console.log(calcularPrecoFinal(100));`;
  if (item.id === "M07-A06") return `// Aula06.js
function mostrarNumero(valor) {
    // valor existe apenas dentro desta função.
    console.log(valor);
}

const numero = 10;
mostrarNumero(numero);

if (numero > 5) {
    const mensagem = "Maior que 5";
    console.log(mensagem);
}

// console.log(mensagem); // erro: mensagem não existe fora do bloco if`;
  if (item.id === "M07-A07") return `// Aula07.js
function verificarMaioridade(idade) {
    // A comparação usa o valor recebido no parâmetro idade.
    if (idade >= 18) {
        return true;
    }

    return false;
}

const resultado = verificarMaioridade(20);
console.log(resultado); // true`;
  if (item.id === "M08-A01") return `// Aula01.js
// Uma lista, quatro posições: 0, 1, 2 e 3.

const etapas = ["Cortar", "Montar", "Testar", "Embalar"];

console.log(etapas[0]);       // "Cortar"
console.log(etapas[3]);       // "Embalar"
console.log(etapas.length);   // 4`;
  if (item.id === "M08-A02") return `// Aula02.js
// const protege a referência; o conteúdo do array ainda pode mudar.

const fila = ["P001", "P002"];

fila.push("P003");           // adiciona no final
const removido = fila.pop(); // remove e devolve "P003"

console.log(fila);
console.log(removido);`;
  if (item.id === "M08-A03") return `// Aula03.js
// O índice percorre de 0 até length - 1.

const notas = [8, 7.5, 9, 6.5];

for (let indice = 0; indice < notas.length; indice++) {
    const notaAtual = notas[indice];
    console.log(\`Índice \${indice}: \${notaAtual}\`);
}`;
  if (item.id === "M08-A04") return `// Aula04.js
// return true encerra a busca assim que o código é encontrado.

function possuiCodigo(codigos, procurado) {
    for (let indice = 0; indice < codigos.length; indice++) {
        if (codigos[indice] === procurado) {
            return true;
        }
    }

    return false;
}`;
  if (item.id === "M09-A01") return `// Aula01.js
// Um objeto representa uma entidade por meio de propriedades.

const produto = {
    codigo: "P001",
    nome: "Teclado mecânico",
    preco: 249.90,
    ativo: true
};

console.log(produto.nome);  // "Teclado mecânico"
console.log(produto.preco); // 249.90`;
  if (item.id === "M09-A02") return `// Aula02.js
const produto = { nome: "Mouse", estoque: 12 };

produto.estoque = 9;          // ponto: chave conhecida
const campo = "estoque";
console.log(produto[campo]);  // colchetes: chave dinâmica

produto.ativo = true;         // cria uma nova propriedade`;
  if (item.id === "M09-A03") return `// Aula03.js
const item = {
    preco: 18.50,
    quantidade: 4,
    calcularSubtotal: function () {
        return this.preco * this.quantidade;
    }
};

console.log(item.calcularSubtotal()); // 74`;
  if (item.id === "M09-A04") return `// Aula04.js
const pedido = {
    cliente: { nome: "Carlos", cidade: "São Paulo" },
    itens: [
        { descricao: "Teclado", quantidade: 1 },
        { descricao: "Mouse", quantidade: 2 }
    ]
};

console.log(pedido.cliente.nome);        // "Carlos"
console.log(pedido.itens[1].descricao);  // "Mouse"`;
  if (item.id === "M10-A01") return `// Aula01.js
const emailRecebido = "  CARLOS@EMAIL.COM  ";

const semEspacosExternos = emailRecebido.trim();
const emailNormalizado = semEspacosExternos.toLowerCase();

console.log(emailNormalizado); // "carlos@email.com"
console.log(emailRecebido);    // original preservado`;
  if (item.id === "M10-A02") return `// Aula02.js
const produto = "Cabo de rede";
const quantidade = 4;
const subtotal = 74;

const linha = \`\${quantidade}x \${produto} | R$ \${subtotal.toFixed(2)}\`;

console.log(linha);           // "4x Cabo de rede | R$ 74.00"
console.log(typeof subtotal); // "number"
console.log(typeof subtotal.toFixed(2)); // "string"`;
  if (item.id === "M10-A03") return `// Aula03.js
const valor = 12.67;

console.log(Math.round(valor)); // 13: inteiro mais próximo
console.log(Math.floor(valor)); // 12: sempre desce
console.log(Math.ceil(valor));  // 13: sempre sobe

const preco = 19.995;
const centavos = Math.round(preco * 100) / 100;
console.log(centavos);`;
  if (item.id === "M10-A04") return `// Aula04.js
const instante = new Date("2026-08-20T15:30:00.000Z");

console.log(instante.toISOString()); // formato estável
console.log(instante.getUTCFullYear()); // 2026
console.log(instante.getUTCMonth() + 1); // 8: mês começa em 0
console.log(instante.getUTCDate());      // 20`;
  if (item.id === "M11-A01") return `// Aula01.js
const produtos = ["Teclado", "Mouse", "Monitor"];

produtos.forEach(function (produto, indice) {
    // forEach chama esta função uma vez para cada elemento.
    console.log(indice, produto);
});

// O percurso acontece, mas forEach devolve undefined.`;
  if (item.id === "M11-A02") return `// Aula02.js
const precos = [10, 20, 30];

const precosComTaxa = precos.map(function (preco) {
    return preco * 1.10;
});

console.log(precos);         // [10, 20, 30]
console.log(precosComTaxa);  // [11, 22, 33]`;
  if (item.id === "M11-A03") return `// Aula03.js
const produtos = [
    { codigo: "P01", ativo: true, estoque: 8 },
    { codigo: "P02", ativo: false, estoque: 4 },
    { codigo: "P03", ativo: true, estoque: 0 }
];

const disponiveis = produtos.filter(function (produto) {
    return produto.ativo === true && produto.estoque > 0;
});

console.log(disponiveis); // somente P01`;
  if (item.id === "M11-A04") return `// Aula04.js
const produtos = [
    { codigo: "P01", preco: 249.90, estoque: 8 },
    { codigo: "P02", preco: 89.50, estoque: 0 },
    { codigo: "P03", preco: 799.00, estoque: 3 }
];

const mouse = produtos.find(function (produto) {
    return produto.codigo === "P02";
});
const possuiEsgotado = produtos.some(function (produto) {
    return produto.estoque === 0;
});
const todosValidos = produtos.every(function (produto) {
    return produto.preco > 0;
});`;
  if (item.id === "M11-A05") return `// Aula05.js
const itens = [
    { preco: 10, quantidade: 2 },
    { preco: 25, quantidade: 3 }
];

const total = itens.reduce(function (acumulador, item) {
    const subtotal = item.preco * item.quantidade;
    return acumulador + subtotal;
}, 0); // acumulador começa em 0

console.log(total); // 95`;
  if (item.id === "M12-A01") return `// Aula01.js
// Forma tradicional:
const dobrarTradicional = function (numero) {
    return numero * 2;
};

// Arrow com retorno implícito:
const dobrar = numero => numero * 2;

const valores = [2, 4, 6];
console.log(valores.map(valor => valor * 2));`;
  if (item.id === "M12-A02") return `// Aula02.js
const pedido = {
    codigo: "PED-10",
    cliente: { nome: "Carlos" },
    itens: ["Teclado", "Mouse"]
};

const {
    codigo,
    cliente: { nome: nomeCliente },
    itens: [primeiroItem]
} = pedido;

console.log(codigo, nomeCliente, primeiroItem);`;
  if (item.id === "M12-A03") return `// Aula03.js
const produto = { codigo: "P01", estoque: 8, ativo: true };
const alteracoes = { estoque: 5 };

// A ordem importa: alteracoes vem por último e sobrescreve estoque.
const atualizado = { ...produto, ...alteracoes };

console.log(produto.estoque);   // 8
console.log(atualizado.estoque); // 5`;
  if (item.id === "M12-A04") return `// Aula04.js
function criarLog(nivel = "INFO", ...mensagens) {
    // mensagens é um array com todos os argumentos restantes.
    return \`[\${nivel}] \${mensagens.join(" | ")}\`;
}

console.log(criarLog(undefined, "API iniciada", "porta 3000"));`;
  if (item.id === "M12-A05") return `// Aula05.js
const cliente = { nome: "Carlos", endereco: null };

const cidade = cliente.endereco?.cidade ?? "Não informada";
const desconto = cliente.configuracao?.desconto ?? 0;

console.log(cidade);   // "Não informada"
console.log(desconto); // 0`;
  return `// Reconstrua este conteúdo em JavaScript.
// Conceitos centrais: ${item.concepts.join(" · ")}
// ${item.summary}`;
}

export function getLessonContent(module: CourseLibraryModule, item: CourseItem): LessonContent {
  const cards = item.concepts.slice(0, 4).map((concept) => ({
    title: concept,
    body: conceptHelp[concept] ?? `Este conceito participa diretamente de “${item.title}”. Procure identificar o que ele recebe, quando executa e qual informação deixa disponível depois.`,
  }));

  while (cards.length < 4) {
    const labels = ["Entrada", "Processamento", "Saída", "Fluxo"];
    const bodies = [
      "Identifique quais valores já existem antes de a estrutura começar.",
      "Observe qual condição, cálculo ou repetição transforma os dados.",
      "Descubra se o resultado é exibido, guardado em outra variável ou devolvido por return.",
      "Acompanhe para qual linha o programa segue quando o bloco atual termina.",
    ];
    cards.push({ title: labels[cards.length], body: bodies[cards.length] });
  }

  return {
    objective: objectiveFor(item),
    prereq: modulePrereq[module.id] ?? "Conteúdos anteriores da formação.",
    story: storyFor(module, item),
    steps: stepsFor(module, item),
    cards,
    mental: mentalFor(module),
    warning: warningFor(module),
    codeLabel: item.code ? `${item.fileName ?? "JavaScript"} · código comentado` : "JavaScript · exemplo conceitual comentado",
    code: exampleCode(module, item),
  };
}
