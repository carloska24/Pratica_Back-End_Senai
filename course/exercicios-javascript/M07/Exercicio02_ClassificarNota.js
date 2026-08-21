// Exercicio02_ClassificarNota.js
// A função recebe uma nota, decide e devolve uma classificação.

function classificarNota(nota) {
    if (nota >= 7) {
        return "Aprovado";
    }

    return "Revisar";
}

console.log(classificarNota(8.5));
console.log(classificarNota(5));
