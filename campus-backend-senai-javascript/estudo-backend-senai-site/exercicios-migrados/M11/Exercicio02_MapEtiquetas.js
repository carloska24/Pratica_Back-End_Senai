// Exercicio02_MapEtiquetas.js
const produtos = [
    { codigo: "P01", nome: "Teclado" },
    { codigo: "P02", nome: "Mouse" }
];

const etiquetas = produtos.map(function (produto) {
    return `${produto.codigo} - ${produto.nome.toUpperCase()}`;
});

console.log(etiquetas);
