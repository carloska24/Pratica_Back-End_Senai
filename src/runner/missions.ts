import type { MissionId } from "@/runner/contracts";

export const missionTests: Record<MissionId, string> = {
  M07: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof calcularSubtotal !== "function" || typeof calcularDesconto !== "function" || typeof calcularTotalPedido !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Subtotal de 50 x 3", 150, () => calcularSubtotal(50, 3));
  __record("Desconto de 10% sobre 150", 15, () => calcularDesconto(150, 10));
  __record("Total do pedido", 135, () => calcularTotalPedido(50, 3, 10));
  __record("Preço inválido devolve zero", 0, () => calcularTotalPedido(0, 3, 10));
}
`,
  M08: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof possuiCodigo !== "function" || typeof calcularMedia !== "function" || typeof registrarCodigo !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Encontra código no meio", true, () => possuiCodigo([101, 205, 310, 411], 310));
  __record("Código ausente devolve false", false, () => possuiCodigo([101, 205, 310, 411], 999));
  __record("Média das quatro notas", 7.75, () => calcularMedia([8, 7.5, 9, 6.5]));
  __record("Array vazio devolve zero", 0, () => calcularMedia([]));
  __record("Registra código novo", "true|101,205,310,411,512", () => {
    const lista = [101, 205, 310, 411];
    return String(registrarCodigo(lista, 512)) + "|" + lista.join(",");
  });
  __record("Impede código duplicado", "false|101,205,310,411", () => {
    const lista = [101, 205, 310, 411];
    return String(registrarCodigo(lista, 310)) + "|" + lista.join(",");
  });
}
`,
  M09: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

const __pedidoBase = () => ({
  codigo: "PED-104",
  cliente: { nome: "Carlos", cidade: "São Paulo" },
  itens: [
    { codigo: "TEC-01", descricao: "Teclado", preco: 249.50, quantidade: 1 },
    { codigo: "MOU-02", descricao: "Mouse", preco: 89.75, quantidade: 2 }
  ]
});

if (typeof calcularTotalPedido !== "function" || typeof resumirPedido !== "function" || typeof registrarItem !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Calcula o total dos itens", 429, () => calcularTotalPedido(__pedidoBase()));
  __record("Pedido vazio devolve zero", 0, () => calcularTotalPedido({ codigo: "PED-VAZIO", cliente: { nome: "Ana" }, itens: [] }));
  __record("Resume propriedades aninhadas", "PED-104|Carlos|2|429", () => {
    const resumo = resumirPedido(__pedidoBase());
    return [resumo.codigo, resumo.cliente, resumo.quantidadeItens, resumo.total].join("|");
  });
  __record("Registra um item novo", "true|3|CAB-03", () => {
    const pedidoTeste = __pedidoBase();
    const resultado = registrarItem(pedidoTeste, { codigo: "CAB-03", descricao: "Cabo", preco: 25, quantidade: 1 });
    return String(resultado) + "|" + pedidoTeste.itens.length + "|" + pedidoTeste.itens[2]?.codigo;
  });
  __record("Impede código duplicado", "false|2", () => {
    const pedidoTeste = __pedidoBase();
    const resultado = registrarItem(pedidoTeste, { codigo: "MOU-02", descricao: "Outro mouse", preco: 100, quantidade: 1 });
    return String(resultado) + "|" + pedidoTeste.itens.length;
  });
  __record("Usa a quantidade de cada item", 748.5, () => calcularTotalPedido({
    codigo: "PED-QTD",
    cliente: { nome: "Bia" },
    itens: [
      { codigo: "A", preco: 100, quantidade: 3 },
      { codigo: "B", preco: 149.50, quantidade: 3 }
    ]
  }));
}
`,
  M10: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof normalizarEmail !== "function" || typeof calcularPrecoFinal !== "function" || typeof criarRegistro !== "function") {
  __tests.push({ name: "Três funções declaradas", ok: false, expected: "3 funções", received: "Função ausente" });
} else {
  __record("Normaliza e-mail recebido", "carlos@email.com", () => normalizarEmail("  CARLOS@EMAIL.COM  "));
  __record("Mantém e-mail já normalizado", "ana@teste.com", () => normalizarEmail("ana@teste.com"));
  __record("Arredonda desconto para centavos", 16.99, () => calcularPrecoFinal(19.99, 15));
  __record("Calcula preço final exato", 224.91, () => calcularPrecoFinal(249.90, 10));
  __record("Cria registro ISO previsível", "P-104 | Teclado | R$ 249.90 | 2026-08-20T15:30:00.000Z", () => criarRegistro(
    { codigo: "P-104", nome: "  Teclado  ", preco: 249.90 },
    "2026-08-20T15:30:00.000Z"
  ));
  __record("Converte fuso para UTC", "X-9 | Mouse | R$ 89.50 | 2027-01-05T08:15:30.000Z", () => criarRegistro(
    { codigo: "X-9", nome: " Mouse ", preco: 89.5 },
    "2027-01-05T05:15:30-03:00"
  ));
}
`,
  M11: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};
const __catalogo = () => [
  { codigo: "P01", nome: "Teclado", preco: 249.50, estoque: 2, ativo: true },
  { codigo: "P02", nome: "Mouse", preco: 89.75, estoque: 4, ativo: true },
  { codigo: "P03", nome: "Cabo", preco: 10, estoque: 0, ativo: true },
  { codigo: "P04", nome: "Suporte", preco: 100, estoque: 1, ativo: false }
];

if (typeof selecionarDisponiveis !== "function" || typeof criarEtiquetas !== "function" || typeof buscarPorCodigo !== "function" || typeof todosPrecosValidos !== "function" || typeof calcularValorEstoque !== "function") {
  __tests.push({ name: "Cinco funções declaradas", ok: false, expected: "5 funções", received: "Função ausente" });
} else {
  __record("Usa os cinco métodos modernos", true, () => {
    const fontes = [selecionarDisponiveis, criarEtiquetas, buscarPorCodigo, todosPrecosValidos, calcularValorEstoque].map(fn => fn.toString()).join(" ");
    return ["filter", "map", "find", "every", "reduce"].every(metodo => fontes.includes("." + metodo + "("));
  });
  __record("Seleciona somente disponíveis", "P01,P02", () => selecionarDisponiveis(__catalogo()).map(produto => produto.codigo).join(","));
  __record("Cria etiquetas sem perder posições", "P01 - TECLADO|P02 - MOUSE|P03 - CABO|P04 - SUPORTE", () => criarEtiquetas(__catalogo()).join("|"));
  __record("Encontra produto pelo código", "Mouse", () => buscarPorCodigo(__catalogo(), "P02")?.nome);
  __record("Busca ausente devolve null", null, () => buscarPorCodigo(__catalogo(), "X99"));
  __record("Aceita catálogo com preços válidos", true, () => todosPrecosValidos(__catalogo()));
  __record("Rejeita preço igual a zero", false, () => todosPrecosValidos([{ codigo: "X", preco: 0 }]));
  __record("Reduz o valor total do estoque", 958, () => calcularValorEstoque(__catalogo()));
}
`,
  M12: `
const __tests = [];
const __record = (name, expected, action) => {
  try {
    const received = action();
    __tests.push({ name, ok: Object.is(received, expected), expected: String(expected), received: String(received) });
  } catch (error) {
    __tests.push({ name, ok: false, expected: String(expected), received: error instanceof Error ? error.message : String(error) });
  }
};

if (typeof criarEtiqueta !== "function" || typeof atualizarProduto !== "function" || typeof somarValores !== "function" || typeof criarResumoUsuario !== "function") {
  __tests.push({ name: "Quatro funções declaradas", ok: false, expected: "4 funções", received: "Função ausente" });
} else {
  __record("Usa a sintaxe moderna estudada", true, () => {
    const etiqueta = criarEtiqueta.toString();
    const atualizar = atualizarProduto.toString();
    const somar = somarValores.toString();
    const resumo = criarResumoUsuario.toString();
    return etiqueta.includes("=>") && atualizar.includes("...") && somar.includes("...") && resumo.includes("?.") && resumo.includes("??") && /\\{\\s*nome\\s*=/.test(resumo);
  });
  __record("Cria etiqueta com arrow function", "P01 - TECLADO", () => criarEtiqueta({ codigo: "P01", nome: "Teclado" }));
  __record("Combina produto e alterações", "P01|5|true", () => {
    const atualizado = atualizarProduto({ codigo: "P01", estoque: 2, ativo: false }, { estoque: 5, ativo: true });
    return [atualizado.codigo, atualizado.estoque, atualizado.ativo].join("|");
  });
  __record("Preserva o objeto original", "2|false", () => {
    const original = { codigo: "P01", estoque: 2 };
    const atualizado = atualizarProduto(original, { estoque: 8 });
    return original.estoque + "|" + String(original === atualizado);
  });
  __record("Soma quantidade variável de valores", 10, () => somarValores(1, 2, 3, 4));
  __record("Rest vazio devolve zero", 0, () => somarValores());
  __record("Resume usuário completo", "Carlos|Campinas", () => {
    const resumo = criarResumoUsuario({ nome: "Carlos", endereco: { cidade: "Campinas" } });
    return resumo.nome + "|" + resumo.cidade;
  });
  __record("Protege dados ausentes com padrões", "Visitante|Não informada", () => {
    const resumo = criarResumoUsuario();
    return resumo.nome + "|" + resumo.cidade;
  });
}
`,
};
