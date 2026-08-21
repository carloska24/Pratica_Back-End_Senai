// Desafio01.js
// Objetivo: calcular valor total, desconto e parcelamento da produção.

const valorPlaca = 18.75;
const placasProduzidas = 325;

const valorTotalProducao = valorPlaca * placasProduzidas;
const desconto = valorTotalProducao * 0.10;
const valorComDesconto = valorTotalProducao - desconto;
const valorParcela = valorComDesconto / 5;

console.log("Valor total da produção:", valorTotalProducao);
console.log("Valor com 10% de desconto:", valorComDesconto);
console.log("Valor dividido em 5 parcelas:", valorParcela);
