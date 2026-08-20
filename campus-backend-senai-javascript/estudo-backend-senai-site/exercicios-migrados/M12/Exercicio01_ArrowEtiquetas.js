// M12 · Exercício 01 · Arrow functions
// Transforme cada produto em uma etiqueta sem perder a clareza da intenção.

const criarEtiqueta = (produto) =>
  `${produto.codigo} - ${produto.nome.toUpperCase()}`;

console.log(criarEtiqueta({ codigo: "P01", nome: "Teclado" }));

