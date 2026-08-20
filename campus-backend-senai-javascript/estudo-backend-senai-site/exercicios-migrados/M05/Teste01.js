// Teste01.js
// Objetivo: confirmar se o conceito da caixinha quantidade foi compreendido.

let produtos = 0;

for (let contador = 1; contador <= 30; contador++) {
    if (contador % 3 === 0) {
        produtos++;
        console.log(contador);
    }
}

console.log("Quantidade de produtos:", produtos);
