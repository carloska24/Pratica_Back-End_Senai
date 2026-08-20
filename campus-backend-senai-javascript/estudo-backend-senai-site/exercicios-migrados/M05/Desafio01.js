// Desafio01.js
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
console.log("Soma dos múltiplos de 7:", somaMultiplos);
