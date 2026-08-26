import type { TutorRequest, TutorResponse } from "./schemas";

const stripMarkup = (value: string, max: number, fallback: string) => {
  const normalized = value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

  return normalized || fallback;
};

export function createLocalTutorFallback(input: TutorRequest): TutorResponse {
  const concepts = input.astSummary.concepts
    .map((concept) => stripMarkup(concept, 80, "conceito JavaScript"))
    .filter((concept, index, all) => all.indexOf(concept) === index)
    .slice(0, 8)
    .map((concept) => ({
      name: concept,
      explanation: `O analisador local encontrou ${concept} na estrutura do código.`,
      evidenceLines: input.astSummary.symbols
        .filter((symbol) => symbol.name === concept)
        .map((symbol) => symbol.line)
        .slice(0, 12),
    }));

  const walkthrough = input.astSummary.flow.slice(0, 12).map((step, index) => ({
    title: `Etapa ${index + 1}`,
    explanation: stripMarkup(step.label, 600, "Etapa identificada pelo analisador local."),
    lines: step.line ? [step.line] : [],
  }));

  const diagnostics = input.astSummary.diagnostics.slice(0, 10).map((diagnostic) => ({
    severity: diagnostic.severity,
    title:
      diagnostic.severity === "error"
        ? "Erro identificado"
        : diagnostic.severity === "warning"
          ? "Ponto de atenção"
          : "Observação",
    explanation: stripMarkup(
      diagnostic.message,
      500,
      "O analisador local encontrou um ponto para revisão.",
    ),
    ...(diagnostic.line ? { line: diagnostic.line } : {}),
  }));

  return {
    provider: "local",
    isFallback: true,
    notice: "Tutor IA indisponível; exibindo a análise local segura.",
    title: `Lousa local do módulo ${input.moduleId}`,
    overview: stripMarkup(
      input.astSummary.summary,
      900,
      "O analisador local organizou os elementos encontrados no código.",
    ),
    learningGoal: "Relacionar a estrutura encontrada ao comportamento esperado do código.",
    concepts,
    walkthrough,
    diagnostics,
    checkQuestion: {
      prompt: "Qual parte do código produz o resultado final?",
      hint: "Procure uma instrução de retorno, uma atribuição ou uma saída no console.",
      answer: "Compare o fluxo acima com as linhas indicadas para localizar a saída.",
    },
    nextStep: "Revise as linhas indicadas e execute novamente para observar o comportamento.",
  };
}
