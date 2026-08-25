import type { TutorContent, TutorRequest } from "./schemas";

export const validTutorRequest = (): TutorRequest => ({
  moduleId: "M07",
  code: "function dobro(valor) { return valor * 2; }",
  requestKind: "explain",
  astSummary: {
    summary: "Uma função recebe um valor e devolve seu dobro.",
    concepts: ["função", "parâmetro", "retorno"],
    symbols: [
      { name: "dobro", kind: "function", line: 1 },
      { name: "valor", kind: "parameter", line: 1 },
    ],
    flow: [{ label: "Recebe valor e calcula valor * 2", line: 1 }],
    diagnostics: [],
  },
});

export const validAiContent: TutorContent = {
  title: "Funções em ação",
  overview: "A função calcula e devolve o dobro do argumento recebido.",
  learningGoal: "Relacionar argumento, parâmetro e retorno.",
  concepts: [
    {
      name: "parâmetro",
      explanation: "É o nome usado pela função para receber um valor.",
      evidenceLines: [1],
    },
  ],
  walkthrough: [
    {
      title: "Chamada",
      explanation: "O valor entra na função pelo parâmetro.",
      lines: [1],
    },
  ],
  diagnostics: [],
  checkQuestion: {
    prompt: "Qual valor seria devolvido para 3?",
    hint: "Multiplique o argumento por dois.",
    answer: "O retorno seria 6.",
  },
  nextStep: "Teste a função com números negativos.",
};
