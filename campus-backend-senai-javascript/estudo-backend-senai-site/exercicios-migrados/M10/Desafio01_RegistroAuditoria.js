// Desafio01_RegistroAuditoria.js
function arredondarCentavos(valor) {
    return Math.round(valor * 100) / 100;
}

function criarRegistro(produto, dataIso) {
    const instante = new Date(dataIso);
    const nome = produto.nome.trim();
    const preco = arredondarCentavos(produto.preco);

    return `${produto.codigo} | ${nome} | R$ ${preco.toFixed(2)} | ${instante.toISOString()}`;
}

const produto = { codigo: "P-104", nome: "  Teclado  ", preco: 249.899 };
console.log(criarRegistro(produto, "2026-08-20T15:30:00.000Z"));
