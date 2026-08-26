import { describe, expect, it } from "vitest";

describe("analisador da Lousa Didática", () => {
  it("extrai variáveis, funções, parâmetros, chamadas e retornos da AST", async () => {
    const analyzer = await import("./analyzer");
    const analyzeJavaScript = (analyzer as unknown as {
      analyzeJavaScript?: (code: string, moduleId: string) => {
        variables: Array<{ name: string; declaration: string; line: number }>;
        functions: Array<{ name: string; parameters: string[]; line: number; calls: string[]; returns: string[] }>;
        diagnostics: unknown[];
      };
    }).analyzeJavaScript;

    expect(analyzeJavaScript).toBeTypeOf("function");
    if (!analyzeJavaScript) return;

    const result = analyzeJavaScript(`function dobro(valor) {
  const resultado = valor * 2;
  return resultado;
}
const resposta = dobro(5);
console.log(resposta);`, "M07");

    expect(result.variables).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "resultado", declaration: "const", line: 2 }),
      expect.objectContaining({ name: "resposta", declaration: "const", line: 5 }),
    ]));
    expect(result.functions).toEqual([
      expect.objectContaining({
        name: "dobro",
        parameters: ["valor"],
        line: 1,
        calls: [],
        returns: ["resultado"],
      }),
    ]);
    expect(result.diagnostics).toEqual([]);
  });

  it("transforma erro de sintaxe em diagnóstico didático com localização", async () => {
    const { analyzeJavaScript } = await import("./analyzer");

    const result = analyzeJavaScript("function quebrada( {\n  return true;\n}", "M07");

    expect(result.diagnostics[0]).toEqual(expect.objectContaining({
      kind: "syntax",
      line: expect.any(Number),
      column: expect.any(Number),
    }));
    expect(result.diagnostics[0]?.message).toEqual(expect.any(String));
  });

  it("reconhece arrow function atribuída a uma variável", async () => {
    const { analyzeJavaScript } = await import("./analyzer");

    const result = analyzeJavaScript("const somar = (a, b) => a + b;\nconsole.log(somar(2, 3));", "M12");

    expect(result.functions).toEqual([
      expect.objectContaining({ name: "somar", parameters: ["a", "b"], line: 1, returns: ["a + b"] }),
    ]);
  });

  it("monta os blocos semânticos usados pela lousa", async () => {
    const { analyzeJavaScript } = await import("./analyzer");
    const result = analyzeJavaScript(`function aprovar(nota) {
  if (nota >= 7) return true;
  return false;
}
const aprovado = aprovar(8);
console.log(aprovado);`, "M07") as unknown as {
      sourceVersion?: string;
      summary?: string[];
      concepts?: Array<{ name: string; found: boolean; expected: boolean }>;
      flow?: Array<{ kind: string; line: number; evidence: string }>;
      question?: { prompt: string; answer: string; explanation: string } | null;
    };

    expect(result.sourceVersion).toMatch(/^[a-z0-9]+$/);
    expect(result.summary?.join(" ")).toContain("função");
    expect(result.concepts).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "function", found: true, expected: true }),
      expect.objectContaining({ name: "return", found: true, expected: true }),
    ]));
    expect(result.flow?.map(step => step.kind)).toEqual(expect.arrayContaining(["function", "decision", "return", "variable", "call"]));
    expect(result.flow?.every(step => step.line > 0 && step.evidence === "inferred")).toBe(true);
    expect(result.question).toEqual(expect.objectContaining({
      prompt: expect.any(String),
      answer: expect.any(String),
      explanation: expect.any(String),
    }));
  });
});
