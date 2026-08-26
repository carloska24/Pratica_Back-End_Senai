import { describe, expect, it } from "vitest";
import type { ExecutionResult, TeachingAnalysis } from "../../runner/contracts";
import { tutorRequestSchema } from "../../tutor/schemas";
import { interpretJavaScript } from "../../interpreter/interpreter";

describe("payload do Tutor", () => {
  it("converte análise e execução para o contrato validado da API", async () => {
    const modulePath = "./tutorPayload";
    const module = await import(/* @vite-ignore */ modulePath).catch(() => ({}));
    const buildTutorRequest = (module as { buildTutorRequest?: (analysis: TeachingAnalysis, code: string, execution: ExecutionResult | null) => unknown }).buildTutorRequest;
    expect(buildTutorRequest).toBeTypeOf("function");
    if (!buildTutorRequest) return;

    const analysis: TeachingAnalysis = {
      sourceVersion: "abc",
      moduleId: "M07",
      summary: ["Uma função recebe um valor."],
      concepts: [{ name: "function", expected: true, found: true }],
      variables: [{ name: "resultado", declaration: "const", line: 2, scope: "dobro", initialValue: "valor * 2" }],
      functions: [{ name: "dobro", parameters: ["valor"], line: 1, calls: [], returns: ["resultado"] }],
      flow: [{ id: "1", kind: "function", label: "Declara dobro", line: 1, evidence: "inferred" }],
      diagnostics: [],
      question: null,
    };
    const execution: ExecutionResult = { logs: ["10"], tests: [{ name: "dobra", ok: true, expected: "10", received: "10" }] };
    const payload = buildTutorRequest(analysis, "function dobro(valor) { return valor * 2; }", execution);

    expect(tutorRequestSchema.safeParse(payload).success).toBe(true);
    expect(payload).toEqual(expect.objectContaining({ moduleId: "M07", requestKind: "deepen" }));
  });

  it("limita o aprofundamento ao snapshot selecionado", async () => {
    const { buildSnapshotTutorRequest } = await import("./tutorPayload");
    const code = "const idade = 15;\nif (idade >= 18) { console.log('sim'); } else { console.log('não'); }";
    const trace = interpretJavaScript(code);
    const snapshot = trace.snapshots.find(item => item.operation === "condition")!;
    const payload = buildSnapshotTutorRequest("M02", code, snapshot, trace);

    expect(tutorRequestSchema.safeParse(payload).success).toBe(true);
    expect(payload.astSummary.summary).toContain("15 >= 18");
    expect(payload.astSummary.flow).toEqual([{ label: snapshot.effect?.summary, line: snapshot.line }]);
    expect(payload.astSummary.symbols.some(symbol => symbol.name === "idade")).toBe(true);
  });
});
