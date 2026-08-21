// M12 · Exercício 03 · Spread
// Crie um novo produto com as alterações, preservando o objeto original.

const produtoOriginal = { codigo: "P01", nome: "Teclado", estoque: 2, ativo: false };
const alteracoes = { estoque: 5, ativo: true };

const produtoAtualizado = { ...produtoOriginal, ...alteracoes };

console.log(produtoOriginal);
console.log(produtoAtualizado);

