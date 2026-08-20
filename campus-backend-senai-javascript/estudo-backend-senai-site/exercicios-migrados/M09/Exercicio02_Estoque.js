// Exercicio02_Estoque.js
// Colchetes permitem acessar uma propriedade usando uma chave dinâmica.

const produto = {
    codigo: "P002",
    nome: "Mouse",
    estoque: 12
};

const campo = "estoque";
produto[campo] -= 3;
produto.ultimaMovimentacao = "saída";

console.log(produto);
