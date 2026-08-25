import { describe, expect, it } from "vitest";
import { interpretJavaScript } from "./interpreter";
import { explainSnapshot } from "./pedagogy";

describe("explainSnapshot", () => {
  it("explica a condição usando os valores substituídos", () => {
    const trace = interpretJavaScript("const idade = 15;\nif (idade >= 18) { console.log('sim'); } else { console.log('não'); }");
    const snapshot = trace.snapshots.find(item => item.operation === "condition")!;
    expect(explainSnapshot(snapshot)).toMatchObject({
      title: "A condição escolhe o caminho",
      evidence: "15 >= 18 → false",
      prompt: "Antes de avançar: qual bloco será executado?",
      tone: "decision",
    });
  });

  it("explica a mudança de memória pelo antes e depois", () => {
    const trace = interpretJavaScript("let total = 5;\ntotal += 3;");
    const snapshot = trace.snapshots.find(item => item.operation === "assign" && item.line === 2)!;
    expect(explainSnapshot(snapshot)).toMatchObject({
      title: "Uma caixinha mudou",
      evidence: "total: 5 → 8",
      tone: "memory",
    });
  });
});
