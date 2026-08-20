// Desafio01_ResumoCatalogo.js
function resumirCatalogo(produtos) {
    const disponiveis = produtos.filter(function (produto) {
        return produto.ativo && produto.estoque > 0;
    });

    const etiquetas = disponiveis.map(function (produto) {
        return `${produto.codigo} - ${produto.nome}`;
    });

    const valorTotal = disponiveis.reduce(function (acumulador, produto) {
        return acumulador + produto.preco * produto.estoque;
    }, 0);

    return { etiquetas: etiquetas, valorTotal: valorTotal };
}
