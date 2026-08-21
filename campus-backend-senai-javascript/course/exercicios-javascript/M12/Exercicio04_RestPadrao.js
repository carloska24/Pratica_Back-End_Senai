// M12 · Exercício 04 · Rest e parâmetros padrão
// Receba qualquer quantidade de valores e use zero quando nenhum for enviado.

function somarValores(...valores) {
  return valores.reduce((total, valor) => total + valor, 0);
}

function formatarTotal(total = 0) {
  return `R$ ${total.toFixed(2)}`;
}

console.log(formatarTotal(somarValores(10, 20, 5.5)));
console.log(formatarTotal(somarValores()));

