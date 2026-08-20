export type FunctionExample = {
  id: number;
  title: string;
  concept: string;
  difficulty: "Base" | "Intermediário" | "Integração";
  xp: number;
  input: string;
  process: string;
  output: string;
  objective: string;
  whyItMatters: string;
  analogy: string;
  story: string[];
  trace: { label: string; value: string; note: string }[];
  focus: string[];
  pitfalls: string[];
  checkpoint: string;
  code: string;
};

export const functionExamples: FunctionExample[] = [
  {
    id: 1,
    title: "Função simples",
    concept: "Criar uma caixa de ações e chamar quando necessário",
    difficulty: "Base",
    xp: 40,
    input: "Nenhuma",
    process: "Exibir uma mensagem",
    output: "Nenhum valor retornado",
    objective: "Separar mentalmente a DEFINIÇÃO da função e a CHAMADA da função.",
    whyItMatters: "Esse é o primeiro passo para organizar um programa em pequenas responsabilidades reutilizáveis.",
    analogy: "Uma função é como um botão identificado. A definição explica o que o botão faz; a chamada é o momento em que você aperta o botão.",
    story: [
      "O JavaScript registra a função mostrarMensagem.",
      "A execução encontra mostrarMensagem().",
      "O controle entra nas chaves da função.",
      "console.log() executa a ação.",
      "A função termina e o programa continua na linha seguinte à chamada."
    ],
    trace: [
      { label: "DEFINIÇÃO", value: "function mostrarMensagem()", note: "Aqui descrevemos a responsabilidade." },
      { label: "CHAMADA", value: "mostrarMensagem()", note: "Aqui pedimos que a função execute." },
      { label: "AÇÃO", value: "console.log(...) ", note: "O comando dentro das chaves pertence à função." }
    ],
    focus: ["function declara a função", "() vazio significa que não há parâmetros", "As chaves guardam as ações", "Uma função pode ser chamada várias vezes"],
    pitfalls: ["Confundir criar a função com executá-la", "Achar que declarar a função já imprime alguma coisa"],
    checkpoint: "Se mostrarMensagem() for chamada três vezes, existe uma definição e três execuções.",
    code: `// Exemplo01.js
// DEFINIÇÃO: criamos uma função chamada mostrarMensagem.
function mostrarMensagem() {
    // Tudo dentro destas chaves pertence à função.
    console.log("Sistema iniciado!");
}

// CHAMADA: agora pedimos para a função executar.
mostrarMensagem();`
  },
  {
    id: 2,
    title: "Um parâmetro",
    concept: "Parâmetro = caixinha de entrada; argumento = valor enviado",
    difficulty: "Base",
    xp: 50,
    input: "nome",
    process: "Montar uma mensagem com o nome recebido",
    output: "Mensagem exibida no console",
    objective: "Entender que o parâmetro não nasce com um valor fixo; ele será preenchido a cada chamada.",
    whyItMatters: "A mesma função passa a trabalhar com pessoas diferentes sem duplicar código.",
    analogy: "É um formulário com um campo vazio chamado nome. Cada chamada preenche esse campo antes do trabalho começar.",
    story: [
      "A função mostrarNome é definida com o parâmetro nome.",
      "A chamada envia o argumento \"Carlos\".",
      "Dentro daquela execução, nome passa a conter \"Carlos\".",
      "console.log usa o valor recebido.",
      "A execução termina; outra chamada pode preencher nome com outro valor."
    ],
    trace: [
      { label: "ARGUMENTO", value: '"Carlos"', note: "Valor real enviado na chamada." },
      { label: "PARÂMETRO", value: "nome", note: "Caixinha preparada na definição." },
      { label: "DENTRO", value: 'nome = "Carlos"', note: "Valor disponível durante aquela execução." }
    ],
    focus: ["Parâmetro e argumento não são sinônimos", "JavaScript não exige String nome", "O valor muda de uma chamada para outra"],
    pitfalls: ["Escrever nome como se fosse um valor fixo", "Achar que o parâmetro é global"],
    checkpoint: "mostrarNome(\"Maria\") reutiliza a mesma função, apenas com outro argumento.",
    code: `// Exemplo02.js
function mostrarNome(nome) {
    // nome recebe o argumento enviado na chamada.
    console.log("Nome:", nome);
}

// "Carlos" é o argumento.
mostrarNome("Carlos");

// A mesma função recebe outro valor.
mostrarNome("Maria");`
  },
  {
    id: 3,
    title: "Dois parâmetros",
    concept: "Posição e quantidade dos argumentos",
    difficulty: "Base",
    xp: 60,
    input: "nome + idade",
    process: "Usar duas informações na mesma tarefa",
    output: "Dados exibidos",
    objective: "Visualizar que cada argumento ocupa a posição do parâmetro correspondente.",
    whyItMatters: "Funções reais quase sempre precisam combinar mais de uma informação.",
    analogy: "Uma ficha possui o campo nome e o campo idade. A ordem dos dados precisa combinar com o que cada campo representa.",
    story: [
      "mostrarPessoa é definida com nome e idade.",
      "A chamada envia \"Carlos\" primeiro e 41 depois.",
      "nome recebe \"Carlos\"; idade recebe 41.",
      "A função usa cada caixinha em sua posição.",
      "A função termina e o programa segue."
    ],
    trace: [
      { label: "POSIÇÃO 1", value: '"Carlos" → nome', note: "Primeiro argumento." },
      { label: "POSIÇÃO 2", value: "41 → idade", note: "Segundo argumento." },
      { label: "CHAMADA", value: 'mostrarPessoa("Carlos", 41)', note: "Quantidade e ordem precisam fazer sentido." }
    ],
    focus: ["JavaScript é dinâmico, mas a ordem continua importante", "Nomes de parâmetros devem explicar a responsabilidade", "Quantidade enviada precisa atender à lógica da função"],
    pitfalls: ["Inverter nome e idade e gerar um resultado sem sentido", "Achar que JavaScript impedirá toda combinação errada automaticamente"],
    checkpoint: "mostrarPessoa(41, \"Carlos\") roda, mas semanticamente os dados entram nas caixinhas erradas.",
    code: `// Exemplo03.js
function mostrarPessoa(nome, idade) {
    console.log("Nome:", nome);
    console.log("Idade:", idade);
}

// A ordem informa qual argumento entra em qual parâmetro.
mostrarPessoa("Carlos", 41);`
  },
  {
    id: 4,
    title: "return",
    concept: "A função calcula e devolve um valor",
    difficulty: "Base",
    xp: 70,
    input: "numero",
    process: "Multiplicar por 2",
    output: "Resultado devolvido",
    objective: "Diferenciar mostrar um valor com console.log de devolver um valor com return.",
    whyItMatters: "Backend depende de funções que produzem resultados para outras partes do sistema continuarem trabalhando.",
    analogy: "Uma calculadora não apenas mostra que trabalhou: ela entrega o número calculado para você usar em outra conta.",
    story: [
      "calcularDobro recebe 10.",
      "numero passa a valer 10 dentro daquela execução.",
      "numero * 2 produz 20.",
      "return entrega 20 para quem chamou.",
      "resultado guarda o valor devolvido."
    ],
    trace: [
      { label: "ENTRADA", value: "numero = 10", note: "Parâmetro preenchido." },
      { label: "PROCESSAMENTO", value: "10 * 2 = 20", note: "A função calcula." },
      { label: "RETURN", value: "20 → resultado", note: "O valor volta para o chamador." }
    ],
    focus: ["return devolve", "console.log apenas exibe", "O retorno pode ser guardado em outra variável"],
    pitfalls: ["Achar que console.log substitui return", "Colocar código depois de um return esperando que ele execute"],
    checkpoint: "calcularDobro(7) devolve 14; você pode guardar, comparar ou reutilizar esse 14.",
    code: `// Exemplo04.js
function calcularDobro(numero) {
    // return entrega o resultado para quem chamou.
    return numero * 2;
}

// resultado recebe aquilo que a função devolveu.
const resultado = calcularDobro(10);
console.log(resultado);`
  },
  {
    id: 5,
    title: "Soma com dois parâmetros",
    concept: "Entrada → processamento → saída",
    difficulty: "Base",
    xp: 80,
    input: "numero1 + numero2",
    process: "Somar os dois valores",
    output: "Soma retornada",
    objective: "Consolidar o modelo mental completo de uma função com parâmetros e retorno.",
    whyItMatters: "Esse padrão aparece em cálculos, regras de negócio, validações e transformação de dados.",
    analogy: "Duas peças entram na máquina, a máquina combina as duas e uma peça resultante sai do outro lado.",
    story: [
      "somar(10, 20) envia dois argumentos.",
      "numero1 recebe 10 e numero2 recebe 20.",
      "A expressão soma as duas caixinhas.",
      "return devolve 30.",
      "resultado recebe 30 e o programa continua."
    ],
    trace: [
      { label: "CAIXA 1", value: "numero1 = 10", note: "Primeiro parâmetro." },
      { label: "CAIXA 2", value: "numero2 = 20", note: "Segundo parâmetro." },
      { label: "SAÍDA", value: "30", note: "Resultado devolvido." }
    ],
    focus: ["Parâmetros são variáveis locais da função", "O retorno não precisa ter o mesmo nome do lado de fora", "A chamada pode usar valores literais ou variáveis"],
    pitfalls: ["Confundir resultado com numero1", "Somar strings sem perceber e obter concatenação"],
    checkpoint: "Se somar recebe números, 10 + 20 produz 30. Se recebe strings, o operador + pode concatenar.",
    code: `// Exemplo05.js
function somar(numero1, numero2) {
    return numero1 + numero2;
}

const resultado = somar(10, 20);
console.log("Resultado:", resultado);`
  },
  {
    id: 6,
    title: "Função + if",
    concept: "Uma função recebe informação e toma uma decisão",
    difficulty: "Base",
    xp: 90,
    input: "idade",
    process: "Comparar idade >= 18",
    output: "Mensagem no console",
    objective: "Combinar a lógica de decisão já conhecida com a organização de uma função.",
    whyItMatters: "Regras de negócio são frequentemente decisões executadas dentro de funções pequenas e nomeadas.",
    analogy: "A função é um fiscal: você entrega a idade e o fiscal escolhe qual mensagem liberar.",
    story: [
      "verificarIdade recebe 20.",
      "if avalia 20 >= 18.",
      "A expressão resulta em true.",
      "O bloco do if executa.",
      "A função termina sem devolver um valor útil."
    ],
    trace: [
      { label: "ENTRADA", value: "idade = 20", note: "Valor recebido." },
      { label: "PERGUNTA", value: "20 >= 18", note: "Resultado: true." },
      { label: "AÇÃO", value: "console.log", note: "O caminho verdadeiro executa." }
    ],
    focus: ["if continua sendo if dentro da função", "A função pode apenas executar uma ação", "Função sem return explícito devolve undefined"],
    pitfalls: ["Achar que toda função precisa de return", "Confundir a mensagem exibida com um valor devolvido"],
    checkpoint: "verificarIdade(15) escolhe o else, mas a função ainda não entrega true/false ao chamador.",
    code: `// Exemplo06.js
function verificarIdade(idade) {
    if (idade >= 18) {
        console.log("Maior de idade");
    } else {
        console.log("Menor de idade");
    }
}

verificarIdade(20);`
  },
  {
    id: 7,
    title: "if + return + boolean",
    concept: "A função responde uma pergunta ao chamador",
    difficulty: "Base",
    xp: 100,
    input: "idade",
    process: "Verificar maioridade",
    output: "true ou false",
    objective: "Entender a diferença entre mostrar a resposta e DEVOLVER a resposta.",
    whyItMatters: "Validações de backend precisam produzir respostas que outras funções possam usar em novas decisões.",
    analogy: "O fiscal não grita a resposta para a sala; ele entrega um cartão true/false para quem fez a pergunta.",
    story: [
      "verificarMaioridade recebe a idade.",
      "if testa idade >= 18.",
      "Se for true, return true encerra a função e devolve true.",
      "Se o if não executar, o fluxo chega a return false.",
      "resultado guarda a resposta devolvida."
    ],
    trace: [
      { label: "ENTRADA", value: "idade = 20", note: "Parâmetro." },
      { label: "DECISÃO", value: "20 >= 18 → true", note: "A comparação já é booleana." },
      { label: "SAÍDA", value: "return true", note: "Resposta entregue ao chamador." }
    ],
    focus: ["return encerra aquela execução", "boolean é um valor, não uma mensagem", "O chamador pode guardar o retorno"],
    pitfalls: ["Escrever console.log(true) e achar que retornou true", "Colocar dois returns esperando que ambos executem"],
    checkpoint: "Quem chama verificarMaioridade pode usar a resposta em outro if.",
    code: `// Exemplo07.js
function verificarMaioridade(idade) {
    if (idade >= 18) {
        return true;
    }

    return false;
}

const resultado = verificarMaioridade(20);
console.log(resultado);`
  },
  {
    id: 8,
    title: "Boolean direto",
    concept: "Uma comparação já produz true ou false",
    difficulty: "Base",
    xp: 110,
    input: "numero",
    process: "numero % 2 === 0",
    output: "boolean",
    objective: "Perceber que nem toda função booleana precisa de um if explícito.",
    whyItMatters: "Depois de entender o caminho longo, podemos escrever expressões claras e curtas sem perder o raciocínio.",
    analogy: "A pergunta já vem com uma resposta true/false; não precisamos perguntar novamente se a resposta é true.",
    story: [
      "ehPar recebe 8.",
      "8 % 2 produz resto 0.",
      "0 === 0 resulta em true.",
      "return devolve diretamente esse true.",
      "A função termina."
    ],
    trace: [
      { label: "RESTO", value: "8 % 2 = 0", note: "Operação matemática." },
      { label: "COMPARAÇÃO", value: "0 === 0", note: "Resultado booleano." },
      { label: "RETURN", value: "true", note: "Sem if adicional." }
    ],
    focus: ["Comparações produzem boolean", "=== é igualdade estrita", "Forma curta só deve vir depois da compreensão"],
    pitfalls: ["Usar = em vez de ===", "Encurtar sem entender o que a expressão devolve"],
    checkpoint: "ehPar(7) devolve false porque 7 % 2 resulta em 1.",
    code: `// Exemplo08.js
function ehPar(numero) {
    // A própria comparação já devolve true ou false.
    return numero % 2 === 0;
}

console.log(ehPar(8));
console.log(ehPar(7));`
  },
  {
    id: 9,
    title: "Escopo local",
    concept: "Cada bloco possui suas próprias caixinhas",
    difficulty: "Intermediário",
    xp: 120,
    input: "numero",
    process: "Criar variáveis locais",
    output: "Resultado local",
    objective: "Entender onde uma variável existe e por que let/const não devem ser imaginados como caixinhas globais.",
    whyItMatters: "Escopo evita que partes diferentes do sistema modifiquem variáveis que não pertencem àquela responsabilidade.",
    analogy: "Cada função é uma sala. Uma caixa colocada dentro da sala não aparece automaticamente na sala vizinha.",
    story: [
      "dobrar recebe 10.",
      "resultado nasce dentro da função e recebe 20.",
      "return copia o valor 20 para fora.",
      "A execução termina.",
      "A variável resultado interna não pode ser acessada diretamente fora da função."
    ],
    trace: [
      { label: "PARÂMETRO", value: "numero = 10", note: "Local da função." },
      { label: "LOCAL", value: "resultado = 20", note: "Também pertence à função." },
      { label: "RETURN", value: "20", note: "O valor sai; a variável local não sai." }
    ],
    focus: ["Valor retornado e variável local são coisas diferentes", "let e const têm escopo de bloco", "Escopo reduz efeitos colaterais"],
    pitfalls: ["Tentar usar resultado fora da função", "Criar variáveis globais só para evitar parâmetros"],
    checkpoint: "O return leva o VALOR para fora, não move a variável local para outro escopo.",
    code: `// Exemplo09.js
function dobrar(numero) {
    const resultado = numero * 2;
    return resultado;
}

const valorFinal = dobrar(10);
console.log(valorFinal);

// console.log(resultado); // erro: resultado só existe dentro da função`
  },
  {
    id: 10,
    title: "Função chamando função",
    concept: "Delegação e volta do controle",
    difficulty: "Intermediário",
    xp: 130,
    input: "numero",
    process: "calcularDobro chama multiplicar",
    output: "number",
    objective: "Visualizar por que a função que chama outra fica aguardando e continua quando a chamada interna termina.",
    whyItMatters: "É assim que um sistema grande é quebrado em pequenas responsabilidades cooperando entre si.",
    analogy: "B pede para C realizar uma tarefa específica. B não terminou; ele espera C devolver o resultado para continuar.",
    story: [
      "MAIN chama calcularDobro(5).",
      "calcularDobro precisa multiplicar e chama multiplicar(5, 2).",
      "calcularDobro fica aguardando naquele ponto.",
      "multiplicar devolve 10.",
      "calcularDobro recebe 10, devolve 10 e só então o chamador principal continua."
    ],
    trace: [
      { label: "A", value: "calcularDobro(5)", note: "Primeira função em execução." },
      { label: "B", value: "multiplicar(5, 2)", note: "Chamada interna." },
      { label: "VOLTA", value: "10 → calcularDobro → chamador", note: "O retorno volta pela cadeia." }
    ],
    focus: ["Chamar outra função não significa terminar", "Quem chamou recebe o controle de volta", "Cada função pode ter uma responsabilidade pequena"],
    pitfalls: ["Achar que a função interna volta diretamente para o início do programa", "Perder de vista quem chamou quem"],
    checkpoint: "Quando multiplicar termina, o controle volta para calcularDobro porque foi calcularDobro quem a chamou.",
    code: `// Exemplo10.js
function multiplicar(a, b) {
    return a * b;
}

function calcularDobro(numero) {
    // Esta função aguarda multiplicar terminar.
    const resultado = multiplicar(numero, 2);
    return resultado;
}

console.log(calcularDobro(5));`
  },
  {
    id: 11,
    title: "Resultado intermediário",
    concept: "Guardar o retorno de outra função antes de continuar",
    difficulty: "Intermediário",
    xp: 140,
    input: "preco",
    process: "Calcular desconto e preço final",
    output: "Preço final",
    objective: "Aprender a usar uma variável local para guardar o resultado devolvido por outra função.",
    whyItMatters: "Fluxos de negócio reais possuem várias etapas dependentes entre si.",
    analogy: "Uma etapa entrega um papel com o desconto calculado; a função principal pega esse papel e continua a conta.",
    story: [
      "calcularPrecoFinal recebe 100.",
      "Ela chama calcularDesconto(100).",
      "calcularDesconto devolve 10.",
      "A variável desconto guarda 10.",
      "A função calcula 100 - 10 e devolve 90."
    ],
    trace: [
      { label: "PREÇO", value: "100", note: "Entrada principal." },
      { label: "INTERMEDIÁRIO", value: "desconto = 10", note: "Retorno guardado localmente." },
      { label: "FINAL", value: "90", note: "Resultado do fluxo." }
    ],
    focus: ["Uma função pode depender do retorno de outra", "Variáveis intermediárias tornam o raciocínio visível", "Cada etapa mantém sua responsabilidade"],
    pitfalls: ["Repetir o cálculo do desconto em vários lugares", "Misturar a exibição do valor com o cálculo"],
    checkpoint: "calcularPrecoFinal não precisa saber COMO o desconto é calculado; ela usa o resultado de calcularDesconto.",
    code: `// Exemplo11.js
function calcularDesconto(preco) {
    return preco * 0.10;
}

function calcularPrecoFinal(preco) {
    const desconto = calcularDesconto(preco);
    const precoFinal = preco - desconto;
    return precoFinal;
}

console.log(calcularPrecoFinal(100));`
  },
  {
    id: 12,
    title: "for dentro de função",
    concept: "Repetição como parte de uma responsabilidade",
    difficulty: "Intermediário",
    xp: 150,
    input: "limite",
    process: "Percorrer de 1 até o limite",
    output: "Valores exibidos",
    objective: "Conectar funções ao for sem introduzir uma lógica nova: a função apenas organiza o laço que você já conhece.",
    whyItMatters: "Uma tarefa repetitiva pode virar uma ferramenta reutilizável controlada por parâmetros.",
    analogy: "Você entrega à máquina quantas peças devem ser processadas; o for executa até atingir esse limite.",
    story: [
      "contarAte recebe 5.",
      "limite passa a valer 5.",
      "for cria contador = 1.",
      "Cada volta mostra o valor e incrementa contador.",
      "Ao chegar depois de 5, o for termina e a função acaba."
    ],
    trace: [
      { label: "PARÂMETRO", value: "limite = 5", note: "Define até onde repetir." },
      { label: "FOR", value: "contador 1 → 5", note: "Variável de controle local." },
      { label: "FIM", value: "contador sai do escopo", note: "Não há retorno útil." }
    ],
    focus: ["limite veio do argumento", "contador é local do for", "A mesma função pode contar até 3, 10 ou 100"],
    pitfalls: ["Fixar o limite dentro da função e perder reutilização", "Tentar usar contador depois do for"],
    checkpoint: "contarAte(20) usa a mesma definição e muda apenas a entrada.",
    code: `// Exemplo12.js
function contarAte(limite) {
    for (let contador = 1; contador <= limite; contador++) {
        console.log(contador);
    }
}

contarAte(5);`
  },
  {
    id: 13,
    title: "Acumulador + return",
    concept: "A variável nasce fora do for para existir depois dele",
    difficulty: "Intermediário",
    xp: 160,
    input: "limite",
    process: "Somar 1 até limite",
    output: "Total",
    objective: "Entender escopo e acumulador trabalhando juntos dentro de uma função.",
    whyItMatters: "Totais de vendas, valores financeiros e métricas usam esse padrão constantemente.",
    analogy: "O contador visita cada caixa; soma é o carrinho que continua carregando o total entre uma visita e outra.",
    story: [
      "somarAte recebe 5.",
      "soma nasce com 0 antes do for.",
      "O for percorre 1, 2, 3, 4 e 5.",
      "soma += contador atualiza o total em cada volta.",
      "Depois que o for termina, return soma devolve 15."
    ],
    trace: [
      { label: "INÍCIO", value: "soma = 0", note: "Acumulador da função." },
      { label: "VOLTA", value: "0 → 1 → 3 → 6 → 10 → 15", note: "Total parcial." },
      { label: "RETURN", value: "15", note: "Somente depois do laço." }
    ],
    focus: ["soma fica fora do for", "contador controla; soma acumula", "return vem depois que todas as voltas terminam"],
    pitfalls: ["Criar soma dentro do for e reiniciar o acumulador", "Dar return dentro da primeira volta"],
    checkpoint: "somarAte(5) devolve 15 porque o acumulador preserva o total entre as voltas.",
    code: `// Exemplo13.js
function somarAte(limite) {
    let soma = 0;

    for (let contador = 1; contador <= limite; contador++) {
        soma += contador;
    }

    return soma;
}

console.log(somarAte(5));`
  },
  {
    id: 14,
    title: "Contar ocorrências",
    concept: "quantidade++ dentro de uma função",
    difficulty: "Intermediário",
    xp: 170,
    input: "limite",
    process: "Contar números pares",
    output: "Quantidade",
    objective: "Reforçar definitivamente a diferença entre contar ocorrências e somar valores.",
    whyItMatters: "Contagens aparecem em relatórios, validações, estatísticas e APIs.",
    analogy: "Cada vez que o fiscal encontra uma peça válida, faz um risco numa folha. Ele conta riscos; não soma o número gravado na peça.",
    story: [
      "quantidade começa em 0.",
      "for percorre os números.",
      "if verifica se o número é par.",
      "Se for par, quantidade++ registra uma ocorrência.",
      "return devolve a quantidade final."
    ],
    trace: [
      { label: "CONTROLE", value: "contador", note: "Percorre valores." },
      { label: "FILTRO", value: "% 2 === 0", note: "Escolhe os pares." },
      { label: "QUANTIDADE", value: "0 → 1 → 2...", note: "Conta ocorrências." }
    ],
    focus: ["quantidade não guarda os números pares", "if decide quando incrementar", "O retorno é a contagem final"],
    pitfalls: ["Usar quantidade += contador", "Colocar return dentro do if e parar cedo"],
    checkpoint: "contarPares(10) devolve 5.",
    code: `// Exemplo14.js
function contarPares(limite) {
    let quantidade = 0;

    for (let contador = 1; contador <= limite; contador++) {
        if (contador % 2 === 0) {
            quantidade++;
        }
    }

    return quantidade;
}

console.log(contarPares(10));`
  },
  {
    id: 15,
    title: "Somar múltiplos",
    concept: "Um parâmetro extra torna a função mais genérica",
    difficulty: "Intermediário",
    xp: 180,
    input: "limite + divisor",
    process: "Filtrar múltiplos e acumular",
    output: "Soma",
    objective: "Perceber como mover uma regra fixa para um parâmetro aumenta a reutilização.",
    whyItMatters: "Generalizar regras é uma habilidade central para evitar funções duplicadas.",
    analogy: "A mesma peneira recebe um tamanho de furo diferente. divisor muda a regra sem construir outra máquina.",
    story: [
      "A função recebe limite e divisor.",
      "for percorre de 1 até limite.",
      "if testa contador % divisor === 0.",
      "Somente os aprovados entram no acumulador.",
      "return devolve a soma."
    ],
    trace: [
      { label: "REGRA", value: "divisor = 7", note: "Também veio de fora." },
      { label: "FILTRO", value: "contador % divisor === 0", note: "Funciona com outros divisores." },
      { label: "TOTAL", value: "soma", note: "Acumula os valores aprovados." }
    ],
    focus: ["Parâmetros tornam a função genérica", "A função não precisa conhecer 7 antecipadamente", "Mesma lógica funciona para 3, 4 ou 7"],
    pitfalls: ["Fixar divisor dentro da função", "Confundir quantidade de múltiplos com soma dos múltiplos"],
    checkpoint: "somarMultiplos(20, 5) e somarMultiplos(20, 4) usam a mesma função.",
    code: `// Exemplo15.js
function somarMultiplos(limite, divisor) {
    let soma = 0;

    for (let contador = 1; contador <= limite; contador++) {
        if (contador % divisor === 0) {
            soma += contador;
        }
    }

    return soma;
}

console.log(somarMultiplos(20, 5));`
  },
  {
    id: 16,
    title: "switch dentro de função",
    concept: "Uma função pode organizar uma escolha entre casos",
    difficulty: "Integração",
    xp: 200,
    input: "operacao + numero1 + numero2",
    process: "Selecionar a operação",
    output: "Resultado ou null",
    objective: "Reutilizar switch dentro de uma responsabilidade nomeada.",
    whyItMatters: "Organizar a decisão numa função evita espalhar a mesma regra de escolha pelo sistema.",
    analogy: "A função é uma central que recebe três informações e encaminha a conta para o case adequado.",
    story: [
      "calcular recebe os dois números e a operação.",
      "switch analisa a operação.",
      "O case escolhido faz o cálculo.",
      "return devolve imediatamente o resultado.",
      "Se nenhum case servir, a função devolve null."
    ],
    trace: [
      { label: "ENTRADA", value: "20, 10, '+'", note: "Três argumentos." },
      { label: "SWITCH", value: "case '+'", note: "Caminho correspondente." },
      { label: "RETURN", value: "30", note: "Resultado da operação." }
    ],
    focus: ["return pode substituir break quando encerra a função", "null pode representar ausência intencional de resultado", "A função concentra a regra"],
    pitfalls: ["Esquecer o caminho inválido", "Dividir sem pensar em divisor zero"],
    checkpoint: "Quando um case executa return, a função termina naquele ponto e não precisa de break depois dele.",
    code: `// Exemplo16.js
function calcular(numero1, numero2, operacao) {
    switch (operacao) {
        case "+":
            return numero1 + numero2;
        case "-":
            return numero1 - numero2;
        case "*":
            return numero1 * numero2;
        case "/":
            return numero1 / numero2;
        default:
            return null;
    }
}

console.log(calcular(20, 10, "+"));`
  },
  {
    id: 17,
    title: "Validação antes do cálculo",
    concept: "Guard clause: encerrar cedo quando a entrada é inválida",
    difficulty: "Integração",
    xp: 220,
    input: "numero1 + numero2",
    process: "Validar divisor e calcular",
    output: "Resultado ou mensagem de erro",
    objective: "Entender que return também pode proteger a função antes do processamento principal.",
    whyItMatters: "Backend precisa validar entradas antes de executar regras ou acessar recursos.",
    analogy: "Antes de a máquina começar a trabalhar, um fiscal verifica se a peça pode entrar. Se não puder, o processo termina ali.",
    story: [
      "dividir recebe numero1 e numero2.",
      "A primeira pergunta verifica se numero2 === 0.",
      "Se for zero, return devolve uma mensagem e encerra a função.",
      "Caso contrário, o programa chega ao cálculo.",
      "return devolve o resultado da divisão."
    ],
    trace: [
      { label: "VALIDAÇÃO", value: "numero2 === 0", note: "Acontece antes do cálculo." },
      { label: "CAMINHO INVÁLIDO", value: 'return "Divisão inválida"', note: "Encerra cedo." },
      { label: "CAMINHO VÁLIDO", value: "return numero1 / numero2", note: "Só executa quando permitido." }
    ],
    focus: ["Validar antes de processar", "return pode encerrar cedo", "Funções podem devolver tipos diferentes, mas isso deve ser uma decisão consciente"],
    pitfalls: ["Fazer a divisão antes de validar", "Retornar formatos diferentes sem um contrato claro em sistemas maiores"],
    checkpoint: "dividir(10, 0) nunca chega à linha da divisão porque o primeiro return encerra a função.",
    code: `// Exemplo17.js
function dividir(numero1, numero2) {
    if (numero2 === 0) {
        return "Divisão inválida";
    }

    return numero1 / numero2;
}

console.log(dividir(10, 2));
console.log(dividir(10, 0));`
  },
  {
    id: 18,
    title: "Pequeno fluxo de aprovação",
    concept: "Várias funções pequenas trabalhando juntas",
    difficulty: "Integração",
    xp: 250,
    input: "nota + frequencia",
    process: "Validar nota e frequência separadamente",
    output: "boolean",
    objective: "Construir uma regra maior combinando funções simples que podem ser compreendidas isoladamente.",
    whyItMatters: "Essa separação é a base de um backend organizado: cada função responde uma pergunta pequena.",
    analogy: "Dois fiscais verificam critérios diferentes; a função principal apenas combina os dois pareceres.",
    story: [
      "alunoAprovado recebe nota e frequência.",
      "notaSuficiente responde true/false para a nota.",
      "frequenciaSuficiente responde true/false para a frequência.",
      "alunoAprovado combina as duas respostas com &&.",
      "O resultado final volta para o chamador."
    ],
    trace: [
      { label: "NOTA", value: "8 → true", note: "Primeira regra." },
      { label: "FREQUÊNCIA", value: "80 → true", note: "Segunda regra." },
      { label: "FINAL", value: "true && true → true", note: "Combinação das regras." }
    ],
    focus: ["Cada função tem uma pergunta clara", "O retorno booleano facilita combinar regras", "Função principal coordena em vez de duplicar lógica"],
    pitfalls: ["Colocar toda a lógica em uma única função gigante", "Repetir os mesmos limites em vários lugares"],
    checkpoint: "Se uma das duas funções devolver false, && faz a aprovação final ser false.",
    code: `// Exemplo18.js
function notaSuficiente(nota) {
    return nota >= 7;
}

function frequenciaSuficiente(frequencia) {
    return frequencia >= 75;
}

function alunoAprovado(nota, frequencia) {
    return notaSuficiente(nota) && frequenciaSuficiente(frequencia);
}

console.log(alunoAprovado(8, 80));`
  },
  {
    id: 19,
    title: "Relatório de múltiplos",
    concept: "Contar e somar na mesma função sem confundir responsabilidades",
    difficulty: "Integração",
    xp: 280,
    input: "limite + divisor",
    process: "Percorrer, filtrar, contar e somar",
    output: "Texto de resumo",
    objective: "Integrar os conceitos que marcaram os módulos de repetição dentro de uma função JavaScript.",
    whyItMatters: "É um exercício de consolidação: a função organiza uma regra que usa contador, quantidade, soma e decisão.",
    analogy: "Um fiscal percorre as peças, marca quantas passaram e também mantém um total dos códigos aprovados.",
    story: [
      "A função recebe limite e divisor.",
      "quantidade e soma começam em 0.",
      "for percorre os valores; if filtra os múltiplos.",
      "quantidade conta ocorrências e soma acumula valores.",
      "A função monta e devolve uma frase com os dois resultados."
    ],
    trace: [
      { label: "PERCURSO", value: "contador", note: "Visita cada valor." },
      { label: "CONTAGEM", value: "quantidade++", note: "Conta aprovados." },
      { label: "ACÚMULO", value: "soma += contador", note: "Soma os valores aprovados." }
    ],
    focus: ["Uma função pode ter várias variáveis locais", "Cada variável mantém uma responsabilidade", "O return acontece após o laço"],
    pitfalls: ["Usar a mesma variável para contar e somar", "Dar return dentro do for"],
    checkpoint: "A função só conhece o resultado completo quando o percurso terminou.",
    code: `// Exemplo19.js
function gerarResumoMultiplos(limite, divisor) {
    let quantidade = 0;
    let soma = 0;

    for (let contador = 1; contador <= limite; contador++) {
        if (contador % divisor === 0) {
            quantidade++;
            soma += contador;
        }
    }

    return \`Quantidade: \${quantidade} | Soma: \${soma}\`;
}

console.log(gerarResumoMultiplos(30, 3));`
  },
  {
    id: 20,
    title: "Mini sistema integrado",
    concept: "Orquestrar funções sem concentrar todo o trabalho em um lugar",
    difficulty: "Integração",
    xp: 350,
    input: "preco + quantidade + percentualDesconto",
    process: "Subtotal → desconto → total",
    output: "Total final",
    objective: "Fechar a série enxergando um pequeno fluxo de negócio composto por funções independentes.",
    whyItMatters: "É a ponte entre exercícios isolados e a organização que você encontrará em um backend real.",
    analogy: "Uma linha de produção: uma estação calcula subtotal, outra calcula desconto e a função principal coordena a passagem do valor entre elas.",
    story: [
      "calcularPedido recebe preço, quantidade e percentual.",
      "calcularSubtotal multiplica preço por quantidade e devolve o subtotal.",
      "calcularDesconto recebe subtotal e percentual e devolve o desconto.",
      "calcularPedido subtrai o desconto do subtotal.",
      "O total final é devolvido para quem chamou."
    ],
    trace: [
      { label: "SUBTOTAL", value: "20 * 5 = 100", note: "Primeira função auxiliar." },
      { label: "DESCONTO", value: "100 * 10 / 100 = 10", note: "Segunda função auxiliar." },
      { label: "TOTAL", value: "100 - 10 = 90", note: "Resultado da função principal." }
    ],
    focus: ["Função principal coordena", "Funções auxiliares calculam partes pequenas", "Valores viajam por argumentos e returns", "Nomes das funções contam a história do sistema"],
    pitfalls: ["Criar uma função gigante com tudo misturado", "Usar variáveis globais para transportar valores entre funções", "Exibir resultados no meio das funções de cálculo sem necessidade"],
    checkpoint: "Se você consegue acompanhar 20 → 5 → subtotal 100 → desconto 10 → total 90, já está lendo um fluxo funcional completo.",
    code: `// Exemplo20.js
function calcularSubtotal(preco, quantidade) {
    return preco * quantidade;
}

function calcularDesconto(valor, percentual) {
    return valor * percentual / 100;
}

function calcularPedido(preco, quantidade, percentualDesconto) {
    const subtotal = calcularSubtotal(preco, quantidade);
    const desconto = calcularDesconto(subtotal, percentualDesconto);
    const total = subtotal - desconto;

    return total;
}

const totalPedido = calcularPedido(20, 5, 10);
console.log("Total do pedido:", totalPedido);`
  }
];
