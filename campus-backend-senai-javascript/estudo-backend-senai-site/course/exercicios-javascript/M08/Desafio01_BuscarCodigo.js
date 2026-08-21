// Desafio01_BuscarCodigo.js
// A função percorre o array e encerra quando encontra o código.

function possuiCodigo(codigos, codigoProcurado) {
    for (let indice = 0; indice < codigos.length; indice++) {
        if (codigos[indice] === codigoProcurado) {
            return true;
        }
    }

    return false;
}

const codigos = [101, 205, 310, 411];
console.log(possuiCodigo(codigos, 310));
console.log(possuiCodigo(codigos, 999));
