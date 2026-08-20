// Exercicio03_Caixas.js
function calcularCaixas(quantidadeItens, capacidadePorCaixa) {
    return Math.ceil(quantidadeItens / capacidadePorCaixa);
}

console.log(calcularCaixas(23, 10)); // 3 caixas
