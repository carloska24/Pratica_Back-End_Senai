// DesafioExtra01.js
// Objetivo: contar ocorrências, não somar os valores encontrados.

let contador = -5;
let quantidadePositivos = 0;

while (contador <= 5) {
    if (contador > 0) {
        // Aumenta 1 porque encontramos UMA ocorrência positiva.
        quantidadePositivos++;
    }

    contador++;
}

console.log("Quantidade de números positivos:", quantidadePositivos);
