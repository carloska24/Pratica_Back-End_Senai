// Exercicio03_Media.js
// O índice percorre o array; o acumulador guarda a soma.

const notas = [8, 7.5, 9, 6.5];
let soma = 0;

for (let indice = 0; indice < notas.length; indice++) {
    soma += notas[indice];
}

const media = soma / notas.length;
console.log("Média:", media);
