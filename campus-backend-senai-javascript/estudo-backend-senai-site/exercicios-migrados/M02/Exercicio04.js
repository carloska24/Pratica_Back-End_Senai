// Exercicio04.js
// Objetivo: escolher um comportamento a partir de um valor conhecido.

const plano = "Premium";

switch (plano) {
    case "Basico":
        console.log("Acesso limitado");
        break;
    case "Premium":
        console.log("Acesso completo");
        break;
    case "Enterprise":
        console.log("Acesso empresarial");
        break;
    default:
        console.log("Plano inexistente");
}
