// M12 · Desafio 01 · Resposta segura
// Leia uma resposta incompleta sem provocar erro e aplique valores substitutos.

function criarResumoUsuario({ nome = "Visitante", endereco } = {}) {
  const cidade = endereco?.cidade ?? "Não informada";
  return { nome, cidade };
}

console.log(criarResumoUsuario({ nome: "Carlos", endereco: { cidade: "Campinas" } }));
console.log(criarResumoUsuario({ nome: "Ana" }));
console.log(criarResumoUsuario());

