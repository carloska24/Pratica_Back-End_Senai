// Exercicio04_ValidarLote.js
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

console.log(encontrado, possuiEsgotado, todosPrecosValidos);
