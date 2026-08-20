// DesafioExtra03.js
// Objetivo: contar e somar múltiplos de 3 entre 1 e 30.

let contador = 1;
let quantidadeMultiplos = 0;
let somaMultiplos = 0;

while (contador <= 30) {
    if (contador % 3 === 0) {
        quantidadeMultiplos++; // conta quantos foram encontrados
        somaMultiplos += contador; // soma os valores encontrados
    }

    contador++;
}

console.log("Quantidade:", quantidadeMultiplos);
console.log("Soma:", somaMultiplos);
