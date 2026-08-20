// Exercicio01_ForEachEstoque.js
const produtos = ["Teclado", "Mouse", "Monitor"];

produtos.forEach(function (produto, indice) {
    console.log(`${indice + 1}. ${produto}`);
});
