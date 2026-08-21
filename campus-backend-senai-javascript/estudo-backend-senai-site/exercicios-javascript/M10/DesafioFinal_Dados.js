// MISSÃO FINAL M10 · STRINGS, MATH E DATE
// Transforme dados brutos em valores previsíveis para o Backend.

function normalizarEmail(email) {
    // retire espaços externos e converta para letras minúsculas
}

function calcularPrecoFinal(preco, percentualDesconto) {
    // aplique o desconto e arredonde o resultado para centavos
}

function criarRegistro(produto, dataIso) {
    // devolva: CODIGO | nome sem espaços | R$ 0.00 | data ISO em UTC
    // use trim(), toFixed(2), new Date() e toISOString()
}

const produto = { codigo: "P-104", nome: "  Teclado  ", preco: 249.90 };
console.log(criarRegistro(produto, "2026-08-20T15:30:00.000Z"));
