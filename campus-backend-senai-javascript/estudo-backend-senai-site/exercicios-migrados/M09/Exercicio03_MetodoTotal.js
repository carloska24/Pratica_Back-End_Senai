// Exercicio03_MetodoTotal.js
// this representa o objeto que recebeu a chamada do método.

const item = {
    descricao: "Cabo de rede",
    preco: 18.50,
    quantidade: 4,
    calcularSubtotal: function () {
        return this.preco * this.quantidade;
    }
};

console.log("Subtotal:", item.calcularSubtotal());
