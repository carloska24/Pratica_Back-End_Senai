export type CourseItem = {
  id: string;
  title: string;
  kind: "aula" | "exercicio" | "desafio" | "extra";
  summary: string;
  concepts: string[];
  code?: string;
  note?: string;
  fileName?: string;
};

export type CourseLibraryModule = {
  id: string;
  title: string;
  status: "concluido" | "andamento" | "disponivel";
  items: CourseItem[];
};

export const courseLibrary: CourseLibraryModule[] = [
  {
    id: "M01",
    title: "Fundamentos JavaScript",
    status: "concluido",
    items: [
      {
        id: "M01-A01", kind: "aula", title: "Aula01 · Variáveis, let, const e tipos",
        summary: "As primeiras caixinhas do JavaScript: como criar, nomear e guardar informações sem depender dos tipos explícitos do Java.",
        concepts: ["let", "const", "string", "number", "boolean", "typeof", "console.log"]
      },
      {
        id: "M01-E01", kind: "exercicio", title: "Exercicio01 · Dados pessoais",
        fileName: "Exercicio01.js",
        summary: "Migrar o primeiro exercício de variáveis para JavaScript, guardando nome, idade, altura e situação de trabalho.",
        concepts: ["const", "string", "number", "boolean", "console.log"],
        code: `// Exercicio01.js
// Objetivo: criar caixinhas para diferentes tipos de informação.
// Em JavaScript, usamos const quando o valor não precisa ser reatribuído.

const nome = "Carlos";      // string: texto
const idade = 41;            // number: número inteiro
const altura = 1.70;         // number: número decimal também é number
const trabalha = true;       // boolean: verdadeiro ou falso

// console.log() exibe informações no console.
console.log(nome);
console.log(idade);
console.log(altura);
console.log(trabalha);`
      },
      {
        id: "M01-E02", kind: "exercicio", title: "Exercicio02 · Dados profissionais",
        fileName: "Exercicio02.js",
        summary: "Guardar empresa, cargo, salário e experiência usando nomes de variáveis que explicam o que cada caixinha representa.",
        concepts: ["const", "nomenclatura", "string", "number"],
        code: `// Exercicio02.js
// Objetivo: representar informações profissionais com variáveis bem nomeadas.

const empresa = "CADService";          // texto
const cargo = "Operador de CAM";       // texto
const salario = 4600;                   // number
const anosExperiencia = 16;             // number

console.log(empresa);
console.log(cargo);
console.log(salario);
console.log(anosExperiencia);`
      },
      {
        id: "M01-E03", kind: "exercicio", title: "Exercicio03 · Operadores matemáticos",
        fileName: "Exercicio03.js",
        summary: "Usar dois números para praticar soma, subtração, multiplicação, divisão e resto da divisão.",
        concepts: ["+", "-", "*", "/", "%"],
        code: `// Exercicio03.js
// Objetivo: praticar os principais operadores aritméticos.

const numero1 = 20;
const numero2 = 8;

console.log(numero1 + numero2); // soma
console.log(numero1 - numero2); // subtração
console.log(numero1 * numero2); // multiplicação
console.log(numero1 / numero2); // divisão
console.log(numero1 % numero2); // resto da divisão`
      },
      {
        id: "M01-E04", kind: "exercicio", title: "Exercicio04 · Salário com bônus",
        fileName: "Exercicio04.js",
        summary: "Criar uma terceira caixinha para guardar o resultado da soma entre salário e bônus.",
        concepts: ["variável de resultado", "soma", "const"],
        code: `// Exercicio04.js
// Objetivo: guardar o resultado de um cálculo em outra variável.

const salario = 4600;
const bonus = 750;

// A expressão é calculada primeiro e o resultado vai para salarioFinal.
const salarioFinal = salario + bonus;

console.log("Salário final:", salarioFinal);`
      },
      {
        id: "M01-E05", kind: "exercicio", title: "Exercicio05 · Média de três notas",
        fileName: "Exercicio05.js",
        summary: "Somar três notas, dividir por três e guardar a média calculada.",
        concepts: ["precedência", "média", "expressões"],
        code: `// Exercicio05.js
// Objetivo: calcular a média de três notas.

const nota1 = 8.5;
const nota2 = 7.0;
const nota3 = 9.5;

// Os parênteses deixam explícito que primeiro somamos as notas.
const media = (nota1 + nota2 + nota3) / 3;

console.log("A média é:", media);`
      },
      {
        id: "M01-E06", kind: "exercicio", title: "Exercicio06 · Operadores de atribuição",
        fileName: "Exercicio06.js",
        summary: "Alterar o conteúdo de uma caixinha usando +=, -=, *= e /=.",
        concepts: ["let", "+=", "-=", "*=", "/="],
        code: `// Exercicio06.js
// Objetivo: entender que let permite reatribuir o valor da variável.

let estoque = 50;

estoque += 20; // estoque = estoque + 20
console.log(estoque);

estoque -= 10; // estoque = estoque - 10
console.log(estoque);

estoque *= 2;  // estoque = estoque * 2
console.log(estoque);

estoque /= 2;  // estoque = estoque / 2
console.log(estoque);`
      },
      {
        id: "M01-E07", kind: "exercicio", title: "Exercicio07 · Incremento e decremento",
        fileName: "Exercicio07.js",
        summary: "Treinar ++ e -- para aumentar ou diminuir uma unidade.",
        concepts: ["let", "++", "--"],
        code: `// Exercicio07.js
// Objetivo: praticar incremento e decremento de uma unidade.

let contador = 0;

contador++;
contador++;
contador++;
contador--;
contador++;

console.log("Valor final:", contador);`
      },
      {
        id: "M01-D01", kind: "desafio", title: "Desafio01 · Produção de placas",
        fileName: "Desafio01.js",
        summary: "Calcular produção, desconto e parcelamento em uma situação prática.",
        concepts: ["const", "multiplicação", "porcentagem", "divisão"],
        code: `// Desafio01.js
// Objetivo: calcular valor total, desconto e parcelamento da produção.

const valorPlaca = 18.75;
const placasProduzidas = 325;

const valorTotalProducao = valorPlaca * placasProduzidas;
const desconto = valorTotalProducao * 0.10;
const valorComDesconto = valorTotalProducao - desconto;
const valorParcela = valorComDesconto / 5;

console.log("Valor total da produção:", valorTotalProducao);
console.log("Valor com 10% de desconto:", valorComDesconto);
console.log("Valor dividido em 5 parcelas:", valorParcela);`
      },
      {
        id: "M01-X01", kind: "extra", title: "DesafioExtra01 · Meta de produção",
        fileName: "DesafioExtra01.js",
        summary: "Usar let para o valor que muda e const para a meta que permanece fixa.",
        concepts: ["let", "const", "+=", "-=", "diferença"],
        code: `// DesafioExtra01.js
// Objetivo: distinguir valor mutável de valor que não deve ser reatribuído.

let placasProduzidas = 100;
const META = 150;

placasProduzidas += 25;
placasProduzidas += 15;
placasProduzidas -= 5;

const faltam = META - placasProduzidas;

console.log("Produzidas:", placasProduzidas);
console.log("Meta:", META);
console.log("Faltam:", faltam);`
      }
    ]
  },
  {
    id: "M02",
    title: "Estruturas de decisão",
    status: "concluido",
    items: [
      {
        id: "M02-A01", kind: "aula", title: "Aula01 · if, else e else if",
        summary: "A condição responde uma pergunta; as chaves agrupam as ações que pertencem a cada caminho.",
        concepts: ["if", "else", "else if", "===", "!==", ">=", "&&", "||"]
      },
      {
        id: "M02-E01", kind: "exercicio", title: "Exercicio01 · Controle de entrada",
        fileName: "Exercicio01.js",
        summary: "Verificar se a idade permite entrada.",
        concepts: ["if", "else", ">="],
        code: `// Exercicio01.js
// Objetivo: tomar uma decisão a partir da idade.

const idade = 20;

// Se a condição for true, o primeiro bloco executa.
if (idade >= 18) {
    console.log("Pode entrar");
} else {
    // Se for false, o bloco do else executa.
    console.log("Entrada proibida");
}`
      },
      {
        id: "M02-E02", kind: "exercicio", title: "Exercicio02 · Situação do aluno",
        fileName: "Exercicio02.js",
        summary: "Classificar uma nota como aprovada ou reprovada.",
        concepts: ["if", "else", "number"],
        code: `// Exercicio02.js
// Objetivo: usar uma condição para classificar uma nota.

const nota = 6.5;

if (nota >= 7) {
    console.log("Aprovado");
} else {
    console.log("Reprovado");
}`
      },
      {
        id: "M02-E03", kind: "exercicio", title: "Exercicio03 · Controle de estoque",
        fileName: "Exercicio03.js",
        summary: "Decidir se o estoque é suficiente ou se é necessário comprar mais peças.",
        concepts: ["if", "else", "regra de negócio"],
        code: `// Exercicio03.js
// Objetivo: transformar uma regra de estoque em decisão.

const estoque = 12;

if (estoque >= 10) {
    console.log("Estoque suficiente");
} else {
    console.log("Comprar mais peças");
}`
      },
      {
        id: "M02-D01", kind: "desafio", title: "Desafio01 · Liberação de placa",
        fileName: "Desafio01.js",
        summary: "Combinar duas condições usando && para decidir se a placa pode ser liberada.",
        concepts: ["boolean", "&&", "if", "regra composta"],
        code: `// Desafio01.js
// Objetivo: liberar apenas quando as duas condições forem verdadeiras.

const placaAprovada = true;
const quantidadeComponentes = 145;

// && significa: as duas condições precisam ser true.
if (placaAprovada && quantidadeComponentes >= 100) {
    console.log("Liberar para montagem");
} else {
    console.log("Enviar para inspeção");
}`
      },
      {
        id: "M02-A02", kind: "aula", title: "Aula02 · switch",
        summary: "Escolher um caminho entre vários casos conhecidos. No JavaScript moderno, break continua evitando que a execução caia no próximo case.",
        concepts: ["switch", "case", "break", "default"]
      },
      {
        id: "M02-E04", kind: "exercicio", title: "Exercicio04 · Planos de acesso",
        fileName: "Exercicio04.js",
        summary: "Selecionar a mensagem correta a partir do plano escolhido.",
        concepts: ["switch", "string", "break"],
        code: `// Exercicio04.js
// Objetivo: escolher um comportamento a partir de um valor conhecido.

const plano = "Premium";

switch (plano) {
    case "Basico":
        console.log("Acesso limitado");
        break;
    case "Premium":
        console.log("Acesso completo");
        break;
    case "Enterprise":
        console.log("Acesso empresarial");
        break;
    default:
        console.log("Plano inexistente");
}`
      },
      {
        id: "M02-D02", kind: "desafio", title: "Desafio02 · Calculadora com switch",
        fileName: "Desafio02.js",
        summary: "Escolher a operação matemática com base no símbolo informado.",
        concepts: ["switch", "operadores", "string"],
        code: `// Desafio02.js
// Objetivo: selecionar a operação usando switch.

const numero1 = 20;
const numero2 = 10;
const operacao = "+";

switch (operacao) {
    case "+":
        console.log(numero1 + numero2);
        break;
    case "-":
        console.log(numero1 - numero2);
        break;
    case "*":
        console.log(numero1 * numero2);
        break;
    case "/":
        console.log(numero1 / numero2);
        break;
    default:
        console.log("Operação inválida");
}`
      },
      {
        id: "M02-X01", kind: "extra", title: "DesafioExtra01 · Menu bancário",
        fileName: "DesafioExtra01.js",
        summary: "Representar um menu numérico com cinco opções e um caminho padrão.",
        concepts: ["switch", "case", "default"],
        code: `// DesafioExtra01.js
// Objetivo: praticar vários cases em um menu.

const opcao = 2;

switch (opcao) {
    case 1:
        console.log("Consulta realizada com sucesso");
        break;
    case 2:
        console.log("Saque realizado com sucesso");
        break;
    case 3:
        console.log("Depósito realizado com sucesso");
        break;
    case 4:
        console.log("Transferência realizada com sucesso");
        break;
    case 5:
        console.log("Encerrando sistema");
        break;
    default:
        console.log("Opção inválida");
}`
      }
    ]
  },
  {
    id: "M03",
    title: "Laços de repetição — while",
    status: "concluido",
    items: [
      {
        id: "M03-A01", kind: "aula", title: "Aula01 · while e condição de parada",
        summary: "Enquanto a condição for verdadeira, o bloco se repete. Alguma coisa dentro do processo precisa aproximar a condição do fim.",
        concepts: ["while", "condição", "contador++", "loop infinito"]
      },
      {
        id: "M03-E01", kind: "exercicio", title: "Exercicio01 · Contagem progressiva",
        fileName: "Exercicio01.js",
        summary: "Usar um contador para repetir de 1 até 10.",
        concepts: ["while", "contador", "++"],
        code: `// Exercicio01.js
// Objetivo: repetir enquanto contador for menor ou igual a 10.

let contador = 1;

while (contador <= 10) {
    console.log(contador);

    // Sem esta atualização, contador ficaria sempre em 1.
    contador++;
}`
      },
      {
        id: "M03-E02", kind: "exercicio", title: "Exercicio02 · Tabuada",
        fileName: "Exercicio02.js",
        summary: "Usar while para multiplicar um número pelos valores de 1 até 10.",
        concepts: ["while", "multiplicação", "contador"],
        code: `// Exercicio02.js
// Objetivo: produzir uma tabuada com repetição.

const numero = 7;
let contador = 1;

while (contador <= 10) {
    const resultado = numero * contador;
    console.log(\`\${numero} x \${contador} = \${resultado}\`);
    contador++;
}`
      },
      {
        id: "M03-E03", kind: "exercicio", title: "Exercicio03 · while + if",
        fileName: "Exercicio03.js",
        summary: "Percorrer números e tomar uma decisão dentro de cada repetição.",
        concepts: ["while", "if", "blocos"]
      },
      {
        id: "M03-X01", kind: "extra", title: "DesafioExtra01 · Quantidade de positivos",
        fileName: "DesafioExtra01.js",
        summary: "Percorrer de -5 até 5 e contar quantos valores positivos aparecem.",
        concepts: ["while", "if", "quantidade++"],
        code: `// DesafioExtra01.js
// Objetivo: contar ocorrências, não somar os valores encontrados.

let contador = -5;
let quantidadePositivos = 0;

while (contador <= 5) {
    if (contador > 0) {
        // Aumenta 1 porque encontramos UMA ocorrência positiva.
        quantidadePositivos++;
    }

    contador++;
}

console.log("Quantidade de números positivos:", quantidadePositivos);`
      },
      {
        id: "M03-X02", kind: "extra", title: "DesafioExtra02 · Soma dos ímpares",
        fileName: "DesafioExtra02.js",
        summary: "Percorrer 1 a 15, identificar ímpares e acumular a soma.",
        concepts: ["while", "%", "soma acumulada"],
        code: `// DesafioExtra02.js
// Objetivo: diferenciar a caixinha que percorre da caixinha que acumula.

let contador = 1;
let somaImpares = 0;

while (contador <= 15) {
    if (contador % 2 !== 0) {
        console.log(contador);

        // somaImpares mantém o total acumulado até este momento.
        somaImpares += contador;
    }

    contador++;
}

console.log("Soma dos números ímpares:", somaImpares);`
      },
      {
        id: "M03-X03", kind: "extra", title: "DesafioExtra03 · Múltiplos com quantidade e soma",
        fileName: "DesafioExtra03.js",
        summary: "Revisão extra para usar ao mesmo tempo uma caixinha que conta e outra que soma.",
        concepts: ["while", "if", "contador de ocorrências", "acumulador"],
        note: "Extra acrescentado para revisão após a migração para JavaScript.",
        code: `// DesafioExtra03.js
// Objetivo: contar e somar múltiplos de 3 entre 1 e 30.

let contador = 1;
let quantidadeMultiplos = 0;
let somaMultiplos = 0;

while (contador <= 30) {
    if (contador % 3 === 0) {
        quantidadeMultiplos++; // conta quantos foram encontrados
        somaMultiplos += contador; // soma os valores encontrados
    }

    contador++;
}

console.log("Quantidade:", quantidadeMultiplos);
console.log("Soma:", somaMultiplos);`
      }
    ]
  },
  {
    id: "M04",
    title: "Laços de repetição — for",
    status: "concluido",
    items: [
      {
        id: "M04-A01", kind: "aula", title: "Aula01 · Anatomia do for",
        summary: "O for concentra início, condição e atualização em uma linha; as chaves dizem o que acontece a cada volta.",
        concepts: ["for", "let", "condição", "incremento"]
      },
      {
        id: "M04-E01", kind: "exercicio", title: "Exercicio01 · Números de 1 a 10",
        fileName: "Exercicio01.js",
        summary: "Primeiro for simples com contador local.",
        concepts: ["for", "let", "console.log"],
        code: `// Exercicio01.js
// Objetivo: percorrer os números de 1 até 10.

console.log("Abaixo os números de 1 a 10:");

for (let contador = 1; contador <= 10; contador++) {
    console.log(contador);
}`
      },
      {
        id: "M04-E02", kind: "exercicio", title: "Exercicio02 · Números de 5 a 15",
        fileName: "Exercicio02.js",
        summary: "Alterar apenas o início e o limite do mesmo padrão de repetição.",
        concepts: ["for", "intervalo"],
        code: `// Exercicio02.js
// Objetivo: começar o percurso em 5 e terminar em 15.

for (let contador = 5; contador <= 15; contador++) {
    console.log(contador);
}`
      },
      {
        id: "M04-E03", kind: "exercicio", title: "Exercicio03 · Contagem regressiva",
        fileName: "Exercicio03.js",
        summary: "Usar contador-- para caminhar de 10 até 1.",
        concepts: ["for", "--", ">="],
        code: `// Exercicio03.js
// Objetivo: percorrer em ordem decrescente.

for (let contador = 10; contador >= 1; contador--) {
    console.log(contador);
}`
      },
      {
        id: "M04-D01", kind: "desafio", title: "Desafio01 · Pares de 1 a 20",
        fileName: "Desafio01.js",
        summary: "Combinar for + if + % para mostrar apenas números pares.",
        concepts: ["for", "if", "%", "==="],
        code: `// Desafio01.js
// Objetivo: exibir somente números pares de 1 até 20.

for (let contador = 1; contador <= 20; contador++) {
    if (contador % 2 === 0) {
        console.log(contador);
    }
}`
      },
      {
        id: "M04-X01", kind: "extra", title: "DesafioExtra01 · Ímpares em ordem regressiva",
        fileName: "DesafioExtra01.js",
        summary: "Revisão extra de for decrescente com filtro por condição.",
        concepts: ["for", "if", "--", "%"],
        note: "Extra acrescentado para revisão em JavaScript.",
        code: `// DesafioExtra01.js
// Objetivo: combinar decremento com verificação de número ímpar.

for (let contador = 15; contador >= 1; contador--) {
    if (contador % 2 !== 0) {
        console.log(contador);
    }
}`
      }
    ]
  },
  {
    id: "M05",
    title: "Repetição avançada",
    status: "concluido",
    items: [
      {
        id: "M05-A01", kind: "aula", title: "Aula01 · Contador x acumulador",
        summary: "contador/quantidade responde quantas vezes; soma/acumulador responde qual total foi acumulado.",
        concepts: ["contador", "quantidade", "acumulador", "+=", "++"]
      },
      {
        id: "M05-E01", kind: "exercicio", title: "Exercicio01 · Quantidade entre 50 e 100",
        fileName: "Exercicio01.js",
        summary: "Contar quantas voltas o for executa no intervalo de 50 até 100.",
        concepts: ["for", "quantidade++"],
        code: `// Exercicio01.js
// Objetivo: contar ocorrências usando uma caixinha separada.

let quantidade = 0;

for (let contador = 50; contador <= 100; contador++) {
    // Não queremos guardar o valor do contador.
    // Queremos registrar que MAIS UMA volta aconteceu.
    quantidade++;
}

console.log("Quantidade:", quantidade);`
      },
      {
        id: "M05-E02", kind: "exercicio", title: "Exercicio02 · Múltiplos de 4",
        fileName: "Exercicio02.js",
        summary: "Mostrar, contar e somar múltiplos de 4 entre 1 e 30.",
        concepts: ["for", "if", "quantidade", "soma"],
        code: `// Exercicio02.js
// Objetivo: usar duas caixinhas com responsabilidades diferentes.

let quantidadeMultiplos = 0;
let somaMultiplos = 0;

for (let contador = 1; contador <= 30; contador++) {
    if (contador % 4 === 0) {
        quantidadeMultiplos++;     // quantos múltiplos encontrei?
        somaMultiplos += contador; // qual é o total dos valores encontrados?
        console.log(contador);
    }
}

console.log("Quantidade de múltiplos:", quantidadeMultiplos);
console.log("Soma dos múltiplos:", somaMultiplos);`
      },
      {
        id: "M05-D01", kind: "desafio", title: "Desafio01 · Múltiplos de 7",
        fileName: "Desafio01.js",
        summary: "Percorrer 1 a 100, mostrar, contar e somar os múltiplos de 7.",
        concepts: ["for", "if", "múltiplos", "acumulador"],
        code: `// Desafio01.js
// Objetivo: aplicar o padrão de contador + acumulador em um desafio completo.

let quantidadeMultiplos = 0;
let somaMultiplos = 0;

for (let contador = 1; contador <= 100; contador++) {
    if (contador % 7 === 0) {
        quantidadeMultiplos++;
        somaMultiplos += contador;
        console.log(contador);
    }
}

console.log("Quantidade de múltiplos de 7:", quantidadeMultiplos);
console.log("Soma dos múltiplos de 7:", somaMultiplos);`
      },
      {
        id: "M05-X01", kind: "extra", title: "Teste01 · Produtos promocionais",
        fileName: "Teste01.js",
        summary: "Teste que consolidou o entendimento das caixinhas: múltiplos de 3 entre 1 e 30 e quantidade encontrada.",
        concepts: ["for", "if", "quantidade", "fixação"],
        code: `// Teste01.js
// Objetivo: confirmar se o conceito da caixinha quantidade foi compreendido.

let produtos = 0;

for (let contador = 1; contador <= 30; contador++) {
    if (contador % 3 === 0) {
        produtos++;
        console.log(contador);
    }
}

console.log("Quantidade de produtos:", produtos);`
      },
      {
        id: "M05-X02", kind: "extra", title: "DesafioExtra01 · Quantidade e soma dos pares",
        fileName: "DesafioExtra01.js",
        summary: "Extra para reestudo com duas caixinhas: quantidade de pares e soma dos códigos pares.",
        concepts: ["for", "if", "quantidade", "soma"],
        note: "Extra acrescentado para reforçar o padrão antes de avançar.",
        code: `// DesafioExtra01.js
// Objetivo: usar duas caixinhas independentes no mesmo filtro.

let quantidadePares = 0;
let somaPares = 0;

for (let funcionario = 1; funcionario <= 50; funcionario++) {
    if (funcionario % 2 === 0) {
        quantidadePares++;
        somaPares += funcionario;
    }
}

console.log("Quantidade de funcionários pares:", quantidadePares);
console.log("Soma dos códigos pares:", somaPares);`
      }
    ]
  },
  {
    id: "M06",
    title: "Laços aninhados",
    status: "andamento",
    items: [
      {
        id: "M06-A01", kind: "aula", title: "Aula01 · Uma repetição dentro da outra",
        summary: "Para cada item do laço externo, o laço interno executa todas as próprias voltas antes de o externo continuar.",
        concepts: ["for aninhado", "laço externo", "laço interno", "ordem de execução"]
      },
      {
        id: "M06-E01", kind: "exercicio", title: "Exercicio01 · Linhas 1 a 5",
        fileName: "Exercicio01.js",
        summary: "Aquecimento: um for simples antes de adicionar o segundo nível.",
        concepts: ["for"],
        code: `// Exercicio01.js
// Objetivo: revisar a repetição simples antes do aninhamento.

for (let linha = 1; linha <= 5; linha++) {
    console.log("Linha", linha);
}`
      },
      {
        id: "M06-E02", kind: "exercicio", title: "Exercicio02 · Linhas e colunas",
        fileName: "Exercicio02.js",
        summary: "A linha externa muda apenas depois que todas as colunas internas terminarem.",
        concepts: ["for aninhado", "linha", "coluna"],
        code: `// Exercicio02.js
// Objetivo: visualizar quem repete primeiro em dois laços aninhados.

for (let linha = 1; linha <= 3; linha++) {
    // Executa uma vez para cada volta do for externo.
    console.log("Linha", linha);

    for (let coluna = 1; coluna <= 3; coluna++) {
        // Este bloco precisa terminar as 3 colunas antes da próxima linha.
        console.log("   Coluna", coluna);
    }

    console.log("");
}`
      },
      {
        id: "M06-A02", kind: "aula", title: "Aula02 · Limite dinâmico e padrões",
        summary: "O limite do laço interno pode depender do valor atual do laço externo. Esse tópico fica como revisão, sem avançar para três laços antes da base estar sólida.",
        concepts: ["limite dinâmico", "coluna <= linha", "padrões"]
      },
      {
        id: "M06-E03", kind: "exercicio", title: "Exercicio03 · Blocos de estrelas",
        fileName: "Exercicio03.js",
        summary: "Três níveis de repetição formam, para cada linha, os desenhos *, ** e ***.",
        concepts: ["for aninhado", "linha", "coluna", "acumulador"],
        note: "Migração direta do Exercicio03.java, preservando a intenção do exercício original.",
        code: `// Exercicio03.js
// Objetivo: formar blocos de estrelas usando repetições aninhadas.

for (let linha = 1; linha <= 3; linha++) {
    console.log(\`Linha \${linha}\`);

    for (let coluna = 1; coluna <= 3; coluna++) {
        let estrelas = "";

        for (let estrela = 1; estrela <= coluna; estrela++) {
            estrelas += "*";
        }

        console.log(estrelas);
    }

    console.log("");
}`
      },
      {
        id: "M06-X01", kind: "extra", title: "RevisaoExtra01 · Grade 3 x 3",
        fileName: "RevisaoExtra01.js",
        summary: "Repetir pares de coordenadas sem introduzir matriz: apenas compreender a ordem dos dois for.",
        concepts: ["for aninhado", "coordenadas"],
        note: "Exemplo de revisão; não representa conteúdo de matriz.",
        code: `// RevisaoExtra01.js
// Objetivo: observar a combinação linha/coluna sem falar de matrizes.

for (let linha = 1; linha <= 3; linha++) {
    for (let coluna = 1; coluna <= 3; coluna++) {
        console.log(\`Linha \${linha} | Coluna \${coluna}\`);
    }
}`
      }
    ]
  },
  {
    id: "M07",
    title: "Funções",
    status: "andamento",
    items: [
      {
        id: "M07-A01", kind: "aula", title: "Aula01 · O que é uma função",
        fileName: "Aula01_MostrarMensagem.js",
        summary: "Uma função é uma caixa de ações criada para executar uma responsabilidade específica e poder ser chamada sempre que necessário.",
        concepts: ["function", "responsabilidade", "chamada"]
      },
      {
        id: "M07-A02", kind: "aula", title: "Aula02 · Chamada e volta do controle",
        fileName: "Aula02_Cumprimentar.js",
        summary: "Quando uma função chama outra, a função atual fica aguardando; quando a chamada termina, a execução continua da linha seguinte.",
        concepts: ["chamada", "fluxo", "pilha de chamadas"]
      },
      {
        id: "M07-A03", kind: "aula", title: "Aula03 · Parâmetros e argumentos",
        fileName: "Aula03_MostrarNome.js",
        summary: "Parâmetro é a caixinha preparada na definição; argumento é o valor colocado nela durante a chamada.",
        concepts: ["parâmetro", "argumento", "ordem", "quantidade"]
      },
      {
        id: "M07-A04", kind: "aula", title: "Aula04 · return",
        fileName: "Aula04_Somar.js",
        summary: "return entrega um valor para quem chamou e encerra aquela execução da função naquele ponto.",
        concepts: ["return", "resultado", "chamada"]
      },
      {
        id: "M07-A05", kind: "aula", title: "Aula05 · Função chamando função",
        summary: "Uma função pode delegar uma parte do trabalho a outra e continuar depois que ela devolver o controle.",
        concepts: ["delegação", "funções encadeadas"]
      },
      {
        id: "M07-A06", kind: "aula", title: "Aula06 · Escopo",
        summary: "let e const possuem escopo de bloco; uma variável local existe dentro do bloco onde foi criada e não deve ser tratada como global por acidente.",
        concepts: ["escopo", "let", "const", "blocos"]
      },
      {
        id: "M07-A07", kind: "aula", title: "Aula07 · Função + if + return + boolean",
        fileName: "Aula07_VerificarIdade.js",
        summary: "A função recebe a idade, toma uma decisão e devolve true ou false para quem fez a chamada.",
        concepts: ["function", "if", "return", "boolean"],
        code: `// Aula07.js
// Objetivo: receber uma idade e DEVOLVER uma resposta booleana.

function verificarMaioridade(idade) {
    // idade é o parâmetro: a caixinha de entrada da função.
    if (idade >= 18) {
        // return devolve true e encerra esta execução da função.
        return true;
    }

    // Se o if não executar, o programa chega até este return.
    return false;
}

// 20 é o argumento enviado para o parâmetro idade.
const resultado = verificarMaioridade(20);

// Aqui apenas mostramos o valor que voltou da função.
console.log(resultado);`
      },
      {
        id: "M07-E01", kind: "exercicio", title: "Exercicio01 · Dobrar um número",
        fileName: "Exercicio01_Dobrar.js",
        summary: "Criar uma função pequena com um parâmetro e um retorno calculado.",
        concepts: ["function", "parâmetro", "argumento", "return"],
        code: `// Exercicio01_Dobrar.js
// Pratique sem consultar: entrada -> processamento -> retorno.

function dobrar(numero) {
    return numero * 2;
}

const resultado = dobrar(12);
console.log(resultado);`
      },
      {
        id: "M07-E02", kind: "exercicio", title: "Exercicio02 · Classificar uma nota",
        fileName: "Exercicio02_ClassificarNota.js",
        summary: "Combinar parâmetro, if e return para devolver uma classificação.",
        concepts: ["function", "if", "return", "string"],
        code: `// Exercicio02_ClassificarNota.js
// A função recebe uma nota, decide e devolve uma classificação.

function classificarNota(nota) {
    if (nota >= 7) {
        return "Aprovado";
    }

    return "Revisar";
}

console.log(classificarNota(8.5));
console.log(classificarNota(5));`
      },
      {
        id: "M07-D01", kind: "desafio", title: "Desafio01 · Total de um pedido",
        fileName: "Desafio01_Pedido.js",
        summary: "Separar subtotal, desconto e total em funções que colaboram sem misturar responsabilidades.",
        concepts: ["function", "return", "delegação", "validação"],
        note: "Fechamento do módulo: tente reconstruir este desafio sem consultar a solução.",
        code: `// Desafio01_Pedido.js
// Funções pequenas colaboram para calcular o total de um pedido.

function calcularSubtotal(preco, quantidade) {
    return preco * quantidade;
}

function calcularDesconto(subtotal, percentual) {
    return subtotal * (percentual / 100);
}

function calcularTotalPedido(preco, quantidade, percentualDesconto) {
    if (preco <= 0 || quantidade <= 0) {
        return 0;
    }

    const subtotal = calcularSubtotal(preco, quantidade);
    const desconto = calcularDesconto(subtotal, percentualDesconto);
    return subtotal - desconto;
}

console.log(calcularTotalPedido(50, 3, 10));`
      }
    ]
  },
  {
    id: "M08",
    title: "Arrays",
    status: "disponivel",
    items: [
      {
        id: "M08-A01", kind: "aula", title: "Aula01 · Uma lista dentro de uma caixinha",
        summary: "Um array reúne vários valores em ordem. Cada posição possui um índice que começa em zero.",
        concepts: ["array", "índice", "length", "acesso"]
      },
      {
        id: "M08-E01", kind: "exercicio", title: "Exercicio01 · Índices de uma produção",
        fileName: "Exercicio01_Indices.js",
        summary: "Acessar etapas específicas e descobrir quantos elementos existem no array.",
        concepts: ["array", "índice", "length", "console.log"],
        code: `// Exercicio01_Indices.js
const etapas = ["Cortar", "Montar", "Testar", "Embalar"];

console.log(etapas[0]);
console.log(etapas[2]);
console.log("Quantidade de etapas:", etapas.length);`
      },
      {
        id: "M08-A02", kind: "aula", title: "Aula02 · Adicionar e remover no final",
        summary: "push adiciona um item no fim do array; pop remove o último item e também devolve esse valor.",
        concepts: ["push", "pop", "length", "mutação"]
      },
      {
        id: "M08-E02", kind: "exercicio", title: "Exercicio02 · Fila de códigos",
        fileName: "Exercicio02_PushPop.js",
        summary: "Atualizar uma fila usando push e pop e observar o valor que foi removido.",
        concepts: ["array", "push", "pop", "retorno"],
        code: `// Exercicio02_PushPop.js
const fila = ["P001", "P002"];

fila.push("P003");
const ultimoCodigo = fila.pop();

console.log("Código removido:", ultimoCodigo);
console.log("Fila atual:", fila);`
      },
      {
        id: "M08-A03", kind: "aula", title: "Aula03 · Percorrer com for",
        summary: "O for percorre os índices de zero até length - 1 e permite trabalhar com cada elemento.",
        concepts: ["for", "índice", "length", "percurso de array"]
      },
      {
        id: "M08-E03", kind: "exercicio", title: "Exercicio03 · Soma e média",
        fileName: "Exercicio03_Media.js",
        summary: "Percorrer notas, acumular a soma e calcular a média usando length.",
        concepts: ["array", "for", "índice", "soma acumulada"],
        code: `// Exercicio03_Media.js
const notas = [8, 7.5, 9, 6.5];
let soma = 0;

for (let indice = 0; indice < notas.length; indice++) {
    soma += notas[indice];
}

const media = soma / notas.length;
console.log("Média:", media);`
      },
      {
        id: "M08-A04", kind: "aula", title: "Aula04 · Buscar um valor",
        summary: "Uma busca percorre o array, compara cada elemento e pode encerrar a função assim que encontra o alvo.",
        concepts: ["busca", "for", "if", "return"]
      },
      {
        id: "M08-D01", kind: "desafio", title: "Desafio01 · Localizar código",
        fileName: "Desafio01_BuscarCodigo.js",
        summary: "Combinar funções, arrays, for, if e return em uma busca que devolve boolean.",
        concepts: ["array", "busca", "function", "return"],
        note: "Ponte entre Funções e Arrays: o array entra como argumento e a função responde true ou false.",
        code: `// Desafio01_BuscarCodigo.js
function possuiCodigo(codigos, codigoProcurado) {
    for (let indice = 0; indice < codigos.length; indice++) {
        if (codigos[indice] === codigoProcurado) {
            return true;
        }
    }

    return false;
}

const codigos = [101, 205, 310, 411];
console.log(possuiCodigo(codigos, 310));
console.log(possuiCodigo(codigos, 999));`
      }
    ]
  },
  {
    id: "M09",
    title: "Objetos JavaScript",
    status: "disponivel",
    items: [
      {
        id: "M09-A01", kind: "aula", title: "Aula01 · Uma entidade com várias características",
        summary: "Um objeto reúne informações relacionadas usando pares chave e valor, como um produto com código, nome, preço e situação.",
        concepts: ["objeto", "chave", "valor", "propriedade"]
      },
      {
        id: "M09-E01", kind: "exercicio", title: "Exercicio01 · Ficha de produto",
        fileName: "Exercicio01_Produto.js",
        summary: "Criar um produto como objeto e acessar suas propriedades sem espalhar os dados em várias variáveis.",
        concepts: ["objeto", "propriedade", "acesso por ponto", "typeof"],
        code: `// Exercicio01_Produto.js
const produto = {
    codigo: "P001",
    nome: "Teclado mecânico",
    preco: 249.90,
    ativo: true
};

console.log("Código:", produto.codigo);
console.log("Produto:", produto.nome);
console.log("Preço:", produto.preco);
console.log("Ativo:", produto.ativo);`
      },
      {
        id: "M09-A02", kind: "aula", title: "Aula02 · Ler, alterar e criar propriedades",
        summary: "A notação de ponto é direta; os colchetes permitem usar uma chave guardada em variável. Atribuição altera ou cria propriedades.",
        concepts: ["acesso por ponto", "acesso por colchetes", "atualização", "chave dinâmica"]
      },
      {
        id: "M09-E02", kind: "exercicio", title: "Exercicio02 · Atualização de estoque",
        fileName: "Exercicio02_Estoque.js",
        summary: "Receber o nome de uma propriedade, atualizar o estoque e criar uma informação de última movimentação.",
        concepts: ["objeto", "chave dinâmica", "atualização", "propriedade"],
        code: `// Exercicio02_Estoque.js
const produto = {
    codigo: "P002",
    nome: "Mouse",
    estoque: 12
};

const campo = "estoque";
produto[campo] -= 3;
produto.ultimaMovimentacao = "saída";

console.log(produto);`
      },
      {
        id: "M09-A03", kind: "aula", title: "Aula03 · Comportamento dentro do objeto",
        summary: "Uma propriedade pode guardar uma função. Quando ela usa this, lê outras propriedades do próprio objeto que recebeu a chamada.",
        concepts: ["método", "this", "função", "responsabilidade"]
      },
      {
        id: "M09-E03", kind: "exercicio", title: "Exercicio03 · Subtotal do item",
        fileName: "Exercicio03_MetodoTotal.js",
        summary: "Criar um método que calcula preço vezes quantidade usando os dados do próprio item.",
        concepts: ["método", "this", "return", "cálculo"],
        code: `// Exercicio03_MetodoTotal.js
const item = {
    descricao: "Cabo de rede",
    preco: 18.50,
    quantidade: 4,
    calcularSubtotal: function () {
        return this.preco * this.quantidade;
    }
};

console.log("Subtotal:", item.calcularSubtotal());`
      },
      {
        id: "M09-A04", kind: "aula", title: "Aula04 · Objetos dentro de objetos",
        summary: "Dados reais formam estruturas: um pedido possui cliente, itens e endereço. O acesso acompanha cada nível dessa organização.",
        concepts: ["objeto aninhado", "array de objetos", "acesso", "JSON"]
      },
      {
        id: "M09-D01", kind: "desafio", title: "Desafio01 · Resumo de pedido",
        fileName: "Desafio01_ResumoPedido.js",
        summary: "Combinar objeto, array, for e função para produzir o subtotal de um pedido e um resumo do cliente.",
        concepts: ["objeto aninhado", "array de objetos", "for", "return"],
        note: "Ponte para Backend: objetos JavaScript possuem a mesma organização central dos documentos JSON enviados e recebidos por APIs.",
        code: `// Desafio01_ResumoPedido.js
function calcularTotalPedido(pedido) {
    let total = 0;

    for (let indice = 0; indice < pedido.itens.length; indice++) {
        const item = pedido.itens[indice];
        total += item.preco * item.quantidade;
    }

    return total;
}

const pedido = {
    numero: 1042,
    cliente: {
        nome: "Carlos",
        cidade: "São Paulo"
    },
    itens: [
        { descricao: "Teclado", preco: 249.50, quantidade: 1 },
        { descricao: "Mouse", preco: 89.75, quantidade: 2 }
    ]
};

console.log("Cliente:", pedido.cliente.nome);
console.log("Total:", calcularTotalPedido(pedido));`
      }
    ]
  },
  {
    id: "M10",
    title: "Strings, Math e Date",
    status: "disponivel",
    items: [
      {
        id: "M10-A01", kind: "aula", title: "Aula01 · Texto também é dado",
        summary: "Strings chegam de formulários e APIs com maiúsculas, espaços e variações. Antes de comparar ou salvar, precisamos normalizar o texto conscientemente.",
        concepts: ["string", "trim", "toLowerCase", "toUpperCase"]
      },
      {
        id: "M10-E01", kind: "exercicio", title: "Exercicio01 · Normalizar cadastro",
        fileName: "Exercicio01_NormalizarCadastro.js",
        summary: "Limpar o nome e o e-mail recebidos sem perder o valor original usado para auditoria.",
        concepts: ["trim", "toLowerCase", "toUpperCase", "imutabilidade"],
        code: `// Exercicio01_NormalizarCadastro.js
const nomeRecebido = "  Carlos Pereira  ";
const emailRecebido = "  CARLOS@EMAIL.COM ";

const nomeLimpo = nomeRecebido.trim();
const emailNormalizado = emailRecebido.trim().toLowerCase();

console.log("Nome:", nomeLimpo);
console.log("E-mail:", emailNormalizado);
console.log("Original preservado:", emailRecebido);`
      },
      {
        id: "M10-A02", kind: "aula", title: "Aula02 · Montar textos com valores",
        summary: "Template literals inserem valores em uma string sem uma sequência confusa de sinais de mais. toFixed controla a exibição decimal e devolve texto.",
        concepts: ["template literal", "interpolação", "toFixed", "formatação"]
      },
      {
        id: "M10-E02", kind: "exercicio", title: "Exercicio02 · Linha do recibo",
        fileName: "Exercicio02_Recibo.js",
        summary: "Montar uma linha de recibo usando nome, quantidade, subtotal e duas casas decimais.",
        concepts: ["template literal", "interpolação", "toFixed", "number"],
        code: `// Exercicio02_Recibo.js
const produto = "Cabo de rede";
const preco = 18.50;
const quantidade = 4;
const subtotal = preco * quantidade;

const linha = \`\${quantidade}x \${produto} | R$ \${subtotal.toFixed(2)}\`;
console.log(linha);`
      },
      {
        id: "M10-A03", kind: "aula", title: "Aula03 · Regras de arredondamento",
        summary: "Math.round, Math.floor e Math.ceil respondem a regras diferentes. Em Backend, escolher a regra errada muda preço, estoque e paginação.",
        concepts: ["Math.round", "Math.floor", "Math.ceil", "precisão"]
      },
      {
        id: "M10-E03", kind: "exercicio", title: "Exercicio03 · Caixas necessárias",
        fileName: "Exercicio03_Caixas.js",
        summary: "Calcular quantas caixas inteiras são necessárias para armazenar todos os itens sem deixar nenhum de fora.",
        concepts: ["Math.ceil", "divisão", "regra de negócio", "return"],
        code: `// Exercicio03_Caixas.js
function calcularCaixas(quantidadeItens, capacidadePorCaixa) {
    return Math.ceil(quantidadeItens / capacidadePorCaixa);
}

console.log(calcularCaixas(23, 10)); // 3 caixas`
      },
      {
        id: "M10-A04", kind: "aula", title: "Aula04 · Um instante no tempo",
        summary: "Date representa um instante. Strings ISO evitam ambiguidades e os métodos UTC tornam exercícios e integrações previsíveis em qualquer computador.",
        concepts: ["Date", "ISO 8601", "UTC", "timestamp"]
      },
      {
        id: "M10-D01", kind: "desafio", title: "Desafio01 · Registro de auditoria",
        fileName: "Desafio01_RegistroAuditoria.js",
        summary: "Combinar objeto, normalização, arredondamento, template literal e data ISO para produzir uma linha estável de auditoria.",
        concepts: ["objeto", "trim", "Math.round", "Date"],
        note: "Ponte para Backend: APIs normalizam entradas, calculam valores e registram quando uma operação aconteceu antes de persistir os dados.",
        code: `// Desafio01_RegistroAuditoria.js
function arredondarCentavos(valor) {
    return Math.round(valor * 100) / 100;
}

function criarRegistro(produto, dataIso) {
    const instante = new Date(dataIso);
    const nome = produto.nome.trim();
    const preco = arredondarCentavos(produto.preco);

    return \`\${produto.codigo} | \${nome} | R$ \${preco.toFixed(2)} | \${instante.toISOString()}\`;
}

const produto = { codigo: "P-104", nome: "  Teclado  ", preco: 249.899 };
console.log(criarRegistro(produto, "2026-08-20T15:30:00.000Z"));`
      }
    ]
  },
  {
    id: "M11",
    title: "Arrays modernos",
    status: "disponivel",
    items: [
      {
        id: "M11-A01", kind: "aula", title: "Aula01 · Entregar uma função ao percurso",
        summary: "forEach percorre o array e chama uma função callback para cada elemento. O método cuida do índice; o callback descreve a ação.",
        concepts: ["callback", "forEach", "elemento", "índice"]
      },
      {
        id: "M11-E01", kind: "exercicio", title: "Exercicio01 · Relatório de estoque",
        fileName: "Exercicio01_ForEachEstoque.js",
        summary: "Percorrer produtos e exibir uma linha numerada para cada item sem controlar manualmente o limite do array.",
        concepts: ["forEach", "callback", "índice", "console.log"],
        code: `// Exercicio01_ForEachEstoque.js
const produtos = ["Teclado", "Mouse", "Monitor"];

produtos.forEach(function (produto, indice) {
    console.log(\`\${indice + 1}. \${produto}\`);
});`
      },
      {
        id: "M11-A02", kind: "aula", title: "Aula02 · Transformar sem apagar a origem",
        summary: "map chama o callback para cada elemento e guarda cada return em um novo array com o mesmo tamanho.",
        concepts: ["map", "transformação", "novo array", "return"]
      },
      {
        id: "M11-E02", kind: "exercicio", title: "Exercicio02 · Etiquetas da API",
        fileName: "Exercicio02_MapEtiquetas.js",
        summary: "Transformar objetos de produto em textos de etiqueta, preservando a coleção original recebida da API.",
        concepts: ["map", "objeto", "template literal", "imutabilidade"],
        code: `// Exercicio02_MapEtiquetas.js
const produtos = [
    { codigo: "P01", nome: "Teclado" },
    { codigo: "P02", nome: "Mouse" }
];

const etiquetas = produtos.map(function (produto) {
    return \`\${produto.codigo} - \${produto.nome.toUpperCase()}\`;
});

console.log(etiquetas);`
      },
      {
        id: "M11-A03", kind: "aula", title: "Aula03 · Deixar passar somente quem atende",
        summary: "filter usa o true ou false devolvido pelo callback para decidir quais elementos entram em um novo array.",
        concepts: ["filter", "predicado", "seleção", "boolean"]
      },
      {
        id: "M11-E03", kind: "exercicio", title: "Exercicio03 · Produtos disponíveis",
        fileName: "Exercicio03_FilterDisponiveis.js",
        summary: "Selecionar apenas produtos ativos e com estoque maior que zero usando uma regra booleana explícita.",
        concepts: ["filter", "predicado", "&&", "novo array"],
        code: `// Exercicio03_FilterDisponiveis.js
const produtos = [
    { codigo: "P01", ativo: true, estoque: 8 },
    { codigo: "P02", ativo: false, estoque: 4 },
    { codigo: "P03", ativo: true, estoque: 0 }
];

const disponiveis = produtos.filter(function (produto) {
    return produto.ativo === true && produto.estoque > 0;
});

console.log(disponiveis);`
      },
      {
        id: "M11-A04", kind: "aula", title: "Aula04 · Fazer perguntas para a coleção",
        summary: "find procura um elemento; some pergunta se existe algum; every pergunta se todos atendem. Cada método devolve uma resposta diferente.",
        concepts: ["find", "some", "every", "curto-circuito"]
      },
      {
        id: "M11-E04", kind: "exercicio", title: "Exercicio04 · Validar um lote",
        fileName: "Exercicio04_ValidarLote.js",
        summary: "Localizar um código, descobrir se há item esgotado e verificar se todos os preços são válidos.",
        concepts: ["find", "some", "every", "predicado"],
        code: `// Exercicio04_ValidarLote.js
const produtos = [
    { codigo: "P01", preco: 249.90, estoque: 8 },
    { codigo: "P02", preco: 89.50, estoque: 0 },
    { codigo: "P03", preco: 799.00, estoque: 3 }
];

const encontrado = produtos.find(function (produto) {
    return produto.codigo === "P02";
});
const possuiEsgotado = produtos.some(function (produto) {
    return produto.estoque === 0;
});
const todosPrecosValidos = produtos.every(function (produto) {
    return produto.preco > 0;
});

console.log(encontrado, possuiEsgotado, todosPrecosValidos);`
      },
      {
        id: "M11-A05", kind: "aula", title: "Aula05 · Carregar um resultado entre as voltas",
        summary: "reduce percorre a coleção levando um acumulador. O return de cada volta vira o acumulador recebido pela próxima.",
        concepts: ["reduce", "acumulador", "valor inicial", "return"]
      },
      {
        id: "M11-D01", kind: "desafio", title: "Desafio01 · Resumo do catálogo",
        fileName: "Desafio01_ResumoCatalogo.js",
        summary: "Selecionar produtos disponíveis, gerar etiquetas e reduzir seus valores de estoque em um pequeno fluxo de serviço.",
        concepts: ["filter", "map", "reduce", "pipeline"],
        note: "Ponte para Backend: services transformam coleções recebidas de repositórios em respostas menores e adequadas ao contrato da API.",
        code: `// Desafio01_ResumoCatalogo.js
function resumirCatalogo(produtos) {
    const disponiveis = produtos.filter(function (produto) {
        return produto.ativo && produto.estoque > 0;
    });

    const etiquetas = disponiveis.map(function (produto) {
        return \`\${produto.codigo} - \${produto.nome}\`;
    });

    const valorTotal = disponiveis.reduce(function (acumulador, produto) {
        return acumulador + produto.preco * produto.estoque;
    }, 0);

    return { etiquetas: etiquetas, valorTotal: valorTotal };
}`
      }
    ]
  },
  {
    id: "M12",
    title: "JavaScript moderno",
    status: "disponivel",
    items: [
      {
        id: "M12-A01", kind: "aula", title: "Aula01 · A mesma função, uma escrita mais curta",
        summary: "Arrow function continua sendo uma função. Parâmetros entram, o corpo executa e um resultado pode voltar; a diferença inicial está na sintaxe.",
        concepts: ["arrow function", "callback", "retorno implícito", "this"]
      },
      {
        id: "M12-E01", kind: "exercicio", title: "Exercicio01 · Etiquetas com arrow",
        fileName: "Exercicio01_ArrowEtiquetas.js",
        summary: "Reescrever o callback do map em forma de arrow function sem perder a leitura de entrada e retorno.",
        concepts: ["arrow function", "map", "retorno implícito", "template literal"],
        code: `// Exercicio01_ArrowEtiquetas.js
const produtos = [
    { codigo: "P01", nome: "Teclado" },
    { codigo: "P02", nome: "Mouse" }
];

const etiquetas = produtos.map(
    produto => \`\${produto.codigo} - \${produto.nome.toUpperCase()}\`
);

console.log(etiquetas);`
      },
      {
        id: "M12-A02", kind: "aula", title: "Aula02 · Abrir o objeto nas caixinhas certas",
        summary: "Destructuring lê propriedades ou posições e cria variáveis locais com os valores escolhidos, evitando repetir o caminho inteiro.",
        concepts: ["destructuring", "objeto", "array", "renomeação"]
      },
      {
        id: "M12-E02", kind: "exercicio", title: "Exercicio02 · Ler uma requisição",
        fileName: "Exercicio02_DestructuringPedido.js",
        summary: "Extrair código, cliente e primeiro item de um payload de pedido com destructuring de objeto e array.",
        concepts: ["destructuring", "objeto aninhado", "array", "parâmetro padrão"],
        code: `// Exercicio02_DestructuringPedido.js
const pedido = {
    codigo: "PED-10",
    cliente: { nome: "Carlos" },
    itens: ["Teclado", "Mouse"]
};

const { codigo, cliente: { nome }, itens: [primeiroItem] } = pedido;

console.log(codigo, nome, primeiroItem);`
      },
      {
        id: "M12-A03", kind: "aula", title: "Aula03 · Copiar antes de atualizar",
        summary: "Spread espalha propriedades ou elementos em uma nova estrutura. A ordem define qual valor prevalece e a cópia produzida é rasa.",
        concepts: ["spread", "imutabilidade", "cópia rasa", "sobrescrita"]
      },
      {
        id: "M12-E03", kind: "exercicio", title: "Exercicio03 · Atualização imutável",
        fileName: "Exercicio03_SpreadProduto.js",
        summary: "Criar uma versão atualizada do produto sem alterar o objeto original recebido pelo serviço.",
        concepts: ["spread", "objeto", "sobrescrita", "imutabilidade"],
        code: `// Exercicio03_SpreadProduto.js
const produto = { codigo: "P01", nome: "Teclado", estoque: 8 };
const alteracoes = { estoque: 5, ativo: true };

const atualizado = { ...produto, ...alteracoes };

console.log(produto);   // estoque continua 8
console.log(atualizado); // estoque 5, ativo true`
      },
      {
        id: "M12-A04", kind: "aula", title: "Aula04 · Entradas opcionais e quantidade variável",
        summary: "Parâmetro padrão cobre uma ausência conhecida; rest reúne os argumentos restantes em um array real.",
        concepts: ["parâmetro padrão", "rest", "argumento", "array"]
      },
      {
        id: "M12-E04", kind: "exercicio", title: "Exercicio04 · Registro flexível",
        fileName: "Exercicio04_RestPadrao.js",
        summary: "Criar um registro com nível padrão e reunir uma quantidade variável de mensagens para formar a descrição.",
        concepts: ["parâmetro padrão", "rest", "join", "template literal"],
        code: `// Exercicio04_RestPadrao.js
function criarLog(nivel = "INFO", ...mensagens) {
    return \`[\${nivel}] \${mensagens.join(" | ")}\`;
}

console.log(criarLog(undefined, "API iniciada", "porta 3000"));`
      },
      {
        id: "M12-A05", kind: "aula", title: "Aula05 · Acessar sem quebrar o caminho",
        summary: "Optional chaining interrompe o acesso quando encontra null ou undefined. O operador ?? fornece um valor apenas para essas duas ausências.",
        concepts: ["optional chaining", "nullish coalescing", "undefined", "acesso seguro"]
      },
      {
        id: "M12-D01", kind: "desafio", title: "Desafio01 · Resposta segura da API",
        fileName: "Desafio01_RespostaSegura.js",
        summary: "Combinar destructuring, default, rest, spread e optional chaining para criar uma resposta nova e previsível a partir de um payload incompleto.",
        concepts: ["destructuring", "spread", "rest", "optional chaining"],
        note: "Ponte para Backend: controllers recebem entradas parciais; services extraem, validam e devolvem novos objetos sem modificar o payload original.",
        code: `// Desafio01_RespostaSegura.js
const criarResposta = ({ usuario, ...dados } = {}) => {
    const nome = usuario?.nome ?? "Visitante";
    const cidade = usuario?.endereco?.cidade ?? "Não informada";

    return {
        ...dados,
        usuario: { nome, cidade },
        processado: true
    };
};

console.log(criarResposta({ codigo: 200, usuario: { nome: "Carlos" } }));`
      }
    ]
  }
];
