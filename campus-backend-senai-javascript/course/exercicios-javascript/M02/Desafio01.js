// Desafio01.js
// Objetivo: liberar apenas quando as duas condições forem verdadeiras.

const placaAprovada = true;
const quantidadeComponentes = 145;

// && significa: as duas condições precisam ser true.
if (placaAprovada && quantidadeComponentes >= 100) {
    console.log("Liberar para montagem");
} else {
    console.log("Enviar para inspeção");
}
