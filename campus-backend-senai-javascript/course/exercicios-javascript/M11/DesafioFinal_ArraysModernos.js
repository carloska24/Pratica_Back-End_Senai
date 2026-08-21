// MISSÃO FINAL M11 · ARRAYS MODERNOS
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

console.log(selecionarDisponiveis(produtos));
