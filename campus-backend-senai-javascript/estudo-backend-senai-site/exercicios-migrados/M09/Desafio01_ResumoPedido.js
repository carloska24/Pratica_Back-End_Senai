// Desafio01_ResumoPedido.js
// Objetos e arrays juntos representam dados parecidos com o JSON de uma API.

function calcularTotalPedido(pedido) {
    let total = 0;

    for (let indice = 0; indice < pedido.itens.length; indice++) {
        const item = pedido.itens[indice];
        total += item.preco * item.quantidade;
    }

    return total;
}

const pedido = {
    numero: 1042,
    cliente: {
        nome: "Carlos",
        cidade: "São Paulo"
    },
    itens: [
        { descricao: "Teclado", preco: 249.50, quantidade: 1 },
        { descricao: "Mouse", preco: 89.75, quantidade: 2 }
    ]
};

console.log("Cliente:", pedido.cliente.nome);
console.log("Total:", calcularTotalPedido(pedido));
