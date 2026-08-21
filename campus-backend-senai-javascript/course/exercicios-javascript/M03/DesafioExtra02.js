// DesafioExtra02.js
// Objetivo: diferenciar a caixinha que percorre da caixinha que acumula.

let contador = 1;
let somaImpares = 0;

while (contador <= 15) {
    if (contador % 2 !== 0) {
        console.log(contador);

        // somaImpares mantém o total acumulado até este momento.
        somaImpares += contador;
    }

    contador++;
}

console.log("Soma dos números ímpares:", somaImpares);
