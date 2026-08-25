import { describe, expect, it } from "vitest";
import type { TeachingAnalysis } from "../../runner/contracts";

describe("apresentação do fluxo didático", () => {
  it("reserva o grafo interativo para fluxos realmente complexos", async () => {
    const modulePath = "./flowPresentation";
    const module = await import(/* @vite-ignore */ modulePath).catch(() => ({}));
    const shouldUseInteractiveFlow = (module as { shouldUseInteractiveFlow?: (analysis: Pick<TeachingAnalysis, "flow" | "functions">) => boolean }).shouldUseInteractiveFlow;

    expect(shouldUseInteractiveFlow).toBeTypeOf("function");
    if (!shouldUseInteractiveFlow) return;

    const linear = { flow: [{ id: "1", kind: "variable", label: "variável", line: 1, evidence: "inferred" }] as TeachingAnalysis["flow"], functions: [] };
    const branching = { flow: [
      { id: "1", kind: "function", label: "função", line: 1, evidence: "inferred" },
      { id: "2", kind: "decision", label: "if", line: 2, evidence: "inferred" },
      { id: "3", kind: "return", label: "retorno", line: 3, evidence: "inferred" },
      { id: "4", kind: "return", label: "retorno", line: 4, evidence: "inferred" },
      { id: "5", kind: "call", label: "chamada", line: 6, evidence: "inferred" },
    ] as TeachingAnalysis["flow"], functions: [] };

    expect(shouldUseInteractiveFlow(linear)).toBe(false);
    expect(shouldUseInteractiveFlow(branching)).toBe(true);
  });
});
