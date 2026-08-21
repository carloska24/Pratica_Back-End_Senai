// DesafioExtra01.js
// Objetivo: distinguir valor mutável de valor que não deve ser reatribuído.

let placasProduzidas = 100;
const META = 150;

placasProduzidas += 25;
placasProduzidas += 15;
placasProduzidas -= 5;

const faltam = META - placasProduzidas;

console.log("Produzidas:", placasProduzidas);
console.log("Meta:", META);
console.log("Faltam:", faltam);
