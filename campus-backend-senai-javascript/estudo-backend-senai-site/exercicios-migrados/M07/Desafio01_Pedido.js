// Desafio01_Pedido.js
// Funções pequenas colaboram para calcular o total de um pedido.

function calcularSubtotal(preco, quantidade) {
    return preco * quantidade;
}

function calcularDesconto(subtotal, percentual) {
    return subtotal * (percentual / 100);
}

function calcularTotalPedido(preco, quantidade, percentualDesconto) {
    if (preco <= 0 || quantidade <= 0) {
        return 0;
    }

    const subtotal = calcularSubtotal(preco, quantidade);
    const desconto = calcularDesconto(subtotal, percentualDesconto);
    return subtotal - desconto;
}

const total = calcularTotalPedido(50, 3, 10);
console.log(total);
