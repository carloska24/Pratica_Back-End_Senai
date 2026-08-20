// M12 · Exercício 02 · Destructuring
// Retire somente os dados necessários do pedido e renomeie a propriedade nome.

const pedido = {
  codigo: "PED-104",
  cliente: { nome: "Carlos", cidade: "Campinas" },
  total: 429,
};

const {
  codigo,
  cliente: { nome: nomeCliente },
  total,
} = pedido;

console.log(`${codigo} | ${nomeCliente} | R$ ${total.toFixed(2)}`);

