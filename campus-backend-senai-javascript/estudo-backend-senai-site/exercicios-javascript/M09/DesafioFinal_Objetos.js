// MISSÃO FINAL M09 · OBJETOS
// Use objetos, arrays, for, if, return e push para cuidar de um pedido.

function calcularTotalPedido(pedido) {
    // percorra pedido.itens e some preco * quantidade
    // um pedido sem itens deve devolver 0
}

function resumirPedido(pedido) {
    // devolva um novo objeto com:
    // codigo, cliente, quantidadeItens e total
}

function registrarItem(pedido, novoItem) {
    // não permita dois itens com o mesmo codigo
    // adicione o item e devolva true; se for duplicado, devolva false
}

const pedido = {
    codigo: "PED-104",
    cliente: { nome: "Carlos", cidade: "São Paulo" },
    itens: [
        { codigo: "TEC-01", descricao: "Teclado", preco: 249.50, quantidade: 1 },
        { codigo: "MOU-02", descricao: "Mouse", preco: 89.75, quantidade: 2 }
    ]
};

console.log("Total:", calcularTotalPedido(pedido));
console.log("Resumo:", resumirPedido(pedido));
