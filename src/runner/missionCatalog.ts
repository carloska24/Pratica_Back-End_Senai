export const starterCode = `// Aula atual · Funções JavaScript
// Objetivo: receber uma idade e devolver uma resposta booleana.

function verificarMaioridade(idade) {
    // A condição usa o valor recebido no parâmetro idade.
    if (idade >= 18) {
        return true;
    }

    return false;
}

// 20 é o argumento enviado para a função.
const resultado = verificarMaioridade(20);
console.log(resultado);`;

export const functionMissionFile = "Desafio01_Pedido.js";
export const functionMissionCode = `// MISSÃO FINAL M07 · FUNÇÕES
// Complete as três funções sem consultar a solução da biblioteca.

function calcularSubtotal(preco, quantidade) {
    // devolva preco * quantidade
}

function calcularDesconto(subtotal, percentual) {
    // devolva o valor do desconto
}

function calcularTotalPedido(preco, quantidade, percentualDesconto) {
    // 1. valores inválidos devem devolver 0
    // 2. chame as duas funções anteriores
    // 3. devolva subtotal - desconto
}

const total = calcularTotalPedido(50, 3, 10);
console.log("Total do pedido:", total);`;

export const arrayMissionFile = "DesafioFinal_Arrays.js";
export const arrayMissionCode = `// MISSÃO FINAL M08 · ARRAYS
// Reconstrua as três funções usando for, if, return, length e push.

function possuiCodigo(codigos, codigoProcurado) {
    // percorra o array e devolva true quando encontrar
}

function calcularMedia(notas) {
    // array vazio deve devolver 0
    // percorra as notas, some e devolva soma / length
}

function registrarCodigo(codigos, novoCodigo) {
    // não permita códigos duplicados
    // adicione o novo código no final e devolva true
}

const codigos = [101, 205, 310, 411];
console.log("Encontrou 310:", possuiCodigo(codigos, 310));
console.log("Média:", calcularMedia([8, 7.5, 9, 6.5]));`;

export const objectMissionFile = "DesafioFinal_Objetos.js";
export const objectMissionCode = `// MISSÃO FINAL M09 · OBJETOS
// Use objetos, arrays, for, if, return e push para cuidar de um pedido.

function calcularTotalPedido(pedido) {
    // percorra pedido.itens e some preco * quantidade
    // um pedido sem itens deve devolver 0
}

function resumirPedido(pedido) {
    // devolva um novo objeto com:
    // codigo, cliente, quantidadeItens e total
}

function registrarItem(pedido, novoItem) {
    // não permita dois itens com o mesmo codigo
    // adicione o item e devolva true; se for duplicado, devolva false
}

const pedido = {
    codigo: "PED-104",
    cliente: { nome: "Carlos", cidade: "São Paulo" },
    itens: [
        { codigo: "TEC-01", descricao: "Teclado", preco: 249.50, quantidade: 1 },
        { codigo: "MOU-02", descricao: "Mouse", preco: 89.75, quantidade: 2 }
    ]
};

console.log("Total:", calcularTotalPedido(pedido));
console.log("Resumo:", resumirPedido(pedido));`;

export const dataMissionFile = "DesafioFinal_Dados.js";
export const dataMissionCode = `// MISSÃO FINAL M10 · STRINGS, MATH E DATE
// Transforme dados brutos em valores previsíveis para o Backend.

function normalizarEmail(email) {
    // retire espaços externos e converta para letras minúsculas
}

function calcularPrecoFinal(preco, percentualDesconto) {
    // aplique o desconto e arredonde o resultado para centavos
}

function criarRegistro(produto, dataIso) {
    // devolva: CODIGO | nome sem espaços | R$ 0.00 | data ISO em UTC
    // use trim(), toFixed(2), new Date() e toISOString()
}

const produto = { codigo: "P-104", nome: "  Teclado  ", preco: 249.90 };
console.log(criarRegistro(produto, "2026-08-20T15:30:00.000Z"));`;

export const modernArrayMissionFile = "DesafioFinal_ArraysModernos.js";
export const modernArrayMissionCode = `// MISSÃO FINAL M11 · ARRAYS MODERNOS
// Use filter, map, find, every e reduce. Nesta missão, não reconstrua com for.

function selecionarDisponiveis(produtos) {
    // ativo === true e estoque > 0
}

function criarEtiquetas(produtos) {
    // devolva: CODIGO - NOME EM MAIÚSCULAS
}

function buscarPorCodigo(produtos, codigo) {
    // use find e devolva null quando não encontrar
}

function todosPrecosValidos(produtos) {
    // use every: todos os preços devem ser maiores que zero
}

function calcularValorEstoque(produtos) {
    // use reduce com valor inicial 0: preco * estoque de cada produto
}

const produtos = [
    { codigo: "P01", nome: "Teclado", preco: 249.50, estoque: 2, ativo: true },
    { codigo: "P02", nome: "Mouse", preco: 89.75, estoque: 4, ativo: true },
    { codigo: "P03", nome: "Cabo", preco: 10, estoque: 0, ativo: true }
];

console.log(selecionarDisponiveis(produtos));`;

export const modernJavaScriptMissionFile = "DesafioFinal_JavaScriptModerno.js";
export const modernJavaScriptMissionCode = `// MISSÃO FINAL M12 · JAVASCRIPT MODERNO
// Use arrow, destructuring, spread, rest, defaults, optional chaining e ??.

const criarEtiqueta = (produto) => {
    // devolva: CODIGO - NOME EM MAIÚSCULAS
};

function atualizarProduto(produto, alteracoes) {
    // devolva um novo objeto sem alterar produto
}

function somarValores(...valores) {
    // some todos com reduce; nenhum valor deve devolver 0
}

function criarResumoUsuario({ nome = "Visitante", endereco } = {}) {
    // cidade deve usar endereco?.cidade e o fallback "Não informada"
    // devolva { nome, cidade }
}

const produto = { codigo: "P01", nome: "Teclado", estoque: 8 };
console.log(criarEtiqueta(produto));`;
