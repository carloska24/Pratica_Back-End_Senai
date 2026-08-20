// DesafioExtra01.js
// Objetivo: usar duas caixinhas independentes no mesmo filtro.

let quantidadePares = 0;
let somaPares = 0;

for (let funcionario = 1; funcionario <= 50; funcionario++) {
    if (funcionario % 2 === 0) {
        quantidadePares++;
        somaPares += funcionario;
    }
}

console.log("Quantidade de funcionários pares:", quantidadePares);
console.log("Soma dos códigos pares:", somaPares);
