// Exercicio03_FilterDisponiveis.js
const produtos = [
    { codigo: "P01", ativo: true, estoque: 8 },
    { codigo: "P02", ativo: false, estoque: 4 },
    { codigo: "P03", ativo: true, estoque: 0 }
];

const disponiveis = produtos.filter(function (produto) {
    return produto.ativo === true && produto.estoque > 0;
});

console.log(disponiveis);
