import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import type { TeachingAnalysis } from "../../runner/contracts";
import type { TutorResponse } from "../../tutor/schemas";

const analysis: TeachingAnalysis = {
  sourceVersion: "abc123",
  moduleId: "M07",
  summary: ["O código possui 1 função e 1 variável."],
  concepts: [
    { name: "function", found: true, expected: true },
    { name: "return", found: true, expected: true },
  ],
  variables: [{ name: "resultado", declaration: "const", line: 2, initialValue: "valor * 2", scope: "dobro" }],
  functions: [{ name: "dobro", parameters: ["valor"], line: 1, calls: [], returns: ["resultado"] }],
  flow: [
    { id: "flow-1", kind: "function", label: "Declara a função dobro(valor)", line: 1, evidence: "inferred" },
    { id: "flow-2", kind: "return", label: "Retorna resultado", line: 3, evidence: "inferred" },
  ],
  diagnostics: [],
  question: {
    prompt: "Qual é o papel do return?",
    answer: "Entregar resultado.",
    explanation: "return devolve um valor para quem chamou.",
  },
};

describe("Lousa Didática", () => {
  it("apresenta resumo, fluxo, variáveis, funções e pergunta de fixação", async () => {
    const module = await import("./TeachingBoard");
    const TeachingBoard = (module as { TeachingBoard?: React.ComponentType<{
      analysis: TeachingAnalysis;
      fileName: string;
      stale: boolean;
      onRequestTutor: () => void;
    }> }).TeachingBoard;

    expect(TeachingBoard).toBeTypeOf("function");
    if (!TeachingBoard) return;

    const html = renderToStaticMarkup(createElement(TeachingBoard, { analysis, fileName: "Exercicio.js", stale: false, onRequestTutor: vi.fn() }));

    expect(html).toContain("Lousa Didática");
    expect(html).toContain("Mapa de execução");
    expect(html).toContain("Variáveis e responsabilidades");
    expect(html).toContain("Contratos das funções");
    expect(html).toContain("Pergunta de fixação");
    expect(html).toContain("Exercicio.js");
  });

  it("renderiza a explicação estruturada do tutor sem HTML arbitrário", async () => {
    const { TeachingBoard } = await import("./TeachingBoard");
    const tutor: TutorResponse = {
      provider: "local",
      isFallback: true,
      notice: "Tutor IA indisponível; exibindo a análise local segura.",
      title: "Funções em linguagem de sala de aula",
      overview: "A função recebe um valor e entrega outro.",
      learningGoal: "Distinguir parâmetro de argumento.",
      concepts: [{ name: "return", explanation: "Entrega o resultado.", evidenceLines: [3] }],
      walkthrough: [{ title: "Entrada", explanation: "O argumento 5 ocupa o parâmetro valor.", lines: [1] }],
      diagnostics: [],
      checkQuestion: { prompt: "Quem recebe o número 5?", hint: "Veja a assinatura.", answer: "O parâmetro valor." },
      nextStep: "Troque o argumento e execute novamente.",
    };
    const Component = TeachingBoard as React.ComponentType<React.ComponentProps<typeof TeachingBoard> & { tutor?: TutorResponse }>;

    const html = renderToStaticMarkup(createElement(Component, { analysis, fileName: "Exercicio.js", stale: false, onRequestTutor: vi.fn(), tutor }));

    expect(html).toContain("Explicação do Tutor");
    expect(html).toContain("Funções em linguagem de sala de aula");
    expect(html).toContain("O argumento 5 ocupa o parâmetro valor.");
    expect(html).not.toContain("dangerouslySetInnerHTML");
  });
});
