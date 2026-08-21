// Desafio02.js
// Objetivo: selecionar a operação usando switch.

const numero1 = 20;
const numero2 = 10;
const operacao = "+";

switch (operacao) {
    case "+":
        console.log(numero1 + numero2);
        break;
    case "-":
        console.log(numero1 - numero2);
        break;
    case "*":
        console.log(numero1 * numero2);
        break;
    case "/":
        console.log(numero1 / numero2);
        break;
    default:
        console.log("Operação inválida");
}
