// Exercicio02.js
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
console.log("Soma dos múltiplos:", somaMultiplos);
