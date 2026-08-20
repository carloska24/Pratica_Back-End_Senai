// Exercicio01_NormalizarCadastro.js
const nomeRecebido = "  Carlos Pereira  ";
const emailRecebido = "  CARLOS@EMAIL.COM ";

const nomeLimpo = nomeRecebido.trim();
const emailNormalizado = emailRecebido.trim().toLowerCase();

console.log("Nome:", nomeLimpo);
console.log("E-mail:", emailNormalizado);
console.log("Original preservado:", emailRecebido);
