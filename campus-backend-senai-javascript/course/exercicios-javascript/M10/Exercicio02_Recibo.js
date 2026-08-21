// Exercicio02_Recibo.js
const produto = "Cabo de rede";
const preco = 18.50;
const quantidade = 4;
const subtotal = preco * quantidade;

const linha = `${quantidade}x ${produto} | R$ ${subtotal.toFixed(2)}`;
console.log(linha);
