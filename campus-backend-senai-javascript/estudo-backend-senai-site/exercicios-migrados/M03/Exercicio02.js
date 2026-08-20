// Exercicio02.js
// Objetivo: produzir uma tabuada com repetição.

const numero = 7;
let contador = 1;

while (contador <= 10) {
    const resultado = numero * contador;
    console.log(`${numero} x ${contador} = ${resultado}`);
    contador++;
}
